"use client"; // Error components must be Client Components

import { Button } from "antd";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="">
      <div className="bg-gray-100 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-red-600 text-6xl font-bold">Error</h1>
          <p className="text-gray-700 mt-4 text-xl">页面未找到</p>
          <p className="text-gray-500 mt-2">抱歉，我们无法找到您请求的页面。</p>
          <Button href="/">Try again</Button>
        </div>
      </div>

      <h2>{error.message || "Something went wrong!"}</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      ></button>
    </div>
  );
}
