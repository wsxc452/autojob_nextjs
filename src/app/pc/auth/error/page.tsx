"use client";

import { useParams, useSearchParams } from "next/navigation";

enum Error {
  Configuration = "Configuration",
}

const errorMap = {
  [Error.Configuration]: (
    <p>
      There was a problem when trying to authenticate. Please contact us if this
      error persists. Unique error code:{" "}
      <code className="rounded-sm bg-slate-100 p-1 text-xs">Configuration</code>
    </p>
  ),
};

export default function AuthErrorPage() {
  const search = useSearchParams();
  const error = search.get("error") as Error;
  const code = search.get("code") as Error;
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <a
        href="#"
        className="border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 block max-w-sm rounded-lg border bg-white p-6 text-center shadow"
      >
        <h5 className="text-gray-900 mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight dark:text-white">
          Something went wrong
        </h5>
        <div className="text-gray-700 dark:text-gray-400 font-normal">
          {errorMap[error] || "Please contact us if this error persists."}
        </div>
      </a>
      <div>{code}</div>
    </div>
  );
}
