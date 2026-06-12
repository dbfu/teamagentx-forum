import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPrevNext?: boolean
}

/**
 * 分页组件
 * @param currentPage - 当前页码
 * @param totalPages - 总页数
 * @param onPageChange - 页码变化回调
 * @param showPrevNext - 是否显示上一页/下一页按钮
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPrevNext = true
}) => {
  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7 // 最多显示7个页码

    if (totalPages <= maxVisible) {
      // 如果总页数少于最大显示数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 总是显示第一页
      pages.push(1)

      // 计算中间显示的页码范围
      let startPage = Math.max(2, currentPage - 2)
      let endPage = Math.min(totalPages - 1, currentPage + 2)

      // 如果当前页靠近开始，显示更多后面的页码
      if (currentPage <= 4) {
        endPage = Math.min(5, totalPages - 1)
      }

      // 如果当前页靠近结束，显示更多前面的页码
      if (currentPage >= totalPages - 3) {
        startPage = Math.max(2, totalPages - 4)
      }

      // 如果中间有省略号
      if (startPage > 2) {
        pages.push('...')
      }

      // 添加中间页码
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // 如果后面有省略号
      if (endPage < totalPages - 1) {
        pages.push('...')
      }

      // 总是显示最后一页
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <nav className="flex items-center justify-center space-x-2">
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
      )}

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="text-gray-400 px-2">
              ...
            </span>
          )
        }

        const pageNum = page as number
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 text-sm rounded ${
              currentPage === pageNum
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        )
      })}

      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      )}
    </nav>
  )
}

export default Pagination