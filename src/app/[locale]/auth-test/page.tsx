'use client';

import { useState } from 'react';
import { useSession, signIn, signUp, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthTestPage() {
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Test User');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await signUp.email({
        email,
        password,
        name,
      });
      
      if (result.error) {
        setMessage(`注册失败: ${result.error.message}`);
      } else {
        setMessage('注册成功！');
      }
    } catch (error) {
      setMessage(`注册错误: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await signIn.email({
        email,
        password,
      });
      
      if (result.error) {
        setMessage(`登录失败: ${result.error.message}`);
      } else {
        setMessage('登录成功！');
      }
    } catch (error) {
      setMessage(`登录错误: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setMessage('');
    try {
      await signOut();
      setMessage('登出成功！');
    } catch (error) {
      setMessage(`登出错误: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">认证系统测试</h1>
          <p className="text-muted-foreground">测试Better Auth的登录、注册和登出功能</p>
        </div>

        {/* 当前会话状态 */}
        <Card>
          <CardHeader>
            <CardTitle>当前会话状态</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p>加载中...</p>
            ) : session?.user ? (
              <div className="space-y-2">
                <p><strong>已登录用户:</strong> {session.user.name || session.user.email}</p>
                <p><strong>邮箱:</strong> {session.user.email}</p>
                <p><strong>用户ID:</strong> {session.user.id}</p>
                <Button onClick={handleSignOut} disabled={loading}>
                  {loading ? '登出中...' : '登出'}
                </Button>
              </div>
            ) : (
              <p>未登录</p>
            )}
          </CardContent>
        </Card>

        {/* 测试表单 */}
        {!session?.user && (
          <Card>
            <CardHeader>
              <CardTitle>测试登录/注册</CardTitle>
              <CardDescription>使用测试凭据进行登录或注册</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">邮箱</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">密码</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">姓名</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Test User"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button onClick={handleSignUp} disabled={loading}>
                  {loading ? '注册中...' : '注册'}
                </Button>
                <Button onClick={handleSignIn} disabled={loading} variant="outline">
                  {loading ? '登录中...' : '登录'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 消息显示 */}
        {message && (
          <Card>
            <CardContent className="pt-6">
              <p className={message.includes('成功') ? 'text-green-600' : 'text-red-600'}>
                {message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* 调试信息 */}
        <Card>
          <CardHeader>
            <CardTitle>调试信息</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify({ session, isPending }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 