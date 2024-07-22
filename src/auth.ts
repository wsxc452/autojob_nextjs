// import NextAuth, { User, NextAuthConfig } from "next-auth";
// // import GithubProvider from "next-auth/providers/github";
// // import GitHub from "next-auth/providers/github";
// import Credentials from "next-auth/providers/credentials";

// console.log(process.env.AUTH_GITHUB_ID);
// export const BASE_PATH = "/api/auth";
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         username: {
//           label: "Username",
//           type: "text",
//           placeholder: "请输入用户名",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//           placeholder: "请输入密码",
//         },
//       },
//       async authorize(credentials): Promise<User | null> {
//         console.log("credentials.....", credentials);
//         const users = [
//           {
//             id: "test-user-1",
//             userName: "wsxc451",
//             name: "Test 1",
//             password: "xiaocao11",
//             email: "test1@donotreply.com",
//           },
//           {
//             id: "test-user-2",
//             userName: "test2",
//             name: "Test 2",
//             password: "pass",
//             email: "test2@donotreply.com",
//           },
//         ];
//         const user = users.find(
//           (user) =>
//             user.userName === credentials.username &&
//             user.password === credentials.password,
//         );
//         return user
//           ? { id: user.id, name: user.name, email: user.email }
//           : null;
//       },
//     }),
//     // GithubProvider({
//     //   clientId: process.env.AUTH_GITHUB_ID,
//     //   clientSecret: process.env.AUTH_GITHUB_SECRET,
//     // }),
//   ],
//   debug: true,
//   basePath: BASE_PATH,
//   // pages: {
//   //   // signIn: "/login",
//   //   // signOut: "/",
//   // },
// });
