import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isCapture, setIsCapture] = useState(false);

  useEffect(() => {
    const isCapturing = async () => {
      const res = (await chrome.storage.local.get("isCapturing")) as {
        isCapturing: boolean;
      };

      const capture = res.isCapturing ?? false;
      setIsCapture(capture);
      return;
    };

    isCapturing();
  }, []);

  const handleClick = async () => {
    await chrome.runtime.sendMessage({
      action: !isCapture ? "start-capture" : "stop-capture",
    });

    const nextCapture = !isCapture;
    setIsCapture(nextCapture);
    chrome.storage.local.set({ isCapturing: nextCapture });
  };
  return (
    <section id="center">
      <h1>Reoverlay</h1>
      <button onClick={handleClick}>
        {isCapture ? "Stop capture" : "Start capture"}
      </button>
    </section>
  );
}

export default App;
