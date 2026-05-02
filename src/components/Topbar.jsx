import minhaFoto from "../assets/aninha.png";

function Topbar() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center rounded-xl transition-all">
      {/* Título: Ajusta o tamanho da fonte no mobile */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-700 truncate mr-2">
        Dashboard
      </h2>

      {/* Área do Usuário */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Nome do Administrador: Escondido em telas muito pequenas (xs) ou menores */}
        <span className="hidden sm:block text-gray-600 font-medium text-sm md:text-base">
          Administrador
        </span>

        {/* Container da Foto: Com borda sutil para destaque */}
        <div className="relative">
          <img
            src={minhaFoto}
            alt="Foto do administrador"
            className="rounded-full w-9 h-9 md:w-10 md:h-10 object-cover border-2 border-green-500/20"
          />
          {/* Status online (opcional, mas dá um toque profissional) */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
