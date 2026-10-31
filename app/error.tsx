"use client";
// Shown when a page cannot load its data, so an outage is not mistaken for an empty library.

import Button from "@/components/Button";

interface ErrorPageProps {
  reset: () => void;
}

const ErrorPage = ({ reset }: ErrorPageProps) => {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full flex flex-col items-center justify-center gap-y-4 p-6 text-center">
      <h1 className="text-white text-2xl font-semibold">
        We could not load your music
      </h1>
      <p className="text-neutral-400">
        The music service is unavailable right now. Please try again later.
      </p>
      <div>
        <Button onClick={reset} className="bg-white px-6 py-2">
          Try again
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
