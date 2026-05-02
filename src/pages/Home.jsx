import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import pet1Image from "../assets/pet-1.jpg";
import {
  FaCut,
  FaBath,
  FaHeart,
  FaCalendarCheck,
  FaClock,
  FaStar,
} from "react-icons/fa";

function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-r from-green-600 to-green-700 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(22, 101, 52, 0.85), rgba(21, 128, 61, 0.85)), url(${pet1Image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Cuidados Premium para seu Melhor Amigo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 font-semibold">
              Banho, tosa e serviços veterinários com profissionais qualificados
              e ambiente acolhedor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/agendamento"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition transform hover:scale-105 text-center"
              >
                Agendar Agora
              </Link>
              <Link
                to="/cadastro"
                className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition text-center"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-gray-600 text-lg">
              Tudo o que seu pet precisa em um só lugar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-8 rounded-xl hover:shadow-lg transition text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBath className="text-3xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Banho</h3>
              <p className="text-gray-600">
                Banho completo com produtos de alta qualidade, secagem e perfume
                especial.
              </p>
            </div>

            <div className="bg-gray-100 p-8 rounded-xl hover:shadow-lg transition text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCut className="text-3xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Tosa</h3>
              <p className="text-gray-600">
                Tosa higiênica e estética com profissionais experientes e
                equipamentos modernos.
              </p>
            </div>

            <div className="bg-gray-100 p-8 rounded-xl hover:shadow-lg transition text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHeart className="text-3xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Cuidados Especiais
              </h3>
              <p className="text-gray-600">
                Hidratação, escovação de dentes, corte de unhas e muito mais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Por Que Escolher a Gente?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCalendarCheck className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Agendamento Fácil
                </h3>
                <p className="text-gray-600">
                  Sistema online simples e rápido. Agende quando quiser, de onde
                  estiver.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaClock className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Horários Flexíveis
                </h3>
                <p className="text-gray-600">
                  Atendimento de segunda a sábado com diversos horários
                  disponíveis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaStar className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Profissionais Qualificados
                </h3>
                <p className="text-gray-600">
                  Equipe experiente e apaixonada por animais, pronta para cuidar
                  do seu pet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Cuidar do Seu Pet?
          </h2>
          <p className="text-xl mb-8 text-green-50">
            Agende agora mesmo e garanta o melhor para seu companheiro.
          </p>
          <Link
            to="/agendamento"
            className="inline-block bg-white text-green-600 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition transform hover:scale-105"
          >
            Fazer Agendamento
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2026 Pet Shop. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </>
  );
}

export default Home;
