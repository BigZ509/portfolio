"use client";

import { useEffect, useId, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { RESUME, ResumeActions, ResumeDocument } from "./resume-document";
import styles from "./resume.module.css";

const FOCUSABLE = 'a[href], button:not([disabled]), object, [tabindex]:not([tabindex="-1"])';

type ResumeDialogProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * In-page resume viewer opened from the navbar. A native modal <dialog> makes the page inert;
 * this component adds a Tab loop, scroll lock and focus restoration. The PDF is only requested
 * while the dialog is open. The /resume route renders the same viewer as a full page.
 */
export function ResumeDialog({ open, onClose }: ResumeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const invoker = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-dialog-initial-focus]")?.focus();
    return () => {
      if (dialog.open) dialog.close();
      root.style.overflow = previousOverflow;
      if (invoker?.isConnected) invoker.focus();
    };
  }, [open]);

  // Native Escape fires `cancel` then `close`; keep React state in step with either path.
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    const pastLast = active !== null && active !== last && !last.contains(active) && Boolean(last.compareDocumentPosition(active) & Node.DOCUMENT_POSITION_FOLLOWING);
    const beforeFirst = active !== null && active !== first && Boolean(first.compareDocumentPosition(active) & Node.DOCUMENT_POSITION_PRECEDING);
    if (event.shiftKey && (active === first || beforeFirst)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || pastLast)) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onClose}
      onKeyDown={onKeyDown}
      // A click on the backdrop (the dialog element itself, outside the sheet) closes it.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {open && (
        <div className={styles.sheet}>
          <header className={styles.sheetHeader}>
            <div className={styles.heading}>
              <span className={styles.seal} aria-hidden="true">✦</span>
              <div>
                <p className={styles.eyebrow}>The Record · one page</p>
                <h2 id={titleId} className={styles.sheetTitle}>{RESUME.title}</h2>
              </div>
            </div>
            <button type="button" className={styles.close} onClick={onClose} data-dialog-initial-focus="">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
              Close
            </button>
          </header>
          <p id={descriptionId} className="sr-only">
            Preview of Marc Alexis&rsquo;s resume, with options to download the PDF or open it in a new tab.
          </p>
          <ResumeActions />
          <ResumeDocument className={styles.sheetPaper} />
        </div>
      )}
    </dialog>
  );
}
