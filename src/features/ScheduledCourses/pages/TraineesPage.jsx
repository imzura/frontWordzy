"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApprenticesWithProgress } from "../hooks/use-apprentices-with-progress";
import ProgrammingDebugInfo from "./programming-debug-info";
import UserMenu from "../../../shared/components/userMenu";
import ProtectedTable from "../../../shared/components/ProtectedTable";

const columns = [
  {
    key: "nombre",
    label: "Nombre",
    render: (item) => (
      <div className="whitespace-normal break-words max-w-md">
        {item.nombre} {item.apellido}
      </div>
    ),
    width: "25%",
  },
  { key: "telefono", label: "Teléfono", width: "15%" },
  {
    key: "puntos",
    label: "Puntos Totales",
    width: "15%",
    render: (item) => {
      return <span>{item.consistentStats?.puntos || 0}</span>;
    },
  },
  {
    key: "evaluaciones",
    label: "Evaluaciones",
    width: "15%",
    render: (item) => {
      const aprobadas = item.consistentStats?.evaluacionesAprobadas || 0;
      const programadas = item.consistentStats?.evaluacionesProgramadas || 0;

      return (
        <span>
          {aprobadas}/{programadas}
        </span>
      );
    },
  },
  {
    key: "progreso",
    label: "Progreso",
    width: "25%",
    render: (item) => {
      const aprobadas = item.consistentStats?.evaluacionesAprobadas || 0;
      const programadas = item.consistentStats?.evaluacionesProgramadas || 0;
      const progressPercentage =
        programadas > 0 ? Math.round((aprobadas / programadas) * 100) : 0;

      return (
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 min-w-[100px]">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <span className="text-sm text-gray-600 w-13 text-right">
            {progressPercentage}%
          </span>
        </div>
      );
    },
  },
];

