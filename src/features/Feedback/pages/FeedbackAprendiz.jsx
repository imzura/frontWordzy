// // // // "use client"

// // // // import { useState } from "react"
// // // // import { Eye, MessageCircle, Calendar, X } from "lucide-react"

// // // // export default function ApprenticeFeedbackView() {
// // // //   const [showDetailModal, setShowDetailModal] = useState(false)
// // // //   const [selectedFeedback, setSelectedFeedback] = useState(null)

// // // //   const handleViewFeedback = (feedback) => {
// // // //     setSelectedFeedback(feedback)
// // // //     setShowDetailModal(true)
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen bg-[#f5f7f9]">
// // // //       {/* Header */}
// // // //       <header className="bg-[#1f384c] text-white py-4 px-6">
// // // //         <div className="container mx-auto flex justify-between items-center">
// // // //           <h1 className="text-xl font-bold">Wordzy</h1>
// // // //           <div className="flex items-center gap-4">
// // // //             <span className="text-sm">Juan Pérez</span>
// // // //             <div className="w-8 h-8 rounded-full bg-[#cecece] flex items-center justify-center text-[#1f384c] font-bold">
// // // //               JP
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </header>

// // // //       {/* Main Content */}
// // // //       <main className="container mx-auto py-6 px-4">
// // // //         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
// // // //           {/* Page Header */}
// // // //           <div className="p-6 border-b border-gray-200">
// // // //             <h2 className="text-2xl font-bold text-[#1f384c]">Mi Retroalimentación</h2>
// // // //             <p className="text-gray-600 mt-1">Revisa la retroalimentación de tus actividades y evaluaciones</p>
// // // //           </div>

// // // //           {/* Feedback List */}
// // // //           <div className="p-6">
// // // //             {feedbackData.map((feedback) => (
// // // //               <div
// // // //                 key={feedback.id}
// // // //                 className="mb-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
// // // //                 onClick={() => handleViewFeedback(feedback)}
// // // //               >
// // // //                 <div className="flex justify-between items-start mb-2">
// // // //                   <h3 className="font-medium text-[#1f384c]">{feedback.titulo}</h3>
// // // //                   <span
// // // //                     className={`px-2 py-1 rounded-full text-xs font-medium ${
// // // //                       feedback.tipo === "Actividad" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
// // // //                     }`}
// // // //                   >
// // // //                     {feedback.tipo}
// // // //                   </span>
// // // //                 </div>

// // // //                 <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
// // // //                   <div className="flex items-center gap-2">
// // // //                     <Calendar className="w-4 h-4" />
// // // //                     <span>{feedback.fecha}</span>
// // // //                   </div>
// // // //                   <div>
// // // //                     Instructor: <span className="font-medium">{feedback.instructor}</span>
// // // //                   </div>
// // // //                 </div>

// // // //                 <div className="mb-3">
// // // //                   <div className="flex items-center justify-between mb-1">
// // // //                     <span className="text-sm text-gray-600">Calificación</span>
// // // //                     <span className="text-sm font-medium">{feedback.calificacion}%</span>
// // // //                   </div>
// // // //                   <div className="w-full bg-gray-200 rounded-full h-2">
// // // //                     <div
// // // //                       className={`h-2 rounded-full ${getColorByScore(feedback.calificacion)}`}
// // // //                       style={{ width: `${feedback.calificacion}%` }}
// // // //                     ></div>
// // // //                   </div>
// // // //                 </div>

// // // //                 <div className="flex justify-between items-center">
// // // //                   <p className="text-sm text-gray-600 line-clamp-1">{feedback.comentarios}</p>
// // // //                   <button
// // // //                     className="p-1.5 bg-[#1f384c] text-white rounded-lg hover:bg-opacity-90 transition-colors"
// // // //                     onClick={(e) => {
// // // //                       e.stopPropagation()
// // // //                       handleViewFeedback(feedback)
// // // //                     }}
// // // //                   >
// // // //                     <Eye className="w-4 h-4" />
// // // //                   </button>
// // // //                 </div>

// // // //                 {feedback.estado === "No leído" && (
// // // //                   <div className="mt-2 flex items-center">
// // // //                     <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
// // // //                     <span className="text-xs text-blue-600 font-medium">Nuevo</span>
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       </main>

// // // //       {/* Feedback Detail Modal */}
// // // //       {showDetailModal && selectedFeedback && (
// // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // //           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
// // // //             <div className="p-6 border-b border-gray-200 flex justify-between items-center">
// // // //               <h3 className="text-xl font-bold text-[#1f384c]">Detalle de Retroalimentación</h3>
// // // //               <button className="text-gray-600 hover:text-gray-900" onClick={() => setShowDetailModal(false)}>
// // // //                 <X className="w-5 h-5" />
// // // //               </button>
// // // //             </div>

// // // //             <div className="p-6 overflow-y-auto flex-grow">
// // // //               <div className="grid grid-cols-2 gap-4 mb-6">
// // // //                 <div>
// // // //                   <p className="text-sm text-gray-600">Tipo</p>
// // // //                   <p className="font-medium">{selectedFeedback.tipo}</p>
// // // //                 </div>
// // // //                 <div>
// // // //                   <p className="text-sm text-gray-600">Fecha</p>
// // // //                   <p className="font-medium">{selectedFeedback.fecha}</p>
// // // //                 </div>
// // // //                 <div>
// // // //                   <p className="text-sm text-gray-600">Título</p>
// // // //                   <p className="font-medium">{selectedFeedback.titulo}</p>
// // // //                 </div>
// // // //                 <div>
// // // //                   <p className="text-sm text-gray-600">Instructor</p>
// // // //                   <p className="font-medium">{selectedFeedback.instructor}</p>
// // // //                 </div>
// // // //               </div>

// // // //               <div className="mb-6">
// // // //                 <p className="text-sm text-gray-600 mb-2">Calificación</p>
// // // //                 <div className="flex items-center">
// // // //                   <div className="w-full bg-gray-200 rounded-full h-2.5">
// // // //                     <div
// // // //                       className={`h-2.5 rounded-full ${getColorByScore(selectedFeedback.calificacion)}`}
// // // //                       style={{ width: `${selectedFeedback.calificacion}%` }}
// // // //                     ></div>
// // // //                   </div>
// // // //                   <span className="ml-2 text-sm font-medium">{selectedFeedback.calificacion}%</span>
// // // //                 </div>
// // // //               </div>

// // // //               <div>
// // // //                 <p className="text-sm text-gray-600 mb-2">Comentarios</p>
// // // //                 <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
// // // //                   <p className="text-sm text-gray-800 whitespace-pre-line">{selectedFeedback.comentarios}</p>
// // // //                 </div>
// // // //               </div>

// // // //               {selectedFeedback.aspectosMejora && (
// // // //                 <div className="mt-6">
// // // //                   <p className="text-sm text-gray-600 mb-2">Aspectos a mejorar</p>
// // // //                   <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
// // // //                     <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
// // // //                       {selectedFeedback.aspectosMejora.map((aspecto, index) => (
// // // //                         <li key={index}>{aspecto}</li>
// // // //                       ))}
// // // //                     </ul>
// // // //                   </div>
// // // //                 </div>
// // // //               )}

// // // //               {selectedFeedback.fortalezas && (
// // // //                 <div className="mt-6">
// // // //                   <p className="text-sm text-gray-600 mb-2">Fortalezas</p>
// // // //                   <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
// // // //                     <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
// // // //                       {selectedFeedback.fortalezas.map((fortaleza, index) => (
// // // //                         <li key={index}>{fortaleza}</li>
// // // //                       ))}
// // // //                     </ul>
// // // //                   </div>
// // // //                 </div>
// // // //               )}

// // // //               {/* Archivos adjuntos (si los hay) */}
// // // //               {selectedFeedback.archivos && selectedFeedback.archivos.length > 0 && (
// // // //                 <div className="mt-6">
// // // //                   <p className="text-sm text-gray-600 mb-2">Archivos adjuntos</p>
// // // //                   <div className="space-y-2">
// // // //                     {selectedFeedback.archivos.map((archivo, index) => (
// // // //                       <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
// // // //                         <DocumentIcon className="w-5 h-5 text-gray-600 mr-3" />
// // // //                         <span className="text-sm text-gray-800">{archivo.nombre}</span>
// // // //                         <a
// // // //                           href="#"
// // // //                           className="ml-auto text-blue-600 text-sm hover:underline"
// // // //                           onClick={(e) => e.preventDefault()}
// // // //                         >
// // // //                           Descargar
// // // //                         </a>
// // // //                       </div>
// // // //                     ))}
// // // //                   </div>
// // // //                 </div>
// // // //               )}
// // // //             </div>

// // // //             <div className="p-6 border-t border-gray-200 flex justify-between">
// // // //               <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
// // // //                 <MessageCircle className="w-4 h-4" />
// // // //                 Responder
// // // //               </button>

// // // //               <button
// // // //                 className="px-4 py-2 bg-[#1f384c] text-white rounded-lg hover:bg-opacity-90 transition-colors"
// // // //                 onClick={() => setShowDetailModal(false)}
// // // //               >
// // // //                 Cerrar
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   )
// // // // }

// // // // // Helper function to get color based on score
// // // // function getColorByScore(score) {
// // // //   if (score >= 90) return "bg-green-600"
// // // //   if (score >= 80) return "bg-green-500"
// // // //   if (score >= 70) return "bg-yellow-500"
// // // //   if (score >= 60) return "bg-orange-500"
// // // //   return "bg-red-500"
// // // // }

