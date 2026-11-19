"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function PrintButton() {
  return (
    <button type="button" className="button button-primary" onClick={() => window.print()}>
      PDF indir
    </button>
  );
}

export function QueryToolbar({ controls, secondaryAction, showPrint = false, note = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all" || value === "week") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key !== "assignmentId") {
      params.delete("assignmentId");
    }

    const target = params.toString() ? `${pathname}?${params}` : pathname;
    router.push(target);
  }

  return (
    <section className="toolbar panel">
      <div className="toolbar-controls">
        {controls.map((control) => (
          <label key={control.key} className="control-group">
            <span>{control.label}</span>
            <select
              value={control.value}
              onChange={(event) => updateParam(control.key, event.target.value)}
            >
              {control.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="toolbar-actions">
        {note ? <p className="toolbar-note">{note}</p> : null}
        {secondaryAction ? (
          <Link className="button button-secondary" href={secondaryAction.href}>
            {secondaryAction.label}
          </Link>
        ) : null}
        {showPrint ? <PrintButton /> : null}
      </div>
    </section>
  );
}
