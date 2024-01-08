import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();
        if (user.error) throw user;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
    async redirect({
      url,
      baseUrl,
    }: {
      url: string;
      baseUrl: string;
    }): Promise<string> {
      console.log("Redirecting...", {
        url,
        baseUrl,
        envBaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      });

      if (url.startsWith(baseUrl + "/api/auth/signout")) {
        return process.env.NEXT_PUBLIC_BASE_URL || baseUrl; // Asegúrate de que esto siempre devuelva una string
      }

      // Devuelve un valor por defecto en caso de que no se cumpla la condición anterior
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