// // // // // Sample data
// // // // const feedbackData = [
// // // //   {
// // // //     id: 1,
// // // //     fecha: "15/03/2025",
// // // //     tipo: "Actividad",
// // // //     titulo: "Listening Practice - Unit 3",
// // // //     instructor: "Carlos Mendoza",
// // // //     estado: "No leído",
// // // //     calificacion: 85,
// // // //     comentarios:
// // // //       "Buen trabajo en general. Has demostrado una buena comprensión de los conceptos principales. Tu pronunciación ha mejorado significativamente desde la última evaluación.\n\nSigue practicando la entonación en preguntas y la fluidez en conversaciones más largas.",
// // // //     aspectosMejora: [
// // // //       "Mejorar la entonación en preguntas",
// // // //       "Trabajar en la fluidez durante conversaciones extensas",
// // // //       "Prestar más atención a los verbos irregulares",
// // // //     ],
// // // //     fortalezas: [
// // // //       "Excelente comprensión auditiva",
// // // //       "Buen uso de vocabulario especializado",
// // // //       "Buena estructura gramatical en general",
// // // //     ],
// // // //     archivos: [
// // // //       { nombre: "audio_feedback.mp3", tipo: "audio" },
// // // //       { nombre: "pronunciation_guide.pdf", tipo: "documento" },
// // // //     ],
// // // //   },
// // // //   {
// // // //     id: 2,
// // // //     fecha: "10/03/2025",
// // // //     tipo: "Evaluación",
// // // //     titulo: "Grammar Test - Present Perfect",
// // // //     instructor: "Ana Gómez",
// // // //     estado: "Leído",
// // // //     calificacion: 92,
// // // //     comentarios:
// // // //       "Excelente desempeño en esta evaluación. Dominas muy bien el Present Perfect y sus usos. Solo hay pequeños detalles a mejorar en cuanto a los adverbios de tiempo.",
// // // //     aspectosMejora: [
// // // //       "Uso correcto de 'since' y 'for'",
// // // //       "Diferenciar entre Present Perfect y Past Simple en contextos específicos",
// // // //     ],
// // // //     fortalezas: [
// // // //       "Dominio de la estructura gramatical",
// // // //       "Buen uso de los verbos irregulares en participio",
// // // //       "Excelente comprensión de los contextos de uso",
// // // //     ],
// // // //   },
// // // //   {
// // // //     id: 3,
// // // //     fecha: "05/03/2025",
// // // //     tipo: "Actividad",
// // // //     titulo: "Writing Assignment - Email Formal",
// // // //     instructor: "Carlos Mendoza",
// // // //     estado: "Leído",
// // // //     calificacion: 78,
// // // //     comentarios:
// // // //       "Tu email formal muestra una buena estructura general, pero hay aspectos a mejorar en cuanto a formalidad y vocabulario específico para comunicaciones de negocios.",
// // // //     aspectosMejora: [
// // // //       "Uso de frases más formales para solicitudes",
// // // //       "Estructura de párrafos en emails profesionales",
// // // //       "Fórmulas de despedida en contextos formales",
// // // //     ],
// // // //     fortalezas: ["Buena estructura general", "Claridad en la comunicación", "Ortografía correcta"],
// // // //     archivos: [{ nombre: "email_corrections.docx", tipo: "documento" }],
// // // //   },
// // // //   {
// // // //     id: 4,
// // // //     fecha: "28/02/2025",
// // // //     tipo: "Evaluación",
// // // //     titulo: "Midterm Oral Exam",
// // // //     instructor: "Ana Gómez",
// // // //     estado: "Leído",
// // // //     calificacion: 88,
// // // //     comentarios:
// // // //       "Muy buen desempeño en el examen oral. Tu fluidez y pronunciación son notables. Hay algunos aspectos gramaticales a mejorar durante la conversación espontánea.",
// // // //     aspectosMejora: ["Concordancia de tiempos verbales en narrativas", "Uso de conectores para mejorar la fluidez"],
// // // //     fortalezas: ["Excelente pronunciación", "Buena capacidad para mantener la conversación", "Amplio vocabulario"],
// // // //   },
// // // //   {
// // // //     id: 5,
// // // //     fecha: "20/02/2025",
// // // //     tipo: "Actividad",
// // // //     titulo: "Reading Comprehension - Advanced",
// // // //     instructor: "Carlos Mendoza",
// // // //     estado: "No leído",
// // // //     calificacion: 95,
// // // //     comentarios:
// // // //       "Excelente comprensión del texto avanzado. Has identificado correctamente los puntos principales y las ideas secundarias. Tu análisis crítico es sobresaliente.",
// // // //     aspectosMejora: ["Profundizar en el análisis de la intención del autor"],
// // // //     fortalezas: [
// // // //       "Excelente comprensión lectora",
// // // //       "Buen análisis crítico",
// // // //       "Capacidad para identificar detalles importantes",
// // // //     ],
// // // //   },
// // // // ]

// // // // // Document icon component
// // // // function DocumentIcon(props) {
// // // //   return (
// // // //     <svg
// // // //       xmlns="http://www.w3.org/2000/svg"
// // // //       width="24"
// // // //       height="24"
// // // //       viewBox="0 0 24 24"
// // // //       fill="none"
// // // //       stroke="currentColor"
// // // //       strokeWidth="2"
// // // //       strokeLinecap="round"
// // // //       strokeLinejoin="round"
// // // //       {...props}
// // // //     >
// // // //       <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
// // // //       <polyline points="14 2 14 8 20 8" />
// // // //     </svg>
// // // //   )
// // // // }

// // // "use client"

// // // import { useState } from "react"
// // // import { ChevronDown, ChevronUp, Lock } from "lucide-react"

// // // export default function ApprenticeFeedbackView() {
// // //   const [expandedLevels, setExpandedLevels] = useState({ 1: true })
// // //   const [expandedTopics, setExpandedTopics] = useState({ greetings: true, "simple-present": true })
// // //   const [showDetailModal, setShowDetailModal] = useState(false)
// // //   const [selectedActivity, setSelectedActivity] = useState(null)

// // //   const toggleLevel = (levelId) => {
// // //     setExpandedLevels((prev) => ({
// // //       ...prev,
// // //       [levelId]: !prev[levelId],
// // //     }))
// // //   }

// // //   const toggleTopic = (topicId) => {
// // //     setExpandedTopics((prev) => ({
// // //       ...prev,
// // //       [topicId]: !prev[topicId],
// // //     }))
// // //   }

// // //   const handleViewDetail = (activity) => {
// // //     setSelectedActivity(activity)
// // //     setShowDetailModal(true)
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-[#f5f7f9] pb-8">
// // //       {/* Header */}
// // //       <header className="bg-[#1f384c] text-white py-4 px-6 mb-6">
// // //         <div className="container mx-auto">
// // //           <h1 className="text-xl font-bold">Wordzy</h1>
// // //         </div>
// // //       </header>

// // //       {/* Main Content */}
// // //       <main className="container mx-auto px-4 max-w-3xl">
// // //         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
// // //           {/* Page Header */}
// // //           <div className="p-6 border-b border-gray-200">
// // //             <h2 className="text-xl font-bold text-[#1f384c]">Mi Retroalimentación</h2>
// // //             <p className="text-gray-600 text-sm mt-1">Revisa tu progreso en las actividades y evaluaciones</p>
// // //           </div>

// // //           {/* Levels */}
// // //           <div className="p-4">
// // //             {/* Level 1 - Expanded */}
// // //             <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
// // //               <div
// // //                 className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
// // //                 onClick={() => toggleLevel(1)}
// // //               >
// // //                 <h3 className="font-medium">Nivel 1</h3>
// // //                 <div className="flex items-center">
// // //                   <div className="mr-3 text-sm">95%</div>
// // //                   {expandedLevels[1] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
// // //                 </div>
// // //               </div>

// // //               {expandedLevels[1] && (
// // //                 <div className="p-4">
// // //                   <div className="mb-3">
// // //                     <div className="flex justify-between text-sm mb-1">
// // //                       <span>Progreso nivel</span>
// // //                       <span>95%</span>
// // //                     </div>
// // //                     <div className="w-full bg-gray-200 rounded-full h-2.5">
// // //                       <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "95%" }}></div>
// // //                     </div>
// // //                   </div>

// // //                   {/* Topics */}
// // //                   <div className="space-y-4 mt-6">
// // //                     {/* Topic 1 - Greetings */}
// // //                     <div className="border border-gray-200 rounded-lg overflow-hidden">
// // //                       <div
// // //                         className="flex justify-between items-center p-3 cursor-pointer"
// // //                         onClick={() => toggleTopic("greetings")}
// // //                       >
// // //                         <h4 className="font-medium text-sm">Greetings & Introductions</h4>
// // //                         <div className="flex items-center">
// // //                           <div className="mr-3 text-sm">100%</div>
// // //                           {expandedTopics["greetings"] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
// // //                         </div>
// // //                       </div>

// // //                       {expandedTopics["greetings"] && (
// // //                         <div className="p-3 border-t border-gray-200">
// // //                           <div className="mb-3">
// // //                             <div className="flex justify-between text-sm mb-1">
// // //                               <span>Progreso</span>
// // //                               <span>100%</span>
// // //                             </div>
// // //                             <div className="w-full bg-gray-200 rounded-full h-2">
// // //                               <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
// // //                             </div>
// // //                           </div>

// // //                           {/* Activities */}
// // //                           <div className="mt-4">
// // //                             <div className="text-sm font-medium mb-2">Actividades:</div>

// // //                             <div className="space-y-3">
// // //                               {greetingsActivities.map((activity) => (
// // //                                 <div key={activity.id} className="border border-gray-200 rounded p-3">
// // //                                   <div className="flex items-start">
// // //                                     <input
// // //                                       type="checkbox"
// // //                                       checked={activity.completed}
// // //                                       readOnly
// // //                                       className="mt-1 mr-3"
// // //                                     />
// // //                                     <div className="flex-1">
// // //                                       <div className="font-medium text-sm">{activity.name}</div>
// // //                                       <div className="text-xs text-gray-500 mt-1">{activity.description}</div>
// // //                                     </div>
// // //                                     <button
// // //                                       className="ml-2 px-2 py-1 bg-[#1f384c] text-white text-xs rounded hover:bg-opacity-90"
// // //                                       onClick={() => handleViewDetail(activity)}
// // //                                     >
// // //                                       Ver Detalle
// // //                                     </button>
// // //                                   </div>
// // //                                 </div>
// // //                               ))}
// // //                             </div>
// // //                           </div>

// // //                           {/* Exams */}
// // //                           <div className="mt-4">
// // //                             <div className="text-sm font-medium mb-2">Examen:</div>

// // //                             <div className="border border-gray-200 rounded p-3">
// // //                               <div className="flex items-start">
// // //                                 <input type="checkbox" checked={true} readOnly className="mt-1 mr-3" />
// // //                                 <div className="flex-1">
// // //                                   <div className="font-medium text-sm">Greeting</div>
// // //                                 </div>
// // //                                 <button
// // //                                   className="ml-2 px-2 py-1 bg-[#1f384c] text-white text-xs rounded hover:bg-opacity-90"
// // //                                   onClick={() =>
// // //                                     handleViewDetail({
// // //                                       id: "exam-1",
// // //                                       name: "Greeting",
// // //                                       type: "Examen",
// // //                                       score: 95,
// // //                                       feedback: "Excelente dominio de los saludos y presentaciones.",
// // //                                     })
// // //                                   }
// // //                                 >
// // //                                   Ver Detalle
// // //                                 </button>
// // //                               </div>
// // //                             </div>
// // //                           </div>
// // //                         </div>
// // //                       )}
// // //                     </div>

// // //                     {/* Topic 2 - Simple Present */}
// // //                     <div className="border border-gray-200 rounded-lg overflow-hidden">
// // //                       <div
// // //                         className="flex justify-between items-center p-3 cursor-pointer"
// // //                         onClick={() => toggleTopic("simple-present")}
// // //                       >
// // //                         <h4 className="font-medium text-sm">Simple Present</h4>
// // //                         <div className="flex items-center">
// // //                           <div className="mr-3 text-sm">60%</div>
// // //                           {expandedTopics["simple-present"] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
// // //                         </div>
// // //                       </div>

// // //                       {expandedTopics["simple-present"] && (
// // //                         <div className="p-3 border-t border-gray-200">
// // //                           <div className="mb-3">
// // //                             <div className="flex justify-between text-sm mb-1">
// // //                               <span>Progreso</span>
// // //                               <span>60%</span>
// // //                             </div>
// // //                             <div className="w-full bg-gray-200 rounded-full h-2">
// // //                               <div className="bg-green-500 h-2 rounded-full" style={{ width: "60%" }}></div>
// // //                             </div>
// // //                           </div>

// // //                           {/* Activities */}
// // //                           <div className="mt-4">
// // //                             <div className="text-sm font-medium mb-2">Actividades:</div>

// // //                             <div className="space-y-3">
// // //                               {simplePresentActivities.map((activity) => (
// // //                                 <div key={activity.id} className="border border-gray-200 rounded p-3">
// // //                                   <div className="flex items-start">
// // //                                     <input
// // //                                       type="checkbox"
// // //                                       checked={activity.completed}
// // //                                       readOnly
// // //                                       className="mt-1 mr-3"
// // //                                     />
// // //                                     <div className="flex-1">
// // //                                       <div className="font-medium text-sm">{activity.name}</div>
// // //                                       <div className="text-xs text-gray-500 mt-1">{activity.description}</div>
// // //                                     </div>
// // //                                     <button
// // //                                       className="ml-2 px-2 py-1 bg-[#1f384c] text-white text-xs rounded hover:bg-opacity-90"
// // //                                       onClick={() => handleViewDetail(activity)}
// // //                                     >
// // //                                       Ver Detalle
// // //                                     </button>
// // //                                   </div>
// // //                                 </div>
// // //                               ))}
// // //                             </div>
// // //                           </div>

// // //                           {/* Exams */}
// // //                           <div className="mt-4">
// // //                             <div className="text-sm font-medium mb-2">Examen:</div>

// // //                             <div className="border border-gray-200 rounded p-3">
// // //                               <div className="flex items-start">
// // //                                 <input type="checkbox" checked={false} readOnly className="mt-1 mr-3" />
// // //                                 <div className="flex-1">
// // //                                   <div className="font-medium text-sm">Simple Present</div>
// // //                                 </div>
// // //                                 <button
// // //                                   className="ml-2 px-2 py-1 bg-[#1f384c] text-white text-xs rounded hover:bg-opacity-90"
// // //                                   onClick={() =>
// // //                                     handleViewDetail({
// // //                                       id: "exam-2",
// // //                                       name: "Simple Present",
// // //                                       type: "Examen",
// // //                                       score: 0,
// // //                                       feedback: "Pendiente de realizar",
// // //                                     })
// // //                                   }
// // //                                 >
// // //                                   Ver Detalle
// // //                                 </button>
// // //                               </div>
// // //                             </div>
// // //                           </div>
// // //                         </div>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>

// // //             {/* Level 2 - Locked */}
// // //             <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden opacity-75">
// // //               <div className="flex justify-between items-center p-4 bg-gray-50">
// // //                 <div className="flex items-center">
// // //                   <Lock size={16} className="mr-2" />
// // //                   <h3 className="font-medium">Nivel 2: Conjugations</h3>
// // //                 </div>
// // //                 <div className="text-sm">El nivel se habilitará al terminar el correspondiente</div>
// // //               </div>
// // //             </div>

// // //             {/* Level 3 - Locked */}
// // //             <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden opacity-75">
// // //               <div className="flex justify-between items-center p-4 bg-gray-50">
// // //                 <div className="flex items-center">
// // //                   <Lock size={16} className="mr-2" />
// // //                   <h3 className="font-medium">Nivel 3: Writing</h3>
// // //                 </div>
// // //                 <div className="text-sm">El nivel se habilitará al terminar el correspondiente</div>
// // //               </div>
// // //             </div>

// // //             {/* Level 4 - Locked */}
// // //             <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden opacity-75">
// // //               <div className="flex justify-between items-center p-4 bg-gray-50">
// // //                 <div className="flex items-center">
// // //                   <Lock size={16} className="mr-2" />
// // //                   <h3 className="font-medium">Nivel 4: Listening</h3>
// // //                 </div>
// // //                 <div className="text-sm">El nivel se habilitará al terminar el correspondiente</div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </main>

// // //       {/* Activity Detail Modal */}
// // //       {showDetailModal && selectedActivity && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // //           <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
// // //             <div className="p-4 border-b border-gray-200">
// // //               <h3 className="text-lg font-bold text-[#1f384c]">{selectedActivity.name}</h3>
// // //               <p className="text-sm text-gray-600">{selectedActivity.type || "Actividad"}</p>
// // //             </div>

// // //             <div className="p-4 overflow-y-auto flex-grow">
// // //               {selectedActivity.score !== undefined && (
// // //                 <div className="mb-4">
// // //                   <div className="text-sm font-medium mb-1">Calificación</div>
// // //                   <div className="flex items-center">
// // //                     <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
// // //                       <div
// // //                         className={`h-2.5 rounded-full ${selectedActivity.score >= 70 ? "bg-green-500" : "bg-yellow-500"}`}
// // //                         style={{ width: `${selectedActivity.score}%` }}
// // //                       ></div>
// // //                     </div>
// // //                     <span className="text-sm font-medium">{selectedActivity.score}%</span>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               <div className="mb-4">
// // //                 <div className="text-sm font-medium mb-1">Retroalimentación</div>
// // //                 <div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm">
// // //                   {selectedActivity.feedback || "No hay retroalimentación disponible para esta actividad."}
// // //                 </div>
// // //               </div>

// // //               {selectedActivity.aspectosMejora && selectedActivity.aspectosMejora.length > 0 && (
// // //                 <div className="mb-4">
// // //                   <div className="text-sm font-medium mb-1">Aspectos a mejorar</div>
// // //                   <div className="p-3 bg-gray-50 rounded border border-gray-200">
// // //                     <ul className="list-disc pl-5 text-sm space-y-1">
// // //                       {selectedActivity.aspectosMejora.map((aspecto, index) => (
// // //                         <li key={index}>{aspecto}</li>
// // //                       ))}
// // //                     </ul>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {selectedActivity.fortalezas && selectedActivity.fortalezas.length > 0 && (
// // //                 <div className="mb-4">
// // //                   <div className="text-sm font-medium mb-1">Fortalezas</div>
// // //                   <div className="p-3 bg-gray-50 rounded border border-gray-200">
// // //                     <ul className="list-disc pl-5 text-sm space-y-1">
// // //                       {selectedActivity.fortalezas.map((fortaleza, index) => (
// // //                         <li key={index}>{fortaleza}</li>
// // //                       ))}
// // //                     </ul>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>

// // //             <div className="p-4 border-t border-gray-200 flex justify-end">
// // //               <button
// // //                 className="px-4 py-2 bg-[#1f384c] text-white rounded hover:bg-opacity-90 transition-colors"
// // //                 onClick={() => setShowDetailModal(false)}
// // //               >
// // //                 Cerrar
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   )
// // // }

