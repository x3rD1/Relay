export interface PolicyMatchesResponse {
  policies: { id: string; name: string }[];
}

export async function fetchPolicyMatches(transcript: string) {
  const response = await fetch("http://localhost:3000/api/transcript", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.error);
  }

  const data: PolicyMatchesResponse = await response.json();

  return data;
}
