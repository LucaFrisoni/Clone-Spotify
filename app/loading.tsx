// Gives instant feedback while the server prepares the next page.

const SKELETON_ROWS = 6;

export default function Loading() {
  return (
    <div className="h-full w-full overflow-hidden rounded-lg bg-neutral-900 p-6">
      <div className="h-9 w-48 animate-pulse rounded-md bg-neutral-800" />
      <div className="mt-6 h-11 w-full animate-pulse rounded-md bg-neutral-800" />
      <div className="mt-8 flex flex-col gap-y-3">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-md bg-neutral-800/60" />
        ))}
      </div>
    </div>
  );
}
