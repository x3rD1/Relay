export async function sendTranscript(transcript: string) {
  await fetch("http://localhost:3000/api/transcript", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript }),
  });
}
