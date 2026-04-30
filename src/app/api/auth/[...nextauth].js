import NextAuth from "next-auth";

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const userFound = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!userFound) {
          return Response.json({ error: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          userFound.password,
        );
        if (!isPasswordValid) {
          return Response.json({ error: "Invalid password" });
        }
        return Response.json({ user: userFound });
      },
    }),
  ],
});
