import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          TailwindCSS Test
        </h1>
        <p className="text-gray-600 hover:text-gray-800 transition-colors">
          If you can see this styled text, Tailwind is working correctly!
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-red-600 transition-colors">
          Test Button
        </button>
      </div>
    </div>
  );
}


export default App
