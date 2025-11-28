import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const ALLOWED_EMAIL = process.env.NEXTAUTH_EMAIL;
        const ALLOWED_PASSWORD = process.env.NEXTAUTH_PASSWORD;

        if (
          credentials?.email === ALLOWED_EMAIL &&
          credentials?.password === ALLOWED_PASSWORD
        ) {
          return {
            id: "1",
            email: credentials?.email,
            name: "Gustavo Machado",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
