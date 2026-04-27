import Navbar from "../componets/Navbar";

function Login() {
  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center h-screen">
        <form className="bg-white shadow-xl p-8 rounded-xl w-96">
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 mb-4 rounded"
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full border p-3 mb-4 rounded"
          />

          <button className="w-full bg-green-600 text-white py-3 rounded">
            Entrar
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
