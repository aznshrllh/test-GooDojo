// Determine if we're running in the browser or during SSR
export const baseUrl =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL?.replace("server", "localhost") ||
      "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL || "http://server:3000";