// // // // Sample data for Greetings & Introductions activities
// // // const greetingsActivities = [
// // //   {
// // //     id: "g1",
// // //     name: "Beginners guide to english pronunciation",
// // //     description: "",
// // //     completed: true,
// // //     type: "Actividad",
// // //     score: 90,
// // //     feedback: "Excelente pronunciación. Sigue practicando los sonidos /th/ y /r/.",
// // //   },
// // //   {
// // //     id: "g2",
// // //     name: "Conversational",
// // //     description: "",
// // //     completed: true,
// // //     type: "Actividad",
// // //     score: 85,
// // //     feedback: "Buena fluidez en la conversación. Trabaja en la entonación de preguntas.",
// // //   },
// // //   {
// // //     id: "g3",
// // //     name: "Introducing yourself",
// // //     description: "",
// // //     completed: true,
// // //     type: "Actividad",
// // //     score: 95,
// // //     feedback: "Excelente presentación personal. Muy buena estructura y vocabulario.",
// // //   },
// // //   {
// // //     id: "g4",
// // //     name: "Support pronouns",
// // //     description: "",
// // //     completed: true,
// // //     type: "Actividad",
// // //     score: 88,
// // //     feedback: "Buen uso de pronombres. Presta atención a los pronombres posesivos.",
// // //   },
// // //   {
// // //     id: "g5",
// // //     name: "Exam training & introduction",
// // //     description: "",
// // //     completed: true,
// // //     type: "Actividad",
// // //     score: 92,
// // //     feedback: "Muy buena preparación para el examen. Dominas bien los conceptos básicos.",
// // //   },
// // // ]

// // // // Sample data for Simple Present activities
// // // const simplePresentActivities = [
// // //   {
// // //     id: "sp1",
// // //     name: "Presente simple",
// // //     description: "",
// // //     completed: true,
// // //     type: "Actividad",
// // //     score: 80,
// // //     feedback: "Buen manejo de la estructura básica. Presta atención a la tercera persona del singular.",
// // //   },
// // //   {
// // //     id: "sp2",
// // //     name: "Conversational",
// // //     description: "",
// // //     completed: true,
// // //     type: "Actividad",
// // //     score: 75,
// // //     feedback: "Buena conversación usando presente simple. Mejora la fluidez y el uso de adverbios de frecuencia.",
// // //   },
// // //   {
// // //     id: "sp3",
// // //     name: "Support pronouns",
// // //     description: "",
// // //     completed: false,
// // //     type: "Actividad",
// // //     score: 0,
// // //     feedback: "Pendiente de realizar",
// // //   },
// // //   {
// // //     id: "sp4",
// // //     name: "Exam training & introduction",
// // //     description: "",
// // //     completed: false,
// // //     type: "Actividad",
// // //     score: 0,
// // //     feedback: "Pendiente de realizar",
// // //   },
// // // ]
// // "use client"

// // import { useState } from "react"
// // import { ChevronDown, ChevronUp, Lock } from "lucide-react"

// // export default function ApprenticeFeedbackView() {
// //   const [expandedLevels, setExpandedLevels] = useState({ 1: true })
// //   const [expandedTopics, setExpandedTopics] = useState({ temas: true, greetings: true, "simple-present": true })
// //   const [showDetailModal, setShowDetailModal] = useState(false)
// //   const [selectedActivity, setSelectedActivity] = useState(null)

// //   const toggleLevel = (levelId) => {
// //     setExpandedLevels((prev) => ({
// //       ...prev,
// //       [levelId]: !prev[levelId],
// //     }))
// //   }

// //   const toggleTopic = (topicId) => {
// //     setExpandedTopics((prev) => ({
// //       ...prev,
// //       [topicId]: !prev[topicId],
// //     }))
// //   }

// //   const handleViewDetail = (activity) => {
// //     setSelectedActivity(activity)
// //     setShowDetailModal(true)
// //   }

// //   return (
// //     <div className="min-h-screen bg-[#f5f7f9] pb-8">
// //       {/* Header */}
// //       <header className="bg-[#1f384c] text-white py-4 px-6 mb-6">
// //         <div className="container mx-auto">
// //           <h1 className="text-xl font-bold">Wordzy</h1>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="container mx-auto px-4 max-w-3xl">
// //         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
// //           {/* Page Header */}
// //           <div className="p-6 border-b border-gray-200">
// //             <h2 className="text-xl font-bold text-[#1f384c]">Mi Retroalimentación</h2>
// //             <p className="text-gray-600 text-sm mt-1">Revisa tu progreso en las actividades y evaluaciones</p>
// //           </div>

// //           {/* Levels */}
// //           <div className="p-4">
// //             {/* Level 1 - Expanded */}
// //             <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
// //               <div
// //                 className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
// //                 onClick={() => toggleLevel(1)}
// //               >
// //                 <h3 className="font-medium">Nivel 1</h3>
// //                 <div className="flex items-center">
// //                   <div className="mr-3 text-sm">95%</div>
// //                   {expandedLevels[1] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
// //                 </div>
// //               </div>

