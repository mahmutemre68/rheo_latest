#!/usr/bin/env python3
"""Validate a clean Rheo web build before it is copied into Flutter assets."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path


HASHED_ASSET = re.compile(r"^(?P<name>.+)-[A-Za-z0-9_-]{8,}\.(?P<ext>js|css)$")
INDEX_REF = re.compile(r"(?:src|href)=[\"']\.\/(?P<path>[^\"'#?]+)")


def files(root: Path) -> dict[str, str]:
    return {
        str(path.relative_to(root)): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in sorted(root.rglob("*"))
        if path.is_file()
    }


def validate(root: Path) -> dict[str, object]:
    manifest = files(root)
    required = {"index.html"}
    missing = sorted(required - manifest.keys())
    if missing:
        raise SystemExit(f"missing required file(s): {', '.join(missing)}")

    index = (root / "index.html").read_text(encoding="utf-8")
    refs = sorted(set(INDEX_REF.findall(index)))
    missing_refs = [ref for ref in refs if ref not in manifest]
    if missing_refs:
        raise SystemExit(f"index.html has missing local reference(s): {missing_refs}")

    js_files = [name for name in manifest if name.startswith("assets/") and name.endswith(".js")]
    css_files = [name for name in manifest if name.startswith("assets/") and name.endswith(".css")]
    if not js_files or not css_files:
        raise SystemExit("bundle must contain at least one JS and one CSS asset")

    logical: dict[tuple[str, str], list[str]] = {}
    for name in js_files + css_files:
        match = HASHED_ASSET.match(Path(name).name)
        if match:
            key = (match.group("name"), match.group("ext"))
            logical.setdefault(key, []).append(name)
    duplicates = {f"{k[0]}.{k[1]}": v for k, v in logical.items() if len(v) > 1}
    if duplicates:
        raise SystemExit(f"stale duplicate hashed assets found: {duplicates}")

    return {
        "root": str(root),
        "file_count": len(manifest),
        "index_local_references": refs,
        "js_count": len(js_files),
        "css_count": len(css_files),
        "files": manifest,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("bundle", type=Path)
    parser.add_argument("--compare", type=Path)
    parser.add_argument("--manifest", type=Path)
    parser.add_argument(
        "--asset-manifest",
        type=Path,
        help="write the stable path-only manifest consumed by Flutter fallback",
    )
    args = parser.parse_args()

    result = validate(args.bundle.resolve())
    if args.asset_manifest:
        asset_paths = sorted(
            name for name in result["files"] if name != args.asset_manifest.name
        )
        args.asset_manifest.write_text(
            json.dumps({"files": asset_paths}, indent=2) + "\n",
            encoding="utf-8",
        )
        result = validate(args.bundle.resolve())
    if args.compare:
        comparison = validate(args.compare.resolve())
        if result["files"] != comparison["files"]:
            left = set(result["files"].items())
            right = set(comparison["files"].items())
            raise SystemExit(
                "bundle mismatch:\n"
                f"  only/changed in first: {sorted(left - right)}\n"
                f"  only/changed in second: {sorted(right - left)}"
            )
        result["matches"] = str(args.compare.resolve())

    output = json.dumps(result, indent=2, ensure_ascii=False) + "\n"
    if args.manifest:
        args.manifest.write_text(output, encoding="utf-8")
    print(output, end="")


if __name__ == "__main__":
    main()
