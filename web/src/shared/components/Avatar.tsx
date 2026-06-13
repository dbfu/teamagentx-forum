import React from 'react'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  seed?: string
  className?: string
}

/**
 * 用户头像组件
 * @param src - 图片地址
 * @param alt - 图片描述
 * @param size - 尺寸：sm(8px)、md(10px)、lg(12px)、xl(16px)
 * @param seed - DiceBear API 的种子值（用于生成随机头像）
 * @param className - 自定义样式类
 */
const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'avatar',
  size = 'md',
  seed,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  // 如果没有提供 src，使用 DiceBear API 生成随机头像
  const avatarSrc = src || `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed || 'default'}`

  return (
    <img
      src={avatarSrc}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
    />
  )
}

export default Avatar