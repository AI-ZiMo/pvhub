/**
 * NextAuth 认证配置文件
 * 
 * 该文件配置了基于 credentials 的用户认证系统,包含:
 * - 用户名密码验证
 * - JWT token 处理
 * - Session 管理
 * - 自定义登录页面
 */

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // 配置登录凭证提供者
      name: "credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        // 验证用户提供的凭证
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // 从数据库查询用户信息
        const user = await db.query.users.findFirst({
          where: eq(users.name, credentials.username),
        });

        // 验证用户是否存在且设置了密码
        if (!user || !user.password) {
          return null;
        }

        // 验证密码是否正确
        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        // 直接返回包含角色信息的用户数据
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          // 添加其他需要的用户信息
        };
      }
    })
  ],
  callbacks: {
    // 当用户登录成功后，NextAuth 会调用这个回调来生成 JWT
    jwt: async ({ token, user }) => {
      if (user) {
        // 将用户信息编码到 token 中
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // JWT 会被用来填充 session
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    // 自定义登录页面路径
    signIn: '/login',
  },
  session: {
    // 使用 JWT 策略管理会话
    strategy: "jwt"
  }
};