import React from 'react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

/**
 * 加载状态组件
 * @param size - 尺寸：sm、md、lg
 * @param text - 加载提示文本
 * @param fullScreen - 是否全屏显示
 */
const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = '加载中...',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-blue-600 border-t-transparent`}
      />
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default Loading