import React from 'react'

export default function ProjectPageLoading() {
  return (
    <div className="flex flex-col h-screen">
      {/* 顶部导航骨架屏 */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧：文件列表骨架屏 */}
        <div className="w-64 bg-gray-100 p-4 border-r animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-5 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
        
        {/* 主内容区骨架屏 */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 p-6 animate-pulse">
            <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 底部互动区骨架屏 */}
      <div className="flex justify-between items-center py-2 px-4 border-t bg-white">
        <div className="flex space-x-4">
          <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="flex space-x-4">
          <div className="w-10 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-10 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
} 