"use client";

import dynamic from "next/dynamic";

// react-pdf touches browser APIs — render the studio client-side only.
const ResumeStudio = dynamic(
  () => import("@/components/admin/ResumeStudio"),
  { ssr: false, loading: () => <div className="p-10 text-center text-xl">Loading...</div> }
);

export default function CreateResumePage() {
  return <ResumeStudio />;
}
