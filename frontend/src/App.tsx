import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-vh-100 p-8 space-y-6 text-center">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        The Quad 🎓
      </h1>
      <p className="text-lg text-gray-300 max-w-xl">
        College Event & Club Management Platform
      </p>
      
      <div className="p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg font-semibold transition-colors duration-200"
        >
          count is {count}
        </button>
        <p className="mt-4 text-sm text-gray-400">
          Edit <code className="px-1 py-0.5 bg-gray-900 rounded font-mono text-pink-400">src/App.tsx</code> to test HMR
        </p>
      </div>
      
      <p className="text-sm text-gray-500">
        Powered by Vite + React + Tailwind CSS + MERN Stack
      </p>
    </div>
  )
}

export default App
