# CodeTok 最佳实践指南

## 📚 开发规范

### 1. 代码风格
```typescript
// ✅ 推荐的写法
const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  const handleUpdate = useCallback(() => {
    onUpdate(user.id);
  }, [user.id, onUpdate]);

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <Button onClick={handleUpdate}>更新</Button>
    </div>
  );
};

// ❌ 不推荐的写法
function UserProfile(props) {
  return (
    <div style={{ padding: '20px' }}>
      <h2>{props.user.name}</h2>
      <button onClick={() => props.onUpdate(props.user.id)}>更新</button>
    </div>
  );
}
```

### 2. 性能优化
```typescript
// ✅ 推荐的写法
const MemoizedComponent = memo(({ data }) => {
  return (
    <div>
      {data.map(item => (
        <Item key={item.id} {...item} />
      ))}
    </div>
  );
});

// ❌ 不推荐的写法
const Component = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <Item key={index} {...item} />
      ))}
    </div>
  );
};
```

## 🎨 UI/UX 规范

### 1. 组件设计
```typescript
// ✅ 推荐的写法
const Button = styled.button`
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

// ❌ 不推荐的写法
const Button = styled.button`
  padding: 10px;
  border-radius: 4px;
  background: blue;
  color: white;
`;
```

### 2. 响应式设计
```typescript
// ✅ 推荐的写法
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: ${props => props.theme.spacing.md};
  }
`;

// ❌ 不推荐的写法
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
`;
```

## 🔧 工具使用

### 1. 状态管理
```typescript
// ✅ 推荐的写法
const useUserState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const data = await api.getUser(id);
      setUser(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, fetchUser };
};

// ❌ 不推荐的写法
const UserComponent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = (id) => {
    setLoading(true);
    api.getUser(id)
      .then(data => setUser(data))
      .finally(() => setLoading(false));
  };
};
```

### 2. 错误处理
```typescript
// ✅ 推荐的写法
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => setError(null)}
      />
    );
  }

  return (
    <ErrorBoundaryContext.Provider value={setError}>
      {children}
    </ErrorBoundaryContext.Provider>
  );
};

// ❌ 不推荐的写法
try {
  // 大块的代码
} catch (error) {
  console.error(error);
}
```

## 📈 性能优化

### 1. 图片优化
```typescript
// ✅ 推荐的写法
const ImageComponent = ({ src, alt }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      loading="lazy"
      sizes="(max-width: 768px) 100vw, 800px"
      quality={75}
    />
  );
};

// ❌ 不推荐的写法
const ImageComponent = ({ src, alt }) => {
  return <img src={src} alt={alt} />;
};
```

### 2. 代码分割
```typescript
// ✅ 推荐的写法
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
});

// ❌ 不推荐的写法
import HeavyComponent from './HeavyComponent';
```

## 🔐 安全最佳实践

### 1. 数据验证
```typescript
// ✅ 推荐的写法
const validateUserInput = (input: unknown): UserInput => {
  const schema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    age: z.number().min(0).max(150),
  });

  return schema.parse(input);
};

// ❌ 不推荐的写法
const processUserInput = (input: any) => {
  return {
    name: input.name,
    email: input.email,
    age: input.age,
  };
};
```

### 2. XSS 防护
```typescript
// ✅ 推荐的写法
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  });
};

// ❌ 不推荐的写法
const renderHtml = (html: string) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
```

## 📱 移动端适配

### 1. 触摸优化
```typescript
// ✅ 推荐的写法
const TouchableComponent = styled.button`
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  padding: 12px; // 足够大的点击区域

  @media (hover: hover) {
    &:hover {
      opacity: 0.8;
    }
  }
`;

// ❌ 不推荐的写法
const Button = styled.button`
  padding: 5px;
  &:hover {
    opacity: 0.8;
  }
`;
```

### 2. 响应式布局
```typescript
// ✅ 推荐的写法
const ResponsiveLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.5rem;
  }
`;

// ❌ 不推荐的写法
const Layout = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
```

## 🧪 测试规范

### 1. 单元测试
```typescript
// ✅ 推荐的写法
describe('UserProfile', () => {
  it('should render user information correctly', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    const { getByText } = render(<UserProfile user={user} />);
    expect(getByText(user.name)).toBeInTheDocument();
    expect(getByText(user.email)).toBeInTheDocument();
  });
});

// ❌ 不推荐的写法
test('renders', () => {
  render(<UserProfile user={{}} />);
});
```

### 2. 集成测试
```typescript
// ✅ 推荐的写法
describe('UserFlow', () => {
  it('should handle user registration flow', async () => {
    const { getByRole, getByLabelText } = render(<RegistrationForm />);
    
    await userEvent.type(getByLabelText('邮箱'), 'test@example.com');
    await userEvent.type(getByLabelText('密码'), 'password123');
    await userEvent.click(getByRole('button', { name: '注册' }));

    expect(await screen.findByText('注册成功')).toBeInTheDocument();
  });
});

// ❌ 不推荐的写法
test('form works', () => {
  const form = render(<Form />);
  form.submit();
});
```

## 📚 文档规范

### 1. 组件文档
```typescript
/**
 * 用户资料卡片组件
 * @component
 * @example
 * ```tsx
 * <UserCard
 *   user={{ name: 'John', avatar: '/avatar.jpg' }}
 *   onEdit={() => {}}
 * />
 * ```
 */
interface UserCardProps {
  /** 用户信息 */
  user: User;
  /** 编辑回调 */
  onEdit?: () => void;
}
```

### 2. 函数文档
```typescript
/**
 * 格式化日期时间
 * @param date - 日期对象或时间戳
 * @param format - 格式化模板
 * @returns 格式化后的字符串
 * @example
 * ```ts
 * formatDate(new Date(), 'YYYY-MM-DD')
 * // => '2024-12-23'
 * ```
 */
function formatDate(date: Date | number, format: string): string {
  // 实现...
}
```

## 🚀 发布流程

### 1. 版本控制
```bash
# ✅ 推荐的提交信息格式
git commit -m "feat(user): 添加用户认证功能

- 实现用户登录
- 添加 JWT 认证
- 集成第三方登录"

# ❌ 不推荐的提交信息
git commit -m "update code"
```

### 2. 发布检查
```bash
# ✅ 推荐的发布流程
pnpm run lint
pnpm run test
pnpm run build
pnpm run e2e
git tag v1.0.0
git push origin v1.0.0

# ❌ 不推荐的发布流程
git push origin main
```

## 📝 更新日志

- 2024-12-23: 初始版本
- 2024-12-24: 添加性能优化最佳实践
- 2024-12-25: 更新移动端适配指南 