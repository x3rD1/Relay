"use client";

import { useState } from "react";

export default function Home() {
  const [hasOverlay, setHasOverlay] = useState(false);

  const handleClick = () => {
    setHasOverlay((prev) => !prev);

    chrome.runtime.sendMessage(
      "bgpdmdnaeieaibnjeepehjllhabchiep",
      {
        action: hasOverlay ? "remove-overlay" : "show-overlay",
        message: "hello from next",
      },
      (response) => {
        const { lastError: err } = chrome.runtime;
        if (err) {
          console.error(err);
          setHasOverlay((prev) => !prev);
          return;
        }

        console.log(response);
      },
    );
  };

  return (
    <div className="flex flex-1 justify-center items-center min-h-full">
      <button
        onClick={handleClick}
        className="p-4 px-8 bg-slate-400 text-black rounded-xl transition-all duration-200 hover:bg-slate-50/80 hover:scale-105 cursor-pointer"
      >
        {hasOverlay ? "Stop Listening" : "Start Listening"}
      </button>
    </div>
  );
}
