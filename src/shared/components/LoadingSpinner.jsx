// const LoadingSpinner = ({ size = "medium", message = "Cargando..." }) => {
//   const sizeClasses = {
//     small: "w-4 h-4",
//     medium: "w-8 h-8",
//     large: "w-12 h-12",
//   }

//   return (
//     <div className="flex flex-col items-center justify-center p-4">
//       <div
//         className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
//       ></div>
//       {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
//     </div>
//   )
// }

// export default LoadingSpinner

"use client"

const LoadingSpinner = ({ size = "medium", message = "Cargando..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      ></div>
      {message && <p className="mt-4 text-gray-600 text-sm">{message}</p>}
    </div>
  )
}

export default LoadingSpinner
