import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center relative">
            {/* Fallback message if Tailwind fails */}
            <div
                className="absolute top-0 left-0 w-full bg-red-500 text-white text-center p-2"
                style={{
                    display: 'none', // This will remain hidden if Tailwind is working
                }}
            >
                Tailwind CSS is not working!
            </div>

            <div className="flex gap-4">
                <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
                    <img src={viteLogo} className="h-16 hover:scale-110 transition-transform" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                    <img src={reactLogo} className="h-16 hover:scale-110 transition-transform" alt="React logo" />
                </a>
            </div>
            <h1 className="text-4xl font-bold mt-8">Vite + React</h1>
            <div className="card mt-6 p-6 bg-white rounded-lg shadow-md text-center">
                <button
                    onClick={() => setCount((count) => count + 1)}
                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition"
                >
                    count is {count}
                </button>
                <p className="mt-4 text-sm text-gray-500">
                    Edit <code className="bg-gray-200 px-1 py-0.5 rounded">src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs mt-6 text-gray-600 text-sm">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    );
}

export default App;
