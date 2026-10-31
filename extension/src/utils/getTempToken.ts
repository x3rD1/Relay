export async function getTempToken(clerkToken: string) {
  const response = await fetch("http://localhost:3000/api/deepgram-token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkToken}`,
    },
  });

  if (!response.ok) {
    await chrome.runtime.sendMessage({ action: "capture-error" });
    throw new Error("Failed to get Deepgram token");
  }

  const { token }: { token: string } = await response.json();

  return token;
}
