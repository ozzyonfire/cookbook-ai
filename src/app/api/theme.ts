import type { RequestInfo } from "rwsdk/worker";

// API handler to manage theme changes
const themeHandler = async ({ request }: RequestInfo) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { theme } = await request.json();

    if (theme !== "light" && theme !== "dark") {
      return new Response("Invalid theme", { status: 400 });
    }

    const response = new Response("OK", { status: 200 });
    
    // Set theme cookie with proper attributes for SSR
    response.headers.set(
      "Set-Cookie", 
      `theme=${theme}; Path=/; HttpOnly=false; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`
    );

    return response;
  } catch (error) {
    return new Response("Invalid request", { status: 400 });
  }
};

export default themeHandler;