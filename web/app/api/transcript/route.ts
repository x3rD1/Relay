export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcript }: { transcript: string } = body;

    console.log(transcript);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
  }
}
