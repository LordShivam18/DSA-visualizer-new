"use client";

import Link from "next/link";

export default function MatrixBackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-[#d9c8ad] bg-white/90 px-4 py-2 text-sm font-medium text-[#5d4a35] shadow-[0_14px_34px_rgba(120,94,56,0.12)] transition-all hover:-translate-x-0.5 hover:border-[#c7b18b] hover:text-[#3d2f22]"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="text-current"
      >
        <path
          d="M10 12L6 8L10 4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </Link>
  );
}
