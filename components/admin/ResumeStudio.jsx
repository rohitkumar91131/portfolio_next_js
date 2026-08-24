"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pdf } from "@react-pdf/renderer";
import { ArrowLeft, Download, Loader2, FileText } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import ResumeDocument from "@/components/ResumeDocument";
import { buildStack } from "@/lib/constants";

const EMAIL = "rk34190100@gmail.com";
const PHONE = "+91 9113190285";
const LOCATION = "Kolkata, India";
const LINKEDIN_URL = "https://www.linkedin.com/in/rohit-kumar-114037328/";
const GITHUB_URL = "https://github.com/rohitkumar91131";

const SUMMARY =
  "Software developer building modern web applications and real-time systems — from React interfaces to Node.js services and WebRTC-based products.";

export default function ResumeStudio() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [blobUrl, setBlobUrl] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsRes, experienceRes, educationRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/experience"),
          fetch("/api/education"),
        ]);
        const [projectsData, experienceData, educationData] = await Promise.all([
          projectsRes.json(),
          experienceRes.json(),
          educationRes.json(),
        ]);

        if (!projectsData.success || !experienceData.success || !educationData.success) {
          setError("Failed to load portfolio data");
          return;
        }

        setData({
          projects: projectsData.data,
          experience: experienceData.data,
          education: educationData.data,
        });
      } catch {
        setError("Failed to load portfolio data");
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!data) return;

    let revoked = null;
    const generate = async () => {
      setGenerating(true);
      try {
        const active = data.projects.filter((p) => !p.archived);
        const featured = active.filter((p) => p.featured);
        const visibleProjects = featured.length > 0 ? featured : active;

        const blob = await pdf(
          <ResumeDocument
            profile={{
              name: "Rohit Kumar",
              email: EMAIL,
              phone: PHONE,
              location: LOCATION,
              linkedin: LINKEDIN_URL,
              github: GITHUB_URL,
            }}
            summary={SUMMARY}
            experience={data.experience.filter((e) => e.isVisible)}
            education={data.education}
            projects={visibleProjects}
            stack={buildStack(active)}
          />
        ).toBlob();

        revoked = URL.createObjectURL(blob);
        setBlobUrl(revoked);
      } catch {
        setError("Failed to generate the PDF");
      } finally {
        setGenerating(false);
      }
    };
    generate();

    return () => {
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <AdminNav />
      <main className="mx-auto max-w-5xl px-6 py-10 pb-24">
        <Link href="/admin/resumes" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 mb-6">
          <ArrowLeft size={18} /> Back to Resumes
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Resume</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generated from your live portfolio data — experience, projects, education and skills.
            </p>
          </div>
          {blobUrl && (
            <a
              href={blobUrl}
              download="Rohit_Kumar_Resume.pdf"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <Download size={18} /> Download PDF
            </a>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">{error}</div>
        )}

        {generating && (
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin" /> Generating ATS-friendly PDF...
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          {blobUrl ? (
            <iframe
              src={blobUrl}
              title="Resume preview"
              className="w-full h-[80vh] rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-gray-400">
              <FileText size={32} />
              {error ? error : "Preparing preview..."}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-xl text-sm text-gray-700 dark:text-gray-300">
          <p className="font-semibold mb-1">To publish this resume:</p>
          <ol className="list-decimal ml-5 space-y-0.5">
            <li>Download the PDF above.</li>
            <li>Upload it to Cloudinary (or your file host) and copy the public URL.</li>
            <li>
              Go to <Link href="/admin/resumes/add" className="text-blue-600 hover:underline">Add Resume</Link>,
              paste the URL and mark it primary — the site&apos;s Download Resume button updates instantly.
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}
