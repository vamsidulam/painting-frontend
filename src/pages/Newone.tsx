import React from 'react'

const Newone = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center px-6 py-16">
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-yellow-400 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.42 15.17l-5.1-5.1a2.5 2.5 0 113.54-3.54l1.06 1.06 1.06-1.06a2.5 2.5 0 113.54 3.54l-5.1 5.1zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          Under Maintenance
        </h1>
       
        
      </div>
    </div>
  )
}

export default Newone