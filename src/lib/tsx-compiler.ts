// 用于浏览器端编译和运行TSX文件的工具函数

/**
 * 加载Babel standalone脚本
 */
export function loadBabel(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 如果已加载，直接返回
    if (typeof window !== 'undefined' && window.Babel) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@babel/standalone/babel.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Babel'));
    document.head.appendChild(script);
  });
}

/**
 * 加载React和ReactDOM脚本
 */
export function loadReact(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 如果已加载，直接返回
    if (typeof window !== 'undefined' && window.React && window.ReactDOM) {
      resolve();
      return;
    }

    // 加载React
    const reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    reactScript.async = true;
    document.head.appendChild(reactScript);

    // 加载ReactDOM
    const reactDomScript = document.createElement('script');
    reactDomScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
    reactDomScript.async = true;

    reactDomScript.onload = () => resolve();
    reactDomScript.onerror = () => reject(new Error('Failed to load React'));
    document.head.appendChild(reactDomScript);
  });
}

/**
 * 编译TSX代码
 */
export function compileTSX(code: string): string {
  if (typeof window === 'undefined' || !window.Babel) {
    throw new Error('Babel is not loaded');
  }

  // 使用Babel将TSX编译为JS
  return window.Babel.transform(code, {
    presets: ['react', 'typescript'],
  }).code;
}

/**
 * 创建渲染TSX的容器
 */
export function createTSXContainer(): HTMLElement {
  // 创建包含React根节点的容器
  const container = document.createElement('div');
  container.id = 'tsx-container';
  
  // 创建样式标签
  const style = document.createElement('style');
  style.textContent = `
    #tsx-container {
      width: 100%;
      height: 100%;
      overflow: auto;
      padding: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
  `;
  
  document.head.appendChild(style);
  return container;
}

/**
 * 将编译后的代码封装到脚本标签中
 */
function wrapCodeInScript(compiledCode: string): string {
  return `
    try {
      ${compiledCode}
      
      // 查找默认导出或具名导出的组件
      let Component = typeof exports !== 'undefined' ? (exports.default || Object.values(exports)[0]) : null;
      
      // 如果没有找到，尝试查找全局变量
      if (!Component) {
        for (const key in window) {
          if (typeof window[key] === 'function' && /^[A-Z]/.test(key)) {
            Component = window[key];
            break;
          }
        }
      }
      
      // 渲染组件
      if (Component) {
        ReactDOM.render(React.createElement(Component), document.getElementById('tsx-container'));
      } else {
        console.error('No React component found in the code');
        document.getElementById('tsx-container').innerHTML = '<div class="error">No React component found</div>';
      }
    } catch (error) {
      console.error('Error rendering component:', error);
      document.getElementById('tsx-container').innerHTML = '<div class="error">Error: ' + (error instanceof Error ? error.message : String(error)) + '</div>';
    }
  `;
}

/**
 * 渲染TSX组件到指定容器
 */
export async function renderTSX(tsxCode: string, container: HTMLElement): Promise<void> {
  try {
    // 加载依赖
    await Promise.all([loadBabel(), loadReact()]);
    
    // 编译TSX
    const compiledCode = compileTSX(tsxCode);
    
    // 创建脚本
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = wrapCodeInScript(compiledCode);
    
    // 清空容器
    container.innerHTML = '';
    
    // 添加TSX容器
    const tsxContainer = createTSXContainer();
    container.appendChild(tsxContainer);
    
    // 添加并执行脚本
    document.body.appendChild(script);
    
    // 脚本执行后移除
    setTimeout(() => {
      script.remove();
    }, 100);
  } catch (error) {
    console.error('Error rendering TSX:', error);
    container.innerHTML = `<div class="error">Error rendering TSX: ${error instanceof Error ? error.message : String(error)}</div>`;
  }
} 