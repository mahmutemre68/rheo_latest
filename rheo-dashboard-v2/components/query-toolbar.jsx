"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function PrintButton() {
  return (
    <button type="button" className="button button-primary" onClick={() => window.print()}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
        <path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
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
