"use client";

import {
  ArrowLeft,
  FileText,
  Download,
  Clock,
  Trophy,
  BookOpen,
} from "lucide-react";

const ExamIntroModal = ({ isOpen, onClose, exam, onStart }) => {
  if (!isOpen || !exam) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/src/shared/prueba.docx";
    link.download = "Material.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] p-6">
          <button
            onClick={onClose}
            className="flex items-center text-white/90 hover:text-white font-medium mb-4 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300 w-fit"
          >
            <ArrowLeft className="mr-2" size={20} />
            Abandonar
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <Trophy className="text-white" size={32} />
            </div>
            <h1 className="text-[22px] font-bold text-white mb-2">{exam.title}</h1>
            <div className="flex items-center justify-center space-x-4 text-blue-100">
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span className="text-sm">Sin límite de tiempo</span>
              </div>
              <div className="flex items-center">
                <BookOpen size={16} className="mr-1" />
                <span className="text-sm">
                  {exam.questions?.length || 0} preguntas
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Descripción */}
          <div className="text-center mb-5">
            <h2 className="text-lg font-semibold text-[#1f384c] mb-1">
              Descripción del examen
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Basic activity based on your personal presentation, I this is for
              any avereg student of english and doet require to much
            </p>
          </div>

          {/* Material de apoyo */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#1f384c] mb-4 text-center flex items-center justify-center">
              <FileText className="mr-2" size={20} />
              Material de apoyo
            </h2>

            <div
              className="bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5 border-2 border-dashed border-[#1f384c]/20 rounded-xl p-6 hover:border-[#1f384c]/40 transition-all duration-300 cursor-pointer group"
              onClick={handleDownload}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1f384c] mb-1">
                      Material.docx
                    </h3>
                    <p className="text-sm text-gray-600">
                      Documento de apoyo para el examen
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Download size={18} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-base font-semibold text-[#1f384c] mb-3">
              Instrucciones importantes:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#1f384c] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Lee cuidadosamente cada pregunta antes de responder
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#1f384c] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Puedes navegar entre preguntas usando los botones de navegación
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#1f384c] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Asegúrate de completar todas las preguntas antes de finalizar
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#1f384c] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                No hay límite de tiempo, tómate el tiempo que necesites
              </li>
            </ul>
          </div>

          {/* Botón de empezar */}
          <div className="text-center">
            <button
              onClick={onStart}
              className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] hover:from-[#152a38] hover:to-[#1f384c] text-white py-4 px-4 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center mx-auto"
            >
              <Trophy className="mr-2" size={20} />
              Comenzar Examen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamIntroModal;