const TraineesPageUpdated = () => {
  const [showDebug, setShowDebug] = useState(false);
  const navigate = useNavigate();
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [fichaNombre, setFichaNombre] = useState("");
  const [fichaPrograma, setFichaPrograma] = useState("");
  const [nivelNombre, setNivelNombre] = useState("");
  const [nivelNumber, setNivelNumber] = useState(null);
  const [fichaId, setFichaId] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Usar el hook corregido
  const { apprentices, loading, error } = useApprenticesWithProgress(
    fichaNombre,
    fichaId
  );

  useEffect(() => {
    // Recuperar información del nivel y ficha seleccionados
    const selectedNivelNombre = sessionStorage.getItem("selectedNivelNombre");
    const selectedFichaNombre = sessionStorage.getItem("selectedFichaNombre");
    const selectedFichaPrograma = sessionStorage.getItem(
      "selectedFichaPrograma"
    );
    const selectedNivelNumber = sessionStorage.getItem("selectedNivelNumber");
    const selectedFichaId = sessionStorage.getItem("selectedFichaId");

    if (selectedNivelNombre && selectedFichaNombre && selectedFichaId) {
      setNivelNombre(selectedNivelNombre);
      setFichaNombre(selectedFichaNombre);
      setFichaPrograma(selectedFichaPrograma || "");
      setNivelNumber(Number.parseInt(selectedNivelNumber) || 1);
      setFichaId(selectedFichaId);
    } else {
      navigate("/progreso/cursosProgramados");
    }
  }, [navigate]);

  // Función para obtener estadísticas de un aprendiz usando la misma API que ProgressView
  const fetchApprenticeStats = useCallback(async (apprenticeId, level) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/apprentice-progress/apprentice/${apprenticeId}/level/${level}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      if (!response.ok) {
        console.error(
          `Error fetching stats for apprentice ${apprenticeId}:`,
          response.status
        );
        return {
          puntos: 0,
          evaluacionesAprobadas: 0,
          evaluacionesProgramadas: 0,
        };
      }

      const data = await response.json();

      if (data.success && data.data.statistics) {
        console.log(
          `✅ Stats for apprentice ${apprenticeId}:`,
          data.data.statistics
        );
        return {
          puntos: data.data.statistics.puntosAprobadas || 0,
          evaluacionesAprobadas:
            data.data.statistics.evaluacionesAprobadas || 0,
          evaluacionesProgramadas:
            data.data.statistics.evaluacionesProgramadas || 0,
        };
      }

      return {
        puntos: 0,
        evaluacionesAprobadas: 0,
        evaluacionesProgramadas: 0,
      };
    } catch (error) {
      console.error(
        `❌ Error fetching stats for apprentice ${apprenticeId}:`,
        error
      );
      return {
        puntos: 0,
        evaluacionesAprobadas: 0,
        evaluacionesProgramadas: 0,
      };
    }
  }, []);

  // Efecto para calcular estadísticas cuando cambien los aprendices
  useEffect(() => {
    const calculateStatsForAllApprentices = async () => {
      if (apprentices.length > 0 && nivelNumber) {
        console.log(
          `🔄 Calculando estadísticas para ${apprentices.length} aprendices en nivel ${nivelNumber}`
        );
        setStatsLoading(true);

        try {
          const apprenticesWithStats = await Promise.all(
            apprentices.map(async (apprentice) => {
              const apprenticeId = apprentice._id || apprentice.id;
              const stats = await fetchApprenticeStats(
                apprenticeId,
                nivelNumber
              );

              console.log(
                `📊 Aprendiz ${apprentice.nombre}: ${stats.puntos} puntos, ${stats.evaluacionesAprobadas}/${stats.evaluacionesProgramadas} evaluaciones`
              );

              return {
                ...apprentice,
                consistentStats: stats,
              };
            })
          );

          console.log(
            "✅ Todas las estadísticas calculadas:",
            apprenticesWithStats
          );
          setFilteredTrainees(apprenticesWithStats);
        } catch (error) {
          console.error("❌ Error calculando estadísticas:", error);
          setFilteredTrainees(
            apprentices.map((apprentice) => ({
              ...apprentice,
              consistentStats: {
                puntos: 0,
                evaluacionesAprobadas: 0,
                evaluacionesProgramadas: 0,
              },
            }))
          );
        } finally {
          setStatsLoading(false);
        }
      }
    };

    calculateStatsForAllApprentices();
  }, [apprentices, nivelNumber, fetchApprenticeStats]);

  const handleShowProgress = (trainee) => {
    sessionStorage.setItem("selectedTraineeId", trainee.id || trainee._id);
    sessionStorage.setItem("selectedTraineeData", JSON.stringify(trainee));
    navigate(
      `/progreso/cursosProgramados/niveles/aprendices/progreso/${encodeURIComponent(
        `${trainee.nombre} ${trainee.apellido}`
      )}`
    );
  };

  const handleBack = () => {
    navigate("/progreso/cursosProgramados/niveles");
  };

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen">
        <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#1f384c]">
              Cursos programados
            </h1>
            <UserMenu />
          </div>
        </header>
        <div className="flex justify-center my-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <span className="ml-2">
            {statsLoading ? "Calculando estadísticas..." : "Cargando..."}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">
          <p className="font-semibold">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">
            Cursos programados
          </h1>
          <UserMenu />
        </div>
      </header>

      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 bg-gray-200 text-black px-3 py-1.5 text-sm rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Volver a Niveles
          </button>
          {/* <button
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showDebug ? "🔍 Ocultar Debug" : "🔍 Mostrar Debug"}
          </button> */}
        </div>

        {/* Información de debug de la programación */}
        {showDebug && <ProgrammingDebugInfo programName={fichaPrograma} />}

        {/* Información de estado */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold">📊 Estado Actual:</h4>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>
              <span className="font-medium">Nivel:</span> {nivelNombre} (#
              {nivelNumber})
            </div>
            <div>
              <span className="font-medium">Ficha:</span> {fichaNombre}
            </div>
            <div>
              <span className="font-medium">Programa:</span> {fichaPrograma}
            </div>
            <div>
              <span className="font-medium">Aprendices:</span>{" "}
              {filteredTrainees.length}
            </div>
          </div>

          {showDebug && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2">
                🔍 Estadísticas Consistentes (mismo endpoint que ProgressView):
              </h5>
              <div className="text-xs text-gray-600 mb-2">
                <p>
                  • Endpoint:
                  /api/apprentice-progress/apprentice/[id]/level/[level]
                </p>
                <p>• Puntos: statistics.puntosAprobadas</p>
                <p>
                  • Evaluaciones: statistics.evaluacionesAprobadas /
                  statistics.evaluacionesProgramadas
                </p>
              </div>

              {filteredTrainees.length > 0 && (
                <div className="mt-2">
                  <h6 className="font-medium text-gray-600 mb-1">
                    Estadísticas por aprendiz:
                  </h6>
                  <div className="text-xs max-h-40 overflow-y-auto">
                    {filteredTrainees.map((trainee) => (
                      <div
                        key={trainee._id || trainee.id}
                        className="mb-1 p-1 bg-white rounded"
                      >
                        <span className="font-medium">
                          {trainee.nombre} {trainee.apellido}:
                        </span>{" "}
                        {trainee.consistentStats?.puntos || 0} puntos,{" "}
                        {trainee.consistentStats?.evaluacionesAprobadas || 0}/
                        {trainee.consistentStats?.evaluacionesProgramadas || 0}{" "}
                        evaluaciones
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ProtectedTable
          data={filteredTrainees}
          columns={columns}
          module= "Cursos Programados"
          onShow={handleShowProgress}
          tooltipText="Ver Progreso"
          showActions={{ show: true, edit: false, delete: false, add: false }}
          exportToExcel={{
            enabled: true,
            filename: `aprendices_${nivelNombre}_ficha_${fichaNombre}`,
            exportFunction: (data) => {
              let table = '<table border="1">';
              table += "<tr>";
              columns.forEach((column) => {
                table += `<th>${column.label}</th>`;
              });
              table += "</tr>";

              data.forEach((item) => {
                table += "<tr>";
                columns.forEach((column) => {
                  if (column.key === "nombre") {
                    table += `<td>${item.nombre} ${item.apellido}</td>`;
                  } else if (column.key === "progreso") {
                    const aprobadas =
                      item.consistentStats?.evaluacionesAprobadas || 0;
                    const programadas =
                      item.consistentStats?.evaluacionesProgramadas || 0;
                    const progressPercentage =
                      programadas > 0
                        ? Math.round((aprobadas / programadas) * 100)
                        : 0;
                    table += `<td>${progressPercentage}%</td>`;
                  } else if (column.key === "puntos") {
                    table += `<td>${item.consistentStats?.puntos || 0}</td>`;
                  } else if (column.key === "evaluaciones") {
                    const aprobadas =
                      item.consistentStats?.evaluacionesAprobadas || 0;
                    const programadas =
                      item.consistentStats?.evaluacionesProgramadas || 0;
                    table += `<td>${aprobadas}/${programadas}</td>`;
                  } else {
                    table += `<td>${item[column.key] || ""}</td>`;
                  }
                });
                table += "</tr>";
              });

              table += "</table>";

              const blob = new Blob(["\ufeff", table], {
                type: "application/vnd.ms-excel;charset=utf-8",
              });
              const url = URL.createObjectURL(blob);

              const a = document.createElement("a");
              a.href = url;
              a.download = `aprendices_${nivelNombre}_ficha_${fichaNombre}.xls`;
              document.body.appendChild(a);
              a.click();

              setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }, 0);
            },
          }}
        />
      </div>
    </div>
  );
};

export default TraineesPageUpdated;
