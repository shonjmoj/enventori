"use client";

import { useRef } from "react";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { SmartLink } from "@/components/ui/smart-link";
import type { NavDrawerProps } from "./types";

/** Native <dialog>: focus trap, Escape and inert background for free. */
export function NavDrawer({ links, utilityLinks, labels, className = "" }: NavDrawerProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
        className={`inline-flex min-h-11 items-center gap-2 rounded-md px-3 font-semibold hover:bg-paper ${className}`}
      >
        <MenuIcon className="size-5" />
        <span>{labels.menu}</span>
      </button>

      <dialog
        ref={dialog}
        aria-label={labels.menu}
        onClick={(event) => event.target === dialog.current && close()}
        className="nav-drawer m-0 ml-auto h-dvh max-h-none w-[min(24rem,88vw)] max-w-none bg-surface p-0 text-ink backdrop:bg-ink/50"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <span className="text-lg font-semibold">{labels.menu}</span>
            <button
              type="button"
              onClick={close}
              autoFocus
              className="grid size-11 place-items-center rounded-md hover:bg-paper"
            >
              <CloseIcon className="size-5" />
              <span className="sr-only">{labels.close}</span>
            </button>
          </div>

          {/* Close once a link is followed: client navigation keeps the dialog mounted. */}
          <nav
            className="flex-1 overflow-y-auto px-2 py-3"
            onClick={(event) => (event.target as Element).closest("a") && close()}
          >
            <ul>
              {links.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <SmartLink
                    href={link.href}
                    external={link.external}
                    newTabLabel={labels.newTab}
                    className="flex min-h-12 items-center gap-2 rounded-md px-3 text-[1.05rem] font-medium hover:bg-paper"
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          <ul
            className="border-t border-line px-2 py-3"
            onClick={(event) => (event.target as Element).closest("a") && close()}
          >
            {utilityLinks.map((link) => (
              <li key={link.href}>
                <SmartLink
                  href={link.href}
                  className="flex min-h-12 items-center rounded-md px-3 font-medium text-muted hover:bg-paper hover:text-ink"
                >
                  {link.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
