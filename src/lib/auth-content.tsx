'use client';

/**
 * 认证上下文组件
 * 
 * 功能:
 * - 提供全局认证状态管理
 * - 处理用户登录状态
 * - 提供登出功能
 * - 包装认证相关的上下文数据
 */

import { createContext, useContext } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from 'next-auth';

// 定义认证上下文类型接口
interface AuthContextType {
  user: User | null; // 当前用户信息
  isLoading: boolean; // 加载状态
  logout: () => Promise<void>; // 登出方法
}

// 创建认证上下文并设置默认值
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
});

/**
 * 认证上下文提供者组件
 * 用于包装需要访问认证状态的子组件
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 获取会话状态和路由实例
  const { data: session, status } = useSession();
  const router = useRouter();

  // 处理用户登出
  const logout = async () => {
    await signOut({ redirect: false }); // 登出但不自动跳转
    router.push('/login'); // 手动跳转到登录页
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null, // 提供用户信息
        isLoading: status === 'loading', // 提供加载状态
        logout, // 提供登出方法
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 自定义Hook，用于在组件中获取认证上下文
export const useAuth = () => useContext(AuthContext);