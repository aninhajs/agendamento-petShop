import Navbar from "../componets/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <section className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-green-600 mb-4">
            Bem-vindo ao Pet Shop
          </h2>

          <p className="text-gray-600 text-lg mb-6">
            Agende banho, tosa e cuidados para seu pet.
          </p>

          <button className="bg-green-600 px-6 py-3 rounded-lg text-white hover:bg-green-700 transition">
            Agendar Agora
          </button>
        </div>
      </section>
    </>
  );
}

export default Home;
