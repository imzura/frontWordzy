"use client"

import { Trophy, Medal, Award } from "lucide-react"

const RankingCard = ({ title, icon, color, data, loading, filterComponent }) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: {
        border: "border-blue-500",
        bg: "bg-blue-50",
        text: "text-blue-500",
        header: "text-blue-600",
      },
      purple: {
        border: "border-purple-500",
        bg: "bg-purple-50",
        text: "text-purple-500",
        header: "text-purple-600",
      },
      green: {
        border: "border-green-500",
        bg: "bg-green-50",
        text: "text-green-500",
        header: "text-green-600",
      },
    }
    return colors[color] || colors.blue
  }

  const colorClasses = getColorClasses(color)

  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="w-4 h-4 text-yellow-500" />
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />
      case 3:
        return <Award className="w-4 h-4 text-amber-600" />
      default:
        return (
          <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-gray-500">{position}</span>
        )
    }
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border-l-4 ${colorClasses.border} p-4 h-[400px]`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${colorClasses.bg}`}>{icon}</div>
            <h3 className={`font-semibold ${colorClasses.header} text-sm`}>{title}</h3>
          </div>
        </div>
        {filterComponent && <div className="mb-4">{filterComponent}</div>}
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border-l-4 ${colorClasses.border} p-4 h-[400px] flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${colorClasses.bg}`}>{icon}</div>
          <h3 className={`font-semibold ${colorClasses.header} text-sm`}>{title}</h3>
        </div>
      </div>

      {/* Filter Component */}
      {filterComponent && <div className="mb-4">{filterComponent}</div>}

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 pb-2 border-b border-gray-200 text-xs font-medium text-gray-600">
        <div className="col-span-2 text-center">Top</div>
        <div className="col-span-7">Nombre</div>
        <div className="col-span-3 text-center">Puntos</div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto mt-2">
        {data && data.length > 0 ? (
          <div className="space-y-1">
            {data.slice(0, 10).map((student, index) => (
              <div
                key={student.documento || index}
                className="grid grid-cols-12 gap-2 py-2 px-1 hover:bg-gray-50 rounded text-xs items-center"
              >
                <div className="col-span-2 flex justify-center">{getRankIcon(student.posicion || index + 1)}</div>
                <div className="col-span-7 font-medium text-gray-800 truncate" title={student.nombre}>
                  {student.nombre}
                </div>
                <div className={`col-span-3 text-center font-bold ${colorClasses.text}`}>{student.puntos}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <div className="text-center">
              <div className="mb-2">📊</div>
              <div>No hay datos disponibles</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with total count */}
      {data && data.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 text-center">
          Mostrando {Math.min(data.length, 10)} de {data.length} estudiantes
        </div>
      )}
    </div>
  )
}

export default RankingCard