// //               {expandedLevels[1] && (
// //                 <div className="p-4">
// //                   <div className="mb-3">
// //                     <div className="flex justify-between text-sm mb-1">
// //                       <span>Progreso nivel</span>
// //                       <span>95%</span>
// //                     </div>
// //                     <div className="w-full bg-gray-200 rounded-full h-2.5">
// //                       <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "95%" }}></div>
// //                     </div>
// //                   </div>

// //                   {/* Temas section */}
// //                   <div className="mt-6">
// //                     <div className="border border-gray-200 rounded-lg overflow-hidden">
// //                       <div
// //                         className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
// //                         onClick={() => toggleTopic("temas")}
// //                       >
// //                         <h4 className="font-medium">Temas</h4>
// //                         <div>{expandedTopics["temas"] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
// //                       </div>

// //                       {expandedTopics["temas"] && (
// //                         <div className="p-3 border-t border-gray-200">
// //                           {/* Topic 1 - Greetings */}
// //                           <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
// //                             <div
// //                               className="flex justify-between items-center p-3 cursor-pointer"
// //                               onClick={() => toggleTopic("greetings")}
// //                             >
// //                               <h4 className="font-medium text-sm">Greetings & Introductions</h4>
// //                               <div className="flex items-center">
// //                                 <div className="mr-3 text-sm">100%</div>
// //                                 {expandedTopics["greetings"] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
// //                               </div>
// //                             </div>

// //                             {expandedTopics["greetings"] && (
// //                               <div className="p-3 border-t border-gray-200">
// //                                 <div className="mb-3">
// //                                   <div className="flex justify-between text-sm mb-1">
// //                                     <span>Progreso</span>
// //                                     <span>100%</span>
// //                                   </div>
// //                                   <div className="w-full bg-gray-200 rounded-full h-2">
// //                                     <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
// //                                   </div>
// //                                 </div>

// //                                 {/* Activities */}
// //                                 <div className="mt-4">
// //                                   <div className="text-sm font-medium mb-2">Actividades:</div>

// //                                   <div className="space-y-3">
// //                                     {greetingsActivities.map((activity) => (
// //                                       <div key={activity.id} className="border border-gray-200 rounded p-3">
// //                                         <div className="flex items-start">
// //                                           <input
// //                                             type="checkbox"
// //                                             checked={activity.completed}
// //                                             readOnly
// //                                             className="mt-1 mr-3"
// //                                           />
// //                                           <div className="flex-1">
// //                                             <div className="font-medium text-sm">{activity.name}</div>
// //                                             <div className="text-xs text-gray-500 mt-1">{activity.description}</div>
// //                                           </div>
// //                                           <button
// //                                             className="ml-2 px-2 py-1 bg-[#1f384c] text-white text-xs rounded hover:bg-opacity-90"
// //                                             onClick={() => handleViewDetail(activity)}
// //                                           >
// //                                             Ver Detalle
// //                                           </button>
// //                                         </div>
// //                                       </div>
// //                                     ))}
// //                                   </div>
// //                                 </div>

// //                                 {/* Exams */}
// //                                 <div className="mt-4">
// //                                   <div className="text-sm font-medium mb-2">Examen:</div>

// //                                   <div className="border border-gray-200 rounded p-3">
// //                                     <div className="flex items-start">
// //                                       <input type="checkbox" checked={true} readOnly className="mt-1 mr-3" />
// //                                       <div className="flex-1">
// //                                         <div className="font-medium text-sm">Greeting</div>
// //                                       </div>
// //                                       <button
// //                                         className="ml-2 px-2 py-1 bg-[#1f384c] text-white text-xs rounded hover:bg-opacity-90"
// //                                         onClick={() =>
// //                                           handleViewDetail({
// //                                             id: "exam-1",
// //                                             name: "Greeting",
// //                                             type: "Examen",
// //                                             score: 95,
// //                                             feedback: "Excelente dominio de los saludos y presentaciones.",
// //                                           })
// //                                         }
// //                                       >
// //                                         Ver Detalle
// //                                       </button>
// //                                     </div>
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                             )}
// //                           </div>

// //                           {/* Topic 2 - Simple Present */}
// //                           <div className="border border-gray-200 rounded-lg overflow-hidden">
// //                             <div
// //                               className="flex justify-between items-center p-3 cursor-pointer"
// //                               onClick={() => toggleTopic("simple-present")}
// //                             >
// //                               <h4 className="font-medium text-sm">Simple Present</h4>
// //                               <div className="flex items-center">
// //                                 <div className="mr-3 text-sm">60%</div>
// //                                 {expandedTopics["simple-present"] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
// //                               </div>
// //                             </div>

// //                             {expandedTopics["simple-present"] && (
// //                               <div className="p-3 border-t border-gray-200">
// //                                 <div className="mb-3">
// //                                   <div className="flex justify-between text-sm mb-1">
// //                                     <span>Progreso</span>
// //                                     <span>60%</span>
// //                                   </div>
// //                                   <div className="w-full bg-gray-200 rounded-full h-2">
// //                                     <div className="bg-green-500 h-2 rounded-full" style={{ width: "60%" }}></div>
// //                                   </div>
// //                                 </div>

// //                                 {/* Activities */}
// //                                 <div className="mt-4">
// //                                   <div className="text-sm font-medium mb-2">Actividades:</div>

// //                                   <div className="space-y-3">
// //                                     {simplePresentActivities.map((activity) => (
// //                                       <div key={activity.id} className="border border-gray-200 rounded p-3">
// //                                         <div className="flex items-start">
// //                                           <input
// //                                             type="checkbox"
// //                                             checked={activity.completed}
// //                                             readOnly
// //                                             className="mt-1 mr-3"
// //                                           />
// //                                           <div className="flex-1">
// //                                             <div className="font-medium text-sm">{activity.name}</div>
// //                                             <div className="text-xs text-gray-500 mt-1">{activity.description}</div>
// //                                           </div>
// //                                           <button
// //                                             className="ml-2 px-2 py-1 bg-[#1f384c] text-white text-xs rounded hover:bg-opacity-90"
// //                                             onClick={() => handleViewDetail(activity)}
// //                                           >
// //                                             Ver Detalle
// //                                           </button>
// //                                         </div>
// //                                       </div>
// //                                     ))}
// //                                   </div>
// //                                 </div>

// //                                 {/* Exams */}
// //                                 <div className="mt-4">
// //                                   <div className="text-sm font-medium mb-2">Examen:</div>

// //                                   <div className="border border-gray-200 rounded p-3">
// //                                     <div className="flex items-start">
// //                                       <input type="checkbox" checked={false} readOnly className="mt-1 mr-3" />
// //                                       <div className="flex-1">
// //                                         <div className="font-medium text-sm">Simple Present</div>
// //                                       </div>
// //                                       <button
// //                                         className="ml-2 px-2 py-1 bg-[#1f384c] text-white text-xs rounded hover:bg-opacity-90"
// //                                         onClick={() =>
// //                                           handleViewDetail({
// //                                             id: "exam-2",
// //                                             name: "Simple Present",
// //                                             type: "Examen",
// //                                             score: 0,
// //                                             feedback: "Pendiente de realizar",
// //                                           })
// //                                         }
// //                                       >
// //                                         Ver Detalle
// //                                       </button>
// //                                     </div>
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                             )}
// //                           </div>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Level 2 - Locked */}
// //             <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden opacity-75">
// //               <div className="flex justify-between items-center p-4 bg-gray-50">
// //                 <div className="flex items-center">
// //                   <Lock size={16} className="mr-2" />
// //                   <h3 className="font-medium">Nivel 2: Conjugations</h3>
// //                 </div>
// //                 <div className="text-sm">El nivel se habilitará al terminar el correspondiente</div>
// //               </div>
// //             </div>

// //             {/* Level 3 - Locked */}
// //             <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden opacity-75">
// //               <div className="flex justify-between items-center p-4 bg-gray-50">
// //                 <div className="flex items-center">
// //                   <Lock size={16} className="mr-2" />
// //                   <h3 className="font-medium">Nivel 3: Writing</h3>
// //                 </div>
// //                 <div className="text-sm">El nivel se habilitará al terminar el correspondiente</div>
// //               </div>
// //             </div>

// //             {/* Level 4 - Locked */}
// //             <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden opacity-75">
// //               <div className="flex justify-between items-center p-4 bg-gray-50">
// //                 <div className="flex items-center">
// //                   <Lock size={16} className="mr-2" />
// //                   <h3 className="font-medium">Nivel 4: Listening</h3>
// //                 </div>
// //                 <div className="text-sm">El nivel se habilitará al terminar el correspondiente</div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </main>

// //       {/* Activity Detail Modal */}
// //       {showDetailModal && selectedActivity && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
// //             <div className="p-4 border-b border-gray-200">
// //               <h3 className="text-lg font-bold text-[#1f384c]">{selectedActivity.name}</h3>
// //               <p className="text-sm text-gray-600">{selectedActivity.type || "Actividad"}</p>
// //             </div>

// //             <div className="p-4 overflow-y-auto flex-grow">
// //               {selectedActivity.score !== undefined && (
// //                 <div className="mb-4">
// //                   <div className="text-sm font-medium mb-1">Calificación</div>
// //                   <div className="flex items-center">
// //                     <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
// //                       <div
// //                         className={`h-2.5 rounded-full ${selectedActivity.score >= 70 ? "bg-green-500" : "bg-yellow-500"}`}
// //                         style={{ width: `${selectedActivity.score}%` }}
// //                       ></div>
// //                     </div>
// //                     <span className="text-sm font-medium">{selectedActivity.score}%</span>
// //                   </div>
// //                 </div>
// //               )}

// //               <div className="mb-4">
// //                 <div className="text-sm font-medium mb-1">Retroalimentación</div>
// //                 <div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm">
// //                   {selectedActivity.feedback || "No hay retroalimentación disponible para esta actividad."}
// //                 </div>
// //               </div>

// //               {selectedActivity.aspectosMejora && selectedActivity.aspectosMejora.length > 0 && (
// //                 <div className="mb-4">
// //                   <div className="text-sm font-medium mb-1">Aspectos a mejorar</div>
// //                   <div className="p-3 bg-gray-50 rounded border border-gray-200">
// //                     <ul className="list-disc pl-5 text-sm space-y-1">
// //                       {selectedActivity.aspectosMejora.map((aspecto, index) => (
// //                         <li key={index}>{aspecto}</li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 </div>
// //               )}

// //               {selectedActivity.fortalezas && selectedActivity.fortalezas.length > 0 && (
// //                 <div className="mb-4">
// //                   <div className="text-sm font-medium mb-1">Fortalezas</div>
// //                   <div className="p-3 bg-gray-50 rounded border border-gray-200">
// //                     <ul className="list-disc pl-5 text-sm space-y-1">
// //                       {selectedActivity.fortalezas.map((fortaleza, index) => (
// //                         <li key={index}>{fortaleza}</li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="p-4 border-t border-gray-200 flex justify-end">
// //               <button
// //                 className="px-4 py-2 bg-[#1f384c] text-white rounded hover:bg-opacity-90 transition-colors"
// //                 onClick={() => setShowDetailModal(false)}
// //               >
// //                 Cerrar
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // // Sample data for Greetings & Introductions activities
// // const greetingsActivities = [
// //   {
// //     id: "g1",
// //     name: "Beginners guide to english pronunciation",
// //     description: "",
// //     completed: true,
// //     type: "Actividad",
// //     score: 90,
// //     feedback: "Excelente pronunciación. Sigue practicando los sonidos /th/ y /r/.",
// //   },
// //   {
// //     id: "g2",
// //     name: "Conversational",
// //     description: "",
// //     completed: true,
// //     type: "Actividad",
// //     score: 85,
// //     feedback: "Buena fluidez en la conversación. Trabaja en la entonación de preguntas.",
// //   },
// //   {
// //     id: "g3",
// //     name: "Introducing yourself",
// //     description: "",
// //     completed: true,
// //     type: "Actividad",
// //     score: 95,
// //     feedback: "Excelente presentación personal. Muy buena estructura y vocabulario.",
// //   },
// //   {
// //     id: "g4",
// //     name: "Support pronouns",
// //     description: "",
// //     completed: true,
// //     type: "Actividad",
// //     score: 88,
// //     feedback: "Buen uso de pronombres. Presta atención a los pronombres posesivos.",
// //   },
// //   {
// //     id: "g5",
// //     name: "Exam training & introduction",
// //     description: "",
// //     completed: true,
// //     type: "Actividad",
// //     score: 92,
// //     feedback: "Muy buena preparación para el examen. Dominas bien los conceptos básicos.",
// //   },
// // ]

// // // Sample data for Simple Present activities
// // const simplePresentActivities = [
// //   {
// //     id: "sp1",
// //     name: "Presente simple",
// //     description: "",
// //     completed: true,
// //     type: "Actividad",
// //     score: 80,
// //     feedback: "Buen manejo de la estructura básica. Presta atención a la tercera persona del singular.",
// //   },
// //   {
// //     id: "sp2",
// //     name: "Conversational",
// //     description: "",
// //     completed: true,
// //     type: "Actividad",
// //     score: 75,
// //     feedback: "Buena conversación usando presente simple. Mejora la fluidez y el uso de adverbios de frecuencia.",
// //   },
// //   {
// //     id: "sp3",
// //     name: "Support pronouns",
// //     description: "",
// //     completed: false,
// //     type: "Actividad",
// //     score: 0,
// //     feedback: "Pendiente de realizar",
// //   },
// //   {
// //     id: "sp4",
// //     name: "Exam training & introduction",
// //     description: "",
// //     completed: false,
// //     type: "Actividad",
// //     score: 0,
// //     feedback: "Pendiente de realizar",
// //   },
// // ]


// // "use client"

// // import { useState } from "react"
// // import { ChevronDown, ChevronUp, Lock } from "react-feather"

// // export default function ApprenticeFeedbackView() {
// //   const [expandedLevels, setExpandedLevels] = useState({ 1: true })
// //   const [expandedTopics, setExpandedTopics] = useState({ temas: true, greetings: true, "simple-present": true })
// //   const [showDetailModal, setShowDetailModal] = useState(false)
// //   const [selectedActivity, setSelectedActivity] = useState(null)

// //   const greetingsActivities = [
// //     {
// //       id: "greeting-1",
// //       name: "Saludar a un compañero",
// //       description: "Practica cómo saludar a un compañero en diferentes momentos del día.",
// //       completed: true,
// //     },
// //     {
// //       id: "greeting-2",
// //       name: "Presentarte formalmente",
// //       description: "Aprende a presentarte en un contexto formal.",
// //       completed: true,
// //     },
// //   ]

// //   const simplePresentActivities = [
// //     {
// //       id: "simple-present-1",
// //       name: "Describir tu rutina diaria",
// //       description: "Describe las actividades que realizas en un día típico.",
// //       completed: true,
// //     },
// //     {
// //       id: "simple-present-2",
// //       name: "Hablar de tus hobbies",
// //       description: "Comparte información sobre tus pasatiempos e intereses.",
// //       completed: false,
// //     },
// //   ]

// //   const toggleLevel = (levelId) => {
// //     setExpandedLevels((prev) => ({
// //       ...prev,
// //       [levelId]: !prev[levelId],
// //     }))
// //   }

// //   const toggleTopic = (topicId) => {
// //     setExpandedTopics((prev) => ({
// //       ...prev,
// //       [topicId]: !prev[topicId],
// //     }))
// //   }

// //   const handleViewDetail = (activity) => {
// //     setSelectedActivity(activity)
// //     setShowDetailModal(true)
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-100">

// //       {/* Main Content */}
// //       <main className="container mx-auto py-8 px-4 max-w-5xl">
// //         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
// //           {/* Page Header */}
// //           <div className="p-6 border-b border-gray-200">
// //             <h2 className="text-2xl font-bold text-[#1f384c]">Mi Retroalimentación</h2>
// //             <p className="text-gray-600 mt-1">Revisa tu progreso en las actividades y evaluaciones</p>
// //           </div>

// //           {/* Levels */}
// //           <div className="p-6">
// //             {/* Level 1 - Expanded */}
// //             <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
// //               <div
// //                 className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
// //                 onClick={() => toggleLevel(1)}
// //               >
// //                 <h3 className="font-medium text-lg">Nivel 1</h3>
// //                 <div className="flex items-center">
// //                   <div className="mr-3 font-medium">95%</div>
// //                   {expandedLevels[1] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
// //                 </div>
// //               </div>

// //               {expandedLevels[1] && (
// //                 <div className="p-6">
// //                   <div className="mb-6">
// //                     <div className="flex justify-between mb-2">
// //                       <span>Progreso nivel</span>
// //                       <span>95%</span>
// //                     </div>
// //                     <div className="w-full bg-gray-200 rounded-full h-2.5">
// //                       <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "95%" }}></div>
// //                     </div>
// //                   </div>

// //                   {/* Temas section */}
// //                   <div>
// //                     <div className="border border-gray-200 rounded-lg overflow-hidden">
// //                       <div
// //                         className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
// //                         onClick={() => toggleTopic("temas")}
// //                       >
// //                         <h4 className="font-medium text-lg">Temas</h4>
// //                         <div>{expandedTopics["temas"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
// //                       </div>

// //                       {expandedTopics["temas"] && (
// //                         <div className="p-4">
// //                           {/* Topic 1 - Greetings */}
// //                           <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
// //                             <div
// //                               className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
// //                               onClick={() => toggleTopic("greetings")}
// //                             >
// //                               <h4 className="font-medium">Greetings & Introductions</h4>
// //                               <div className="flex items-center">
// //                                 <div className="mr-3 font-medium">100%</div>
// //                                 {expandedTopics["greetings"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
// //                               </div>
// //                             </div>

// //                             {expandedTopics["greetings"] && (
// //                               <div className="p-4 border-t border-gray-200">
// //                                 <div className="mb-4">
// //                                   <div className="flex justify-between mb-2">
// //                                     <span>Progreso</span>
// //                                     <span>100%</span>
// //                                   </div>
// //                                   <div className="w-full bg-gray-200 rounded-full h-2.5">
// //                                     <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "100%" }}></div>
// //                                   </div>
// //                                 </div>

// //                                 {/* Activities */}
// //                                 <div className="mt-6">
// //                                   <div className="font-medium mb-3">Actividades:</div>

// //                                   <div className="space-y-3">
// //                                     {greetingsActivities.map((activity) => (
// //                                       <div key={activity.id} className="border border-gray-200 rounded-lg p-3">
// //                                         <div className="flex items-start">
// //                                           <input
// //                                             type="checkbox"
// //                                             checked={activity.completed}
// //                                             readOnly
// //                                             className="mt-1 mr-3"
// //                                           />
// //                                           <div className="flex-1">
// //                                             <div className="font-medium">{activity.name}</div>
// //                                             {activity.description && (
// //                                               <div className="text-sm text-gray-500 mt-1">{activity.description}</div>
// //                                             )}
// //                                           </div>
// //                                           <button
// //                                             className="ml-2 px-3 py-1 bg-[#1f384c] text-white text-sm rounded hover:bg-opacity-90"
// //                                             onClick={() => handleViewDetail(activity)}
// //                                           >
// //                                             Ver Detalle
// //                                           </button>
// //                                         </div>
// //                                       </div>
// //                                     ))}
// //                                   </div>
// //                                 </div>

// //                                 {/* Exams */}
// //                                 <div className="mt-6">
// //                                   <div className="font-medium mb-3">Examen:</div>

// //                                   <div className="border border-gray-200 rounded-lg p-3">
// //                                     <div className="flex items-start">
// //                                       <input type="checkbox" checked={true} readOnly className="mt-1 mr-3" />
// //                                       <div className="flex-1">
// //                                         <div className="font-medium">Greeting</div>
// //                                       </div>
// //                                       <button
// //                                         className="ml-2 px-3 py-1 bg-[#1f384c] text-white text-sm rounded hover:bg-opacity-90"
// //                                         onClick={() =>
// //                                           handleViewDetail({
// //                                             id: "exam-1",
// //                                             name: "Greeting",
// //                                             type: "Examen",
// //                                             score: 95,
// //                                             feedback: "Excelente dominio de los saludos y presentaciones.",
// //                                           })
// //                                         }
// //                                       >
// //                                         Ver Detalle
// //                                       </button>
// //                                     </div>
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                             )}
// //                           </div>

// //                           {/* Topic 2 - Simple Present */}
// //                           <div className="border border-gray-200 rounded-lg overflow-hidden">
// //                             <div
// //                               className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
// //                               onClick={() => toggleTopic("simple-present")}
// //                             >
// //                               <h4 className="font-medium">Simple Present</h4>
// //                               <div className="flex items-center">
// //                                 <div className="mr-3 font-medium">60%</div>
// //                                 {expandedTopics["simple-present"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
// //                               </div>
// //                             </div>

// //                             {expandedTopics["simple-present"] && (
// //                               <div className="p-4 border-t border-gray-200">
// //                                 <div className="mb-4">
// //                                   <div className="flex justify-between mb-2">
// //                                     <span>Progreso</span>
// //                                     <span>60%</span>
// //                                   </div>
// //                                   <div className="w-full bg-gray-200 rounded-full h-2.5">
// //                                     <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "60%" }}></div>
// //                                   </div>
// //                                 </div>

// //                                 {/* Activities */}
// //                                 <div className="mt-6">
// //                                   <div className="font-medium mb-3">Actividades:</div>

// //                                   <div className="space-y-3">
// //                                     {simplePresentActivities.map((activity) => (
// //                                       <div key={activity.id} className="border border-gray-200 rounded-lg p-3">
// //                                         <div className="flex items-start">
// //                                           <input
// //                                             type="checkbox"
// //                                             checked={activity.completed}
// //                                             readOnly
// //                                             className="mt-1 mr-3"
// //                                           />
// //                                           <div className="flex-1">
// //                                             <div className="font-medium">{activity.name}</div>
// //                                             {activity.description && (
// //                                               <div className="text-sm text-gray-500 mt-1">{activity.description}</div>
// //                                             )}
// //                                           </div>
// //                                           <button
// //                                             className="ml-2 px-3 py-1 bg-[#1f384c] text-white text-sm rounded hover:bg-opacity-90"
// //                                             onClick={() => handleViewDetail(activity)}
// //                                           >
// //                                             Ver Detalle
// //                                           </button>
// //                                         </div>
// //                                       </div>
// //                                     ))}
// //                                   </div>
// //                                 </div>

