/**
 * Componente de Erro reutilizável
 */
export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <p className="text-red-700 font-semibold mb-2">Erro</p>
      <p className="text-red-600 text-sm mb-4">
        {message || "Algo deu errado"}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
};
