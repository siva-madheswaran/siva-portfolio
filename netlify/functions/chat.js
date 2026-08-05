// Netlify serverless function: POST /.netlify/functions/chat
// Holds the OpenAI API key server-side and forwards chat requests from
// the "Ask about Siva" widget. Set OPENAI_API_KEY in Netlify's site
// environment variables (Site settings -> Environment variables), never
// commit it to the repo.

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server is missing OPENAI_API_KEY" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { system, messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // OpenAI's chat completions API expects the system prompt as the first
    // message in the array, with role "system", rather than as a separate
    // top-level field like Anthropic's API uses.
    const openaiMessages = [{ role: "system", content: system }, ...messages];

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1000,
        messages: openaiMessages,
      }),
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: openaiResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/.netlify/functions/chat",
};
