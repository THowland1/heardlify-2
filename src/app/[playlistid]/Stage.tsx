export function EmptyStage() {
  return (
    <div className="mt-3 flex min-h-10 items-center border border-solid border-zinc-500 pr-2"></div>
  );
}
export function SkippedStage() {
  return (
    <div className="mt-3 flex min-h-10 items-center border border-solid border-zinc-500 pr-2">
      <div className="grid w-12 place-items-center">
        <div className="size-4 rounded-sm border border-zinc-500"></div>
      </div>
      <div className="text-sm font-semibold tracking-widest text-zinc-400">
        SKIPPED
      </div>
    </div>
  );
}
export function IncorrectStage(props: {
  artistName: string;
  songTitle: string;
}) {
  return (
    <div className="mt-3 flex min-h-10 items-center border border-solid border-zinc-500 pr-2">
      <div className="grid w-12 place-items-center">
        <XIcon className="size-5 rounded-sm text-red-400"></XIcon>
      </div>
      <div className="text-sm text-zinc-400">{props.songTitle}</div>
      <div className="mx-1 text-zinc-400">-</div>
      <div className="text-sm text-zinc-400">{props.artistName}</div>
    </div>
  );
}
export function CorrectArtistOnlyStage(props: {
  artistName: string;
  songTitle: string;
}) {
  return (
    <div className="mt-3 flex min-h-10 items-center border border-solid border-zinc-500 pr-2">
      <div className="grid w-12 place-items-center">
        <XIcon className="size-5 rounded-sm text-yellow-300"></XIcon>
      </div>
      <div className="text-sm text-white">{props.songTitle}</div>
      <div className="mx-1 text-zinc-400">-</div>
      <div className="text-sm text-zinc-400">{props.artistName}</div>
    </div>
  );
}

// Shouldn't be accessible, technically
export function CorrectStage(props: { artistName: string; songTitle: string }) {
  return (
    <div className="mt-3 flex min-h-10 items-center border border-solid border-zinc-500 pr-2">
      <div className="grid w-12 place-items-center">
        <CheckIcon className="size-4 text-green-400"></CheckIcon>
      </div>
      <div className="text-sm text-white">{props.songTitle}</div>
      <div className="mx-1 text-zinc-400">-</div>
      <div className="text-sm text-white">{props.artistName}</div>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  );
}
