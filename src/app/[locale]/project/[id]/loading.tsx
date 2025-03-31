import React from 'react'

export default function ProjectPageLoading() {
  return (
    <div className="flex flex-col h-screen">
      {/* 主体内容 - 左右8:2布局 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧主内容区 (80%) - 保持白色背景 */}
        <div className="w-4/5 flex flex-col relative overflow-hidden bg-white">
          {/* 上下滑动按钮 - TikTok风格 */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-3">
            {/* 上滑按钮 */}
            <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center text-white backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </div>
            
            {/* 下滑按钮 */}
            <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center text-white backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          
          {/* 项目标题骨架屏 - TikTok风格叠加在内容上 */}
          <div className="absolute left-4 bottom-8 z-10 max-w-lg">
            <div className="h-10 bg-white/20 w-64 rounded backdrop-blur-sm mb-2"></div>
            <div className="h-5 bg-white/20 w-96 rounded backdrop-blur-sm mb-3"></div>
            <div className="flex items-center mt-3">
              <div className="w-10 h-10 rounded-full bg-gray-700/50 backdrop-blur-sm mr-3"></div>
              <div>
                <div className="h-5 bg-white/20 w-32 rounded backdrop-blur-sm mb-1"></div>
                <div className="h-3 bg-white/10 w-24 rounded backdrop-blur-sm"></div>
              </div>
            </div>
          </div>
          
          {/* 主内容区加载骨架屏 */}
          <div className="flex-1 justify-center items-center flex">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">加载中...</p>
            </div>
          </div>
        </div>
        
        {/* 右侧交互区 (20%) - 保持深色背景 */}
        <div className="w-1/5 border-l border-gray-800 bg-black flex flex-col">
          {/* 项目信息区 */}
          <div className="p-4 border-b border-gray-800">
            <div className="h-6 bg-gray-800 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-4/5 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6 mb-3"></div>
            <div className="flex items-center text-xs mb-2">
              <div className="bg-gray-800 px-2 py-1 rounded w-16 h-5 mr-1"></div>
              <div className="bg-gray-800 w-24 h-5 rounded ml-1"></div>
            </div>
            <div className="h-3 bg-gray-800 rounded w-1/3 mt-2"></div>
          </div>
          
          {/* 文件选择区 */}
          <div className="p-4 border-b border-gray-800">
            <div className="h-4 bg-gray-800 rounded w-1/3 mb-2"></div>
            <div className="w-full bg-gray-800 border border-gray-700 rounded-md h-8"></div>
          </div>
          
          {/* 主要功能按钮区 */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex flex-col gap-3">
              {/* 随机项目按钮 */}
              <div className="h-10 bg-gray-800 border border-gray-700 rounded-md"></div>
              
              {/* 切换代码/预览按钮 */}
              <div className="h-10 bg-gray-800 border border-gray-700 rounded-md"></div>
            </div>
          </div>
          
          {/* 交互按钮区 */}
          <div className="p-4 flex flex-col gap-3">
            {/* 点赞按钮 */}
            <div className="h-10 bg-gray-800/50 rounded-md"></div>
            
            {/* 评论按钮 */}
            <div className="h-10 bg-gray-800/50 rounded-md"></div>
            
            {/* 收藏按钮 */}
            <div className="h-10 bg-gray-800/50 rounded-md"></div>
            
            {/* 分享按钮 */}
            <div className="h-10 bg-gray-800/50 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  )
} 