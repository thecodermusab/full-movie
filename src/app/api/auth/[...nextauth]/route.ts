// NextAuth route - Configure when DATABASE_URL is set
// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth";
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

// For now, return a placeholder
export async function GET() {
  return new Response(JSON.stringify({ message: "Auth not configured" }), { status: 200 });
}

export async function POST() {
  return new Response(JSON.stringify({ message: "Auth not configured" }), { status: 200 });
}
