"use client"; // Error components must be Client Components

import { Button } from "antd";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col content-center items-center justify-center gap-5">
      <div>
        <h2>Something went wrong!</h2>
      </div>
      <div>
        <Button
          danger
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
