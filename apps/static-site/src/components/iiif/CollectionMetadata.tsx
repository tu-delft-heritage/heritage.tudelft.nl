"use client";

import { InternationalString, MetadataItem } from "@iiif/presentation-3";
import { Metadata } from "react-iiif-vault";
import { AutoLanguage } from "../pages/AutoLanguage";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { CloseIcon } from "../atoms/CloseIcon";

export function CollectionMetadata({
  summary,
  metadata,
  content,
}: {
  summary?: InternationalString;
  metadata?: MetadataItem[];
  content: {
    summary: string;
    readMore: string;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Metadata
      allowHtml
      metadata={metadata}
      tableHeader={
        summary ? (
          <div className="mb-4">
            <h3 className="font-mono uppercase">{content.summary}</h3>

            <AutoLanguage first className="mb-5 block max-h-64 overflow-hidden text-ellipsis text-xl">
              {summary}
            </AutoLanguage>

            <Dialog className="relative z-50" open={isOpen} onClose={() => setIsOpen(false)}>
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="fixed inset-0 flex h-screen w-screen items-center p-4">
                <button
                  className="absolute right-8 top-8 z-10 flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100"
                  onClick={() => setIsOpen(false)}
                >
                  <CloseIcon />
                </button>
                <Dialog.Panel className="relative flex h-full w-full justify-center overflow-y-auto overflow-x-hidden rounded bg-white">
                  <article className="prose prose-lg mt-16 h-fit max-w-2xl leading-snug md:leading-normal">
                    <AutoLanguage lines html className="mb-3">
                      {summary}
                    </AutoLanguage>
                  </article>
                </Dialog.Panel>
              </div>
            </Dialog>
            <button onClick={() => setIsOpen(true)} className="my-4 block underline underline-offset-4">
              {content.readMore}
            </button>
          </div>
        ) : null
      }
      classes={{
        container: "bg-black text-white w-full cut-corners block p-8",
        row: "block",
        label: "block uppercase font-mono",
        value: "block text-xl mb-5 with-link",
      }}
    />
  );
}