// //                                 {/* Exams */}
// //                                 <div className="mt-6">
// //                                   <div className="font-medium mb-3">Examen:</div>

// //                                   <div className="border border-gray-200 rounded-lg p-3">
// //                                     <div className="flex items-start">
// //                                       <input type="checkbox" checked={false} readOnly className="mt-1 mr-3" />
// //                                       <div className="flex-1">
// //                                         <div className="font-medium">Simple Present</div>
// //                                       </div>
// //                                       <button
// //                                         className="ml-2 px-3 py-1 bg-[#1f384c] text-white text-sm rounded hover:bg-opacity-90"
// //                                         onClick={() =>
// //                                           handleViewDetail({
// //                                             id: "exam-2",
// //                                             name: "Simple Present",
// //                                             type: "Examen",
// //                                             score: 0,
// //                                             feedback: "Pendiente de realizar",
// //                                           })
// //                                         }
// //                                       >
// //                                         Ver Detalle
// //                                       </button>
// //                                     </div>
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                             )}
// //                           </div>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Level 2 - Locked */}
// //             <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
// //               <div className="flex justify-between items-center p-4 bg-gray-50">
// //                 <div className="flex items-center">
// //                   <Lock size={18} className="mr-2" />
// //                   <h3 className="font-medium text-lg">Nivel 2: Conjugations</h3>
// //                 </div>
// //                 <div>El nivel se habilitará al terminar el correspondiente</div>
// //               </div>
// //             </div>

// //             {/* Level 3 - Locked */}
// //             <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
// //               <div className="flex justify-between items-center p-4 bg-gray-50">
// //                 <div className="flex items-center">
// //                   <Lock size={18} className="mr-2" />
// //                   <h3 className="font-medium text-lg">Nivel 3: Writing</h3>
// //                 </div>
// //                 <div>El nivel se habilitará al terminar el correspondiente</div>
// //               </div>
// //             </div>

// //             {/* Level 4 - Locked */}
// //             <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
// //               <div className="flex justify-between items-center p-4 bg-gray-50">
// //                 <div className="flex items-center">
// //                   <Lock size={18} className="mr-2" />
// //                   <h3 className="font-medium text-lg">Nivel 4: Listening</h3>
// //                 </div>
// //                 <div>El nivel se habilitará al terminar el correspondiente</div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </main>

// //       {/* Activity Detail Modal */}
// //       {showDetailModal && selectedActivity && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
// //             <div className="p-4 border-b border-gray-200">
// //               <h3 className="text-lg font-bold text-[#1f384c]">{selectedActivity.name}</h3>
// //               <p className="text-sm text-gray-600">{selectedActivity.type || "Actividad"}</p>
// //             </div>

// //             <div className="p-4 overflow-y-auto flex-grow">
// //               {selectedActivity.score !== undefined && (
// //                 <div className="mb-4">
// //                   <div className="text-sm font-medium mb-1">Calificación</div>
// //                   <div className="flex items-center">
// //                     <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
// //                       <div
// //                         className={`h-2.5 rounded-full ${selectedActivity.score >= 70 ? "bg-green-500" : "bg-yellow-500"}`}
// //                         style={{ width: `${selectedActivity.score}%` }}
// //                       ></div>
// //                     </div>
// //                     <span className="text-sm font-medium">{selectedActivity.score}%</span>
// //                   </div>
// //                 </div>
// //               )}

// //               <div className="mb-4">
// //                 <div className="text-sm font-medium mb-1">Retroalimentación</div>
// //                 <div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm">
// //                   {selectedActivity.feedback || "No hay retroalimentación disponible para esta actividad."}
// //                 </div>
// //               </div>

// //               {selectedActivity.aspectosMejora && selectedActivity.aspectosMejora.length > 0 && (
// //                 <div className="mb-4">
// //                   <div className="text-sm font-medium mb-1">Aspectos a mejorar</div>
// //                   <div className="p-3 bg-gray-50 rounded border border-gray-200">
// //                     <ul className="list-disc pl-5 text-sm space-y-1">
// //                       {selectedActivity.aspectosMejora.map((aspecto, index) => (
// //                         <li key={index}>{aspecto}</li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 </div>
// //               )}

// //               {selectedActivity.fortalezas && selectedActivity.fortalezas.length > 0 && (
// //                 <div className="mb-4">
// //                   <div className="text-sm font-medium mb-1">Fortalezas</div>
// //                   <div className="p-3 bg-gray-50 rounded border border-gray-200">
// //                     <ul className="list-disc pl-5 text-sm space-y-1">
// //                       {selectedActivity.fortalezas.map((fortaleza, index) => (
// //                         <li key={index}>{fortaleza}</li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="p-4 border-t border-gray-200 flex justify-end">
// //               <button
// //                 className="px-4 py-2 bg-[#1f384c] text-white rounded hover:bg-opacity-90 transition-colors"
// //                 onClick={() => setShowDetailModal(false)}
// //               >
// //                 Cerrar
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }
// "use client"

// import { useState } from "react"
// import { ChevronDown, ChevronUp, Lock } from "react-feather"

// export default function ApprenticeFeedbackView() {
//   const [expandedLevels, setExpandedLevels] = useState({ 1: true })
//   const [expandedTopics, setExpandedTopics] = useState({ temas: true, greetings: true, "simple-present": true })
//   const [showDetailModal, setShowDetailModal] = useState(false)
//   const [selectedActivity, setSelectedActivity] = useState(null)

//   const greetingsActivities = [
//     {
//       id: "greeting-1",
//       name: "Saludar a un compañero",
//       description: "Practica cómo saludar a un compañero en diferentes momentos del día.",
//       completed: true,
//     },
//     {
//       id: "greeting-2",
//       name: "Presentarte formalmente",
//       description: "Aprende a presentarte en un contexto formal.",
//       completed: true,
//     },
//   ]

//   const simplePresentActivities = [
//     {
//       id: "simple-present-1",
//       name: "Describir tu rutina diaria",
//       description: "Describe las actividades que realizas en un día típico.",
//       completed: true,
//     },
//     {
//       id: "simple-present-2",
//       name: "Hablar de tus hobbies",
//       description: "Comparte información sobre tus pasatiempos e intereses.",
//       completed: false,
//     },
//   ]

//   // Modificar la función handleViewDetail para incluir datos de ejemplo de preguntas
//   const handleViewDetail = (activity) => {
//     // Crear datos de ejemplo para las preguntas basados en la imagen
//     const activityWithQuestions = {
//       ...activity,
//       level: "1",
//       topic: activity.id.includes("simple-present") ? "simple present" : "greetings",
//       questions: [
//         {
//           id: "q1",
//           text: "What is your name?",
//           options: ["I'm Jennifer is Ibraham", "Option 2", "Option 3", "Option 4"],
//           correctAnswer: 0,
//           userAnswer: 0,
//           score: 20,
//           maxScore: 20,
//           feedback:
//             "Error: 'mi nombre es Ibraham' - en inglés, 'mi' se dice 'my' y 'nombre' debería ser name (singular).",
//         },
//         {
//           id: "q2",
//           text: "What is your address?",
//           options: ["I'm address is street 2", "Option 2", "Option 3", "Option 4"],
//           correctAnswer: 0,
//           userAnswer: 0,
//           score: 20,
//           maxScore: 20,
//           feedback:
//             "Error: 'mi nombre es Ibraham' - en inglés, 'mi' se dice 'my' y 'nombre' debería ser name (singular).",
//         },
//         {
//           id: "q3",
//           text: "Where are you from?",
//           options: ["De donde vienes?", "Option 2", "Option 3", "Option 4"],
//           correctAnswer: 0,
//           userAnswer: 0,
//           score: 20,
//           maxScore: 20,
//           feedback:
//             "Error: 'mi nombre es Ibraham' - en inglés, 'mi' se dice 'my' y 'nombre' debería ser name (singular).",
//         },
//         {
//           id: "q4",
//           text: "What is your name?",
//           options: ["My residence is Ibraham", "Option 2", "Option 3", "Option 4"],
//           correctAnswer: 0,
//           userAnswer: 0,
//           score: 20,
//           maxScore: 20,
//           feedback:
//             "Error: 'mi nombre es Ibraham' - en inglés, 'mi' se dice 'my' y 'nombre' debería ser name (singular).",
//         },
//       ],
//       score: activity.id.includes("exam-1") ? 95 : activity.id.includes("exam-2") ? 0 : 85,
//     }

//     setSelectedActivity(activityWithQuestions)
//     setShowDetailModal(true)
//   }

//   const toggleLevel = (levelId) => {
//     setExpandedLevels((prev) => ({
//       ...prev,
//       [levelId]: !prev[levelId],
//     }))
//   }

//   const toggleTopic = (topicId) => {
//     setExpandedTopics((prev) => ({
//       ...prev,
//       [topicId]: !prev[topicId],
//     }))
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
      


