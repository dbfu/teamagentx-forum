import Header from '../../../shared/components/Header'

function LoginPage() {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 实现登录逻辑
    alert('登录功能待实现')
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 实现注册逻辑
    alert('注册功能待实现')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-md mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">TeamAgentX 论坛</h1>
            <p className="text-gray-500 mt-2">登录或注册以参与讨论</p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱
              </label>
              <input
                type="email"
                placeholder="请输入邮箱"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                placeholder="请输入密码（6-20字符）"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                minLength={6}
                maxLength={20}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              登录
            </button>
          </form>

          {/* 注册表单 */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-gray-600 mb-4">还没有账号？</p>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  placeholder="请输入邮箱"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <input
                  type="password"
                  placeholder="请输入密码（6-20字符）"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minLength={6}
                  maxLength={20}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  昵称（可选）
                </label>
                <input
                  type="text"
                  placeholder="请输入昵称"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                注册
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage