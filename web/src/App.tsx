import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-gray-900">Easy Coding</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  )
}

function HomePage() {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        欢迎使用 Easy Coding
      </h2>
      <p className="text-gray-600 mb-8">
        这是一个前后端分离的全栈开发模板
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-2">前端技术栈</h3>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>React 18 + Vite 5</li>
            <li>Tailwind CSS 3</li>
            <li>Zustand 4</li>
            <li>React Router DOM 6</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-2">后端技术栈</h3>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>Fastify 4</li>
            <li>Prisma 5</li>
            <li>MySQL 8</li>
            <li>TypeScript 5</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App