//       {/* Main Content */}
//       <main className="container mx-auto py-8 px-4 max-w-5xl">
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           {/* Page Header */}
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-[#1f384c]">Mi Retroalimentación</h2>
//             <p className="text-gray-600 mt-1">Revisa tu progreso en las actividades y evaluaciones</p>
//           </div>

//           {/* Levels */}
//           <div className="p-6">
//             {/* Level 1 - Expanded */}
//             <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
//               <div
//                 className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
//                 onClick={() => toggleLevel(1)}
//               >
//                 <h3 className="font-medium text-lg">Nivel 1</h3>
//                 <div className="flex items-center">
//                   <div className="mr-3 font-medium">95%</div>
//                   {expandedLevels[1] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                 </div>
//               </div>

//               {expandedLevels[1] && (
//                 <div className="p-6">
//                   <div className="mb-6">
//                     <div className="flex justify-between mb-2">
//                       <span>Progreso nivel</span>
//                       <span>95%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                       <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "95%" }}></div>
//                     </div>
//                   </div>

//                   {/* Temas section */}
//                   <div>
//                     <div className="border border-gray-200 rounded-lg overflow-hidden">
//                       <div
//                         className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
//                         onClick={() => toggleTopic("temas")}
//                       >
//                         <h4 className="font-medium text-lg">Temas</h4>
//                         <div>{expandedTopics["temas"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
//                       </div>

//                       {expandedTopics["temas"] && (
//                         <div className="p-4">
//                           {/* Topic 1 - Greetings */}
//                           <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
//                             <div
//                               className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
//                               onClick={() => toggleTopic("greetings")}
//                             >
//                               <h4 className="font-medium">Greetings & Introductions</h4>
//                               <div className="flex items-center">
//                                 <div className="mr-3 font-medium">100%</div>
//                                 {expandedTopics["greetings"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                               </div>
//                             </div>

//                             {expandedTopics["greetings"] && (
//                               <div className="p-4 border-t border-gray-200">
//                                 <div className="mb-4">
//                                   <div className="flex justify-between mb-2">
//                                     <span>Progreso</span>
//                                     <span>100%</span>
//                                   </div>
//                                   <div className="w-full bg-gray-200 rounded-full h-2.5">
//                                     <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "100%" }}></div>
//                                   </div>
//                                 </div>

//                                 {/* Activities */}
//                                 <div className="mt-6">
//                                   <div className="font-medium mb-3">Actividades:</div>

//                                   <div className="space-y-3">
//                                     {greetingsActivities.map((activity) => (
//                                       <div key={activity.id} className="border border-gray-200 rounded-lg p-3">
//                                         <div className="flex items-start">
//                                           <input
//                                             type="checkbox"
//                                             checked={activity.completed}
//                                             readOnly
//                                             className="mt-1 mr-3"
//                                           />
//                                           <div className="flex-1">
//                                             <div className="font-medium">{activity.name}</div>
//                                             {activity.description && (
//                                               <div className="text-sm text-gray-500 mt-1">{activity.description}</div>
//                                             )}
//                                           </div>
//                                           <button
//                                             className="ml-2 px-3 py-1 bg-[#1f384c] text-white text-sm rounded hover:bg-opacity-90"
//                                             onClick={() => handleViewDetail(activity)}
//                                           >
//                                             Ver Detalle
//                                           </button>
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>

//                                 {/* Exams */}
//                                 <div className="mt-6">
//                                   <div className="font-medium mb-3">Examen:</div>

//                                   <div className="border border-gray-200 rounded-lg p-3">
//                                     <div className="flex items-start">
//                                       <input type="checkbox" checked={true} readOnly className="mt-1 mr-3" />
//                                       <div className="flex-1">
//                                         <div className="font-medium">Greeting</div>
//                                       </div>
//                                       <button
//                                         className="ml-2 px-3 py-1 bg-[#1f384c] text-white text-sm rounded hover:bg-opacity-90"
//                                         onClick={() =>
//                                           handleViewDetail({
//                                             id: "exam-1",
//                                             name: "Greeting",
//                                             type: "Examen",
//                                             score: 95,
//                                             feedback: "Excelente dominio de los saludos y presentaciones.",
//                                           })
//                                         }
//                                       >
//                                         Ver Detalle
//                                       </button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>

//                           {/* Topic 2 - Simple Present */}
//                           <div className="border border-gray-200 rounded-lg overflow-hidden">
//                             <div
//                               className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
//                               onClick={() => toggleTopic("simple-present")}
//                             >
//                               <h4 className="font-medium">Simple Present</h4>
//                               <div className="flex items-center">
//                                 <div className="mr-3 font-medium">60%</div>
//                                 {expandedTopics["simple-present"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                               </div>
//                             </div>

//                             {expandedTopics["simple-present"] && (
//                               <div className="p-4 border-t border-gray-200">
//                                 <div className="mb-4">
//                                   <div className="flex justify-between mb-2">
//                                     <span>Progreso</span>
//                                     <span>60%</span>
//                                   </div>
//                                   <div className="w-full bg-gray-200 rounded-full h-2.5">
//                                     <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "60%" }}></div>
//                                   </div>
//                                 </div>

//                                 {/* Activities */}
//                                 <div className="mt-6">
//                                   <div className="font-medium mb-3">Actividades:</div>

//                                   <div className="space-y-3">
//                                     {simplePresentActivities.map((activity) => (
//                                       <div key={activity.id} className="border border-gray-200 rounded-lg p-3">
//                                         <div className="flex items-start">
//                                           <input
//                                             type="checkbox"
//                                             checked={activity.completed}
//                                             readOnly
//                                             className="mt-1 mr-3"
//                                           />
//                                           <div className="flex-1">
//                                             <div className="font-medium">{activity.name}</div>
//                                             {activity.description && (
//                                               <div className="text-sm text-gray-500 mt-1">{activity.description}</div>
//                                             )}
//                                           </div>
//                                           <button
//                                             className="ml-2 px-3 py-1 bg-[#1f384c] text-white text-sm rounded hover:bg-opacity-90"
//                                             onClick={() => handleViewDetail(activity)}
//                                           >
//                                             Ver Detalle
//                                           </button>
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>

//                                 {/* Exams */}
//                                 <div className="mt-6">
//                                   <div className="font-medium mb-3">Examen:</div>

//                                   <div className="border border-gray-200 rounded-lg p-3">
//                                     <div className="flex items-start">
//                                       <input type="checkbox" checked={false} readOnly className="mt-1 mr-3" />
//                                       <div className="flex-1">
//                                         <div className="font-medium">Simple Present</div>
//                                       </div>
//                                       <button
//                                         className="ml-2 px-3 py-1 bg-[#1f384c] text-white text-sm rounded hover:bg-opacity-90"
//                                         onClick={() =>
//                                           handleViewDetail({
//                                             id: "exam-2",
//                                             name: "Simple Present",
//                                             type: "Examen",
//                                             score: 0,
//                                             feedback: "Pendiente de realizar",
//                                           })
//                                         }
//                                       >
//                                         Ver Detalle
//                                       </button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Level 2 - Locked */}
//             <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
//               <div className="flex justify-between items-center p-4 bg-gray-50">
//                 <div className="flex items-center">
//                   <Lock size={18} className="mr-2" />
//                   <h3 className="font-medium text-lg">Nivel 2: Conjugations</h3>
//                 </div>
//                 <div>El nivel se habilitará al terminar el correspondiente</div>
//               </div>
//             </div>

//             {/* Level 3 - Locked */}
//             <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
//               <div className="flex justify-between items-center p-4 bg-gray-50">
//                 <div className="flex items-center">
//                   <Lock size={18} className="mr-2" />
//                   <h3 className="font-medium text-lg">Nivel 3: Writing</h3>
//                 </div>
//                 <div>El nivel se habilitará al terminar el correspondiente</div>
//               </div>
//             </div>

//             {/* Level 4 - Locked */}
//             <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
//               <div className="flex justify-between items-center p-4 bg-gray-50">
//                 <div className="flex items-center">
//                   <Lock size={18} className="mr-2" />
//                   <h3 className="font-medium text-lg">Nivel 4: Listening</h3>
//                 </div>
//                 <div>El nivel se habilitará al terminar el correspondiente</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Activity Detail Modal */}
//       {showDetailModal && selectedActivity && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
//             <div className="p-4 border-b border-gray-200">
//               <h3 className="text-lg font-bold text-[#1f384c]">Detalle de Retroalimentación</h3>
//             </div>

//             <div className="p-4 overflow-y-auto flex-grow">
//               {/* Información del nivel y tema */}
//               <div className="mb-4">
//                 <p className="font-medium">Nivel {selectedActivity.level}</p>
//                 <p className="text-gray-600">Tema: {selectedActivity.topic}</p>
//               </div>

//               {/* Barra de progreso */}
//               <div className="mb-6">
//                 <div className="text-sm font-medium mb-1">Calificación</div>
//                 <div className="relative pt-1">
//                   <div className="flex mb-2 items-center justify-between">
//                     <div></div>
//                     <div className="text-right">
//                       <span className="text-sm font-semibold inline-block text-gray-800">
//                         {selectedActivity.score}%
//                       </span>
//                     </div>
//                   </div>
//                   <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
//                     <div
//                       style={{ width: `${selectedActivity.score}%` }}
//                       className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
//                     ></div>
//                   </div>
//                 </div>
//               </div>

//               {/* Nombre de la actividad */}
//               <div className="mb-4">
//                 <div className="text-sm font-medium mb-1">Nombre de la Actividad</div>
//                 <div className="p-2 border border-gray-200 rounded">{selectedActivity.name}</div>
//               </div>

//               {/* Preguntas y respuestas */}
//               {selectedActivity.questions &&
//                 selectedActivity.questions.map((question, index) => (
//                   <div key={question.id} className="mb-6 border-b border-gray-200 pb-4">
//                     <div className="mb-2">
//                       <div className="text-sm font-medium mb-1">{question.text}</div>
//                       <div className="space-y-2">
//                         {question.options.map((option, optIndex) => (
//                           <div key={optIndex} className="flex items-center justify-between">
//                             <div className="flex items-center gap-2 flex-1">
//                               <input
//                                 type="radio"
//                                 checked={optIndex === question.userAnswer}
//                                 readOnly
//                                 className="h-4 w-4"
//                               />
//                               <div className="border border-gray-200 rounded p-2 flex-1">{option}</div>
//                             </div>
//                             <div className="ml-2">
//                               {optIndex === question.correctAnswer ? (
//                                 <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 rounded-md">
//                                   ✓
//                                 </span>
//                               ) : (
//                                 <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-800 rounded-md">
//                                   ✗
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Retroalimentación */}
//                     <div className="mt-2">
//                       <div className="text-sm font-medium mb-1">Retroalimentación</div>
//                       <div className="p-2 bg-gray-50 border border-gray-200 rounded text-sm">{question.feedback}</div>
//                     </div>

//                     {/* Puntaje */}
//                     <div className="flex justify-end mt-2">
//                       <span className="text-sm font-medium">Puntos: {question.score}</span>
//                     </div>
//                   </div>
//                 ))}
//             </div>

//             <div className="p-4 border-t border-gray-200 flex justify-end">
//               <button
//                 className="px-4 py-2 bg-[#1f384c] text-white rounded hover:bg-opacity-90 transition-colors"
//                 onClick={() => setShowDetailModal(false)}
//               >
//                 Cerrar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Lock } from "lucide-react"
import { useLocation } from "react-router-dom"

