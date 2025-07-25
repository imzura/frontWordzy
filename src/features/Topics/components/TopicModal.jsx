import { useState, useEffect } from "react";
import Modal from "../../../shared/components/Modal";
import { normalizeText } from "../../../shared/utils/normalizeText";

const TopicModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  existingTopics = [],
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
    setHasChanges(true);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setHasChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    // ✅ Solo aquí mostramos "El nombre es requerido"
    if (!trimmedName) {
      setError("El nombre es requerido");
      return;
    }

    // Si hay otro error activo (como nombre duplicado)
    if (error) return;

    onSubmit({
      name: trimmedName,
      description: description.trim(),
      status: true,
    });
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setHasChanges(false);
    setError("");
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setHasChanges(false);
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    const trimmed = name.trim();

    if (!trimmed) {
      setHasChanges(false);
      return;
    }

    const normalized = normalizeText(trimmed);

    const exists = existingTopics.some(
      (t) => normalizeText(t.name) === normalized
    );

    if (exists) {
      setError("El tema ya existe");
      setHasChanges(false);
    } else {
      setError("");
      setHasChanges(true);
    }
  }, [name, existingTopics]);

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <h1 className="text-xl font-bold text-[#1f384c]">AÑADIR TEMA</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mt-4">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            required
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>
        <div className="flex justify-between space-x-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-2 text-sm text-white rounded-[10px] focus:outline-none focus:ring-1 bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!hasChanges || !!error || loading}
            className={`px-3 py-2 text-sm text-white rounded-[10px] focus:outline-none focus:ring-1 transition-colors ${
              hasChanges && !error && !loading
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Guardando..." : "Añadir Tema"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TopicModal;
