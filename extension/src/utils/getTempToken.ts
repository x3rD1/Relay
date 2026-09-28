export async function getTempToken() {
  const response = await fetch("http://localhost:3000/api/deepgram-token", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to get Deepgram token");
  }

  const { token }: { token: string } = await response.json();

  return token;
}