export default function ApprenticeFeedbackView() {
  const [expandedLevels, setExpandedLevels] = useState({ 1: true })
  const [expandedTopics, setExpandedTopics] = useState({ temas: true, greetings: true, "simple-present": true })
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const location = useLocation()

  // Check if we should open a specific activity detail on load
  useEffect(() => {
    if (location.state && location.state.openActivity) {
      const activity = location.state.openActivity
      console.log("Received activity data:", activity) // Para depuración

      // Asegurarse de que el objeto activity tiene la estructura esperada
      if (activity && activity.name) {
        handleViewDetail(activity)
      }
    }
  }, [location.state])

  const greetingsActivities = [
    {
      id: "greeting-1",
      name: "Saludar a un compañero",
      description: "Practica cómo saludar a un compañero en diferentes momentos del día.",
      completed: true,
    },
    {
      id: "greeting-2",
      name: "Presentarte formalmente",
      description: "Aprende a presentarte en un contexto formal.",
      completed: true,
    },
  ]

  const simplePresentActivities = [
    {
      id: "simple-present-1",
      name: "Describir tu rutina diaria",
      description: "Describe las actividades que realizas en un día típico.",
      completed: true,
    },
    {
      id: "simple-present-2",
      name: "Hablar de tus hobbies",
      description: "Comparte información sobre tus pasatiempos e intereses.",
      completed: false,
    },
  ]

  // Modificar la función handleViewDetail para incluir datos de ejemplo de preguntas
  const handleViewDetail = (activity) => {
    // Si la actividad ya tiene preguntas, usarlas directamente
    if (activity.questions) {
      setSelectedActivity({
        ...activity,
        level: activity.level || "1",
        topic: activity.topic || (activity.name?.includes("Simple Present") ? "simple present" : "greetings"),
      })
      setShowDetailModal(true)
      return
    }

    // Si no tiene preguntas, crear datos de ejemplo (código existente)
    const activityWithQuestions = {
      ...activity,
      level: "1",
      topic: activity.id?.includes("simple-present") ? "simple present" : "greetings",
      questions: [
        {
          id: "q1",
          text: "What is your name?",
          options: ["I'm Jennifer is Ibraham", "My name is Jennifer", "Me llamo Jennifer", "I am Jennifer"],
          correctAnswer: 1,
          userAnswer: 0,
          score: 20,
          maxScore: 20,
          feedback:
            "Error: La respuesta correcta es 'My name is Jennifer'. La estructura 'I'm Jennifer is Ibraham' mezcla dos formas de presentación y contiene un error gramatical. Recuerda que 'I'm' ya es una contracción de 'I am'.",
        },
        {
          id: "q2",
          text: "What is your address?",
          options: [
            "I'm address is street 2",
            "My address is 123 Main Street",
            "I live on 123 Main Street",
            "I live at 123 Main Street",
          ],
          correctAnswer: 3,
          userAnswer: 0,
          score: 0,
          maxScore: 20,
          feedback:
            "Error: La respuesta correcta es 'I live at 123 Main Street'. La estructura 'I'm address is street 2' contiene varios errores: 'I'm' es incorrecto (debería ser 'My'), y la dirección es demasiado vaga. En inglés, usamos 'at' para indicar una dirección específica.",
        },
        {
          id: "q3",
          text: "Where are you from?",
          options: ["I'm from Colombia", "I am Colombia", "I from Colombia", "My country is Colombia"],
          correctAnswer: 0,
          userAnswer: 2,
          score: 0,
          maxScore: 20,
          feedback:
            "Error: La respuesta correcta es 'I'm from Colombia'. La estructura 'I from Colombia' omite el verbo auxiliar 'am'. Recuerda que siempre necesitas un verbo en la oración en inglés.",
        },
        {
          id: "q4",
          text: "How old are you?",
          options: ["I have 25 years old", "I am 25 years", "I am 25 years old", "My age is 25 years"],
          correctAnswer: 2,
          userAnswer: 0,
          score: 0,
          maxScore: 20,
          feedback:
            "Error: La respuesta correcta es 'I am 25 years old'. La estructura 'I have 25 years old' es una traducción literal del español. En inglés, usamos el verbo 'to be' (am/is/are) para expresar la edad, no el verbo 'to have'.",
        },
      ],
      score: activity.id?.includes("exam-1") ? 95 : activity.id?.includes("exam-2") ? 0 : 85,
    }

    setSelectedActivity(activityWithQuestions)
    setShowDetailModal(true)
  }

  const toggleLevel = (levelId) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [levelId]: !prev[levelId],
    }))
  }

  const toggleTopic = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Page Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#1f384c]">Mi Retroalimentación</h2>
            <p className="text-gray-600 mt-1">Revisa tu progreso en las actividades y evaluaciones</p>
          </div>

          {/* Levels */}
          <div className="p-6">
            {/* Level 1 - Expanded */}
            <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleLevel(1)}
              >
                <h3 className="font-medium text-lg">Nivel 1</h3>
                <div className="flex items-center">
                  <div className="mr-3 font-medium">95%</div>
                  {expandedLevels[1] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedLevels[1] && (
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span>Progreso nivel</span>
                      <span>95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>

                  {/* Temas section */}
                  <div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div
                        className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                        onClick={() => toggleTopic("temas")}
                      >
                        <h4 className="font-medium text-lg">Temas</h4>
                        <div>{expandedTopics["temas"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
                      </div>

                      {expandedTopics["temas"] && (
                        <div className="p-4">
                          {/* Topic 1 - Greetings */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                            <div
                              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                              onClick={() => toggleTopic("greetings")}
                            >
                              <h4 className="font-medium">Greetings & Introductions</h4>
                              <div className="flex items-center">
                                <div className="mr-3 font-medium">100%</div>
                                {expandedTopics["greetings"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </div>
                            </div>

                            {expandedTopics["greetings"] && (
                              <div className="p-4 border-t border-gray-200">
                                <div className="mb-4">
                                  <div className="flex justify-between mb-2">
                                    <span>Progreso</span>
                                    <span>100%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "100%" }}></div>
                                  </div>
                                </div>

                                {/* Activities */}
                                <div className="mt-6">
                                  <div className="font-medium mb-3">Actividades:</div>

                                  <div className="space-y-3">
                                    {greetingsActivities.map((activity) => (
                                      <div key={activity.id} className="border border-gray-200 rounded-lg p-3">
                                        <div className="flex items-start">
                                          <input
                                            type="checkbox"
                                            checked={activity.completed}
                                            readOnly
                                            className="mt-1 mr-3"
                                          />
                                          <div className="flex-1">
                                            <div className="font-medium">{activity.name}</div>
                                            {activity.description && (
                                              <div className="text-sm text-gray-500 mt-1">{activity.description}</div>
                                            )}
                                          </div>
                                          <button
                                            className="ml-2 px-3 py-1 bg-[#1f384c] text-white text-sm rounded hover:bg-opacity-90"
                                            onClick={() => handleViewDetail(activity)}
                                          >
                                            Ver Detalle
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Exams */}
                                <div className="mt-6">
                                  <div className="font-medium mb-3">Examen:</div>

                                  <div className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-start">
                                      <input type="checkbox" checked={true} readOnly className="mt-1 mr-3" />
                                      <div className="flex-1">
                                        <div className="font-medium">Greeting</div>
                                      </div>
                                      <button
                                        className="ml-2 px-3 py-1 bg-[#1f384c] text-white text-sm rounded hover:bg-opacity-90"
                                        onClick={() =>
                                          handleViewDetail({
                                            id: "exam-1",
                                            name: "Greeting",
                                            type: "Examen",
                                            score: 95,
                                            feedback: "Excelente dominio de los saludos y presentaciones.",
                                          })
                                        }
                                      >
                                        Ver Detalle
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Topic 2 - Simple Present */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div
                              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                              onClick={() => toggleTopic("simple-present")}
                            >
                              <h4 className="font-medium">Simple Present</h4>
                              <div className="flex items-center">
                                <div className="mr-3 font-medium">60%</div>
                                {expandedTopics["simple-present"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </div>
                            </div>

                            {expandedTopics["simple-present"] && (
                              <div className="p-4 border-t border-gray-200">
                                <div className="mb-4">
                                  <div className="flex justify-between mb-2">
                                    <span>Progreso</span>
                                    <span>60%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                                  </div>
                                </div>

                                {/* Activities */}
                                <div className="mt-6">
                                  <div className="font-medium mb-3">Actividades:</div>

                                  <div className="space-y-3">
                                    {simplePresentActivities.map((activity) => (
                                      <div key={activity.id} className="border border-gray-200 rounded-lg p-3">
                                        <div className="flex items-start">
                                          <input
                                            type="checkbox"
                                            checked={activity.completed}
                                            readOnly
                                            className="mt-1 mr-3"
                                          />
                                          <div className="flex-1">
                                            <div className="font-medium">{activity.name}</div>
                                            {activity.description && (
                                              <div className="text-sm text-gray-500 mt-1">{activity.description}</div>
                                            )}
                                          </div>
                                          <button
                                            className="ml-2 px-3 py-1 bg-[#1f384c] text-white text-sm rounded hover:bg-opacity-90"
                                            onClick={() => handleViewDetail(activity)}
                                          >
                                            Ver Detalle
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Exams */}
                                <div className="mt-6">
                                  <div className="font-medium mb-3">Examen:</div>

                                  <div className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-start">
                                      <input type="checkbox" checked={false} readOnly className="mt-1 mr-3" />
                                      <div className="flex-1">
                                        <div className="font-medium">Simple Present</div>
                                      </div>
                                      <button
                                        className="ml-2 px-3 py-1 bg-[#1f384c] text-white text-sm rounded hover:bg-opacity-90"
                                        onClick={() =>
                                          handleViewDetail({
                                            id: "exam-2",
                                            name: "Simple Present",
                                            type: "Examen",
                                            score: 0,
                                            feedback: "Pendiente de realizar",
                                          })
                                        }
                                      >
                                        Ver Detalle
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Level 2 - Locked */}
            <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-50">
                <div className="flex items-center">
                  <Lock size={18} className="mr-2" />
                  <h3 className="font-medium text-lg">Nivel 2: Conjugations</h3>
                </div>
                <div>El nivel se habilitará al terminar el correspondiente</div>
              </div>
            </div>

            {/* Level 3 - Locked */}
            <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-50">
                <div className="flex items-center">
                  <Lock size={18} className="mr-2" />
                  <h3 className="font-medium text-lg">Nivel 3: Writing</h3>
                </div>
                <div>El nivel se habilitará al terminar el correspondiente</div>
              </div>
            </div>

            {/* Level 4 - Locked */}
            <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-50">
                <div className="flex items-center">
                  <Lock size={18} className="mr-2" />
                  <h3 className="font-medium text-lg">Nivel 4: Listening</h3>
                </div>
                <div>El nivel se habilitará al terminar el correspondiente</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Activity Detail Modal */}
      {showDetailModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-[#1f384c]">Detalle de Retroalimentación</h3>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              {/* Información del nivel y tema */}
              <div className="mb-4">
                <p className="font-medium">Nivel {selectedActivity.level}</p>
                <p className="text-gray-600">Tema: {selectedActivity.topic}</p>
              </div>

              {/* Barra de progreso */}
              <div className="mb-6">
                <div className="text-sm font-medium mb-1">Calificación</div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div></div>
                    <div className="text-right">
                      <span className="text-sm font-semibold inline-block text-gray-800">
                        {selectedActivity.score}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${selectedActivity.score}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Nombre de la actividad */}
              <div className="mb-6">
                <div className="text-sm font-medium mb-1">Nombre de la Actividad</div>
                <div className="p-3 border border-gray-200 rounded bg-gray-50">{selectedActivity.name}</div>
              </div>

              {/* Preguntas y respuestas */}
              {selectedActivity.questions &&
                selectedActivity.questions.map((question, index) => (
                  <div key={question.id} className="mb-8 border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="mb-4">
                      <div className="text-base font-medium mb-3">{question.text}</div>
                      <div className="space-y-3">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <input
                                type="radio"
                                checked={optIndex === question.userAnswer}
                                readOnly
                                className="h-4 w-4"
                              />
                              <div className="border border-gray-200 rounded p-3 flex-1 bg-white">{option}</div>
                            </div>
                            <div className="ml-3">
                              {optIndex === question.correctAnswer ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 rounded-md">
                                  ✓
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-800 rounded-md">
                                  ✗
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Retroalimentación */}
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Retroalimentación</div>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm">{question.feedback}</div>
                    </div>

                    {/* Puntaje */}
                    <div className="flex justify-end mt-3">
                      <span className="text-sm font-medium">Puntos: {question.score}</span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                className="px-6 py-2 bg-[#1f384c] text-white rounded hover:bg-opacity-90 transition-colors"
                onClick={() => setShowDetailModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
