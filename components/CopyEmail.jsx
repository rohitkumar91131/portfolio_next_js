"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — mailto link still works */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="label inline-flex items-center gap-2 transition-colors hover:text-ink"
    >
      {copied ? (
        <>
          <Check size={12} strokeWidth={1.5} aria-hidden="true" />
          Copied
        </>
      ) : (
        <>
          <Copy size={12} strokeWidth={1.5} aria-hidden="true" />
          Copy email
        </>
      )}
    </button>
  );
}
