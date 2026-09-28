export async function POST() {
  const apikey = process.env.DEEPGRAM_API_KEY;

  if (!apikey) {
    return Response.json(
      { error: "Deepgram API key is not configured" },
      { status: 500 },
    );
  }

  const response = await fetch("https://api.deepgram.com/v1/auth/grant", {
    method: "POST",
    headers: {
      Authorization: `Token ${apikey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ttl_seconds: 30,
    }),
  });

  if (!response.ok) {
    return Response.json(
      { error: "Failed to create Deepgram token" },
      { status: response.status },
    );
  }

  const data = await response.json();

  return Response.json({
    token: data.access_token,
  });
}
