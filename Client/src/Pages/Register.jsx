import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, User, Mail, Lock, Shield } from "lucide-react";
import Baner from "../Pages/img/Baner.png"; // AJUSTA ESTA RUTA SI ES NECESARIO
import "./Register.css";


function Register() {
  const [form, setForm] = useState({
    Mail: "",
    Password: "",
    Name: "",
    Rol: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/registrarUsuario",
        form
      );

      setMensaje(res.data.Mensaje || "Registro exitoso");
    } catch (error) {
      setMensaje(error.response?.data?.Error || "Error desconocido");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden bg-white">

        {/* Panel Izquierdo - Formulario */}
        <div className="p-8 md:p-12 bg-gradient-to-b from-slate-50 to-white animate-scale-in">
          <div className="text-center mb-8">
         <div className="register-banner-container">
  <img src={Baner} alt="Logo" className="register-logo" />
</div>
            <h2 className="text-3xl font-bold text-blue-900">
              Crear nueva cuenta
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="Mail"
                  value={form.Mail}
                  onChange={handleChange}
                  placeholder="Ingresa tu correo"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 bg-gray-50 hover:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="Password"
                  value={form.Password}
                  onChange={handleChange}
                  placeholder="Crea una contraseña"
                  className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 bg-gray-50 hover:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="Name"
                  value={form.Name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 bg-gray-50 hover:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Rol del usuario
              </label>
              <div className="relative">
                <Shield className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <select
                  name="Rol"
                  value={form.Rol}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 hover:bg-white focus:border-blue-600 transition-all"
                  required
                >
                  <option value="">Seleccionar rol</option>
                  <option value="admin">Administrador</option>
                  <option value="docente">Docente</option>
                  <option value="familia">Familia</option>
                </select>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 font-bold rounded-lg shadow-md hover:bg-blue-800 transition-all hover:shadow-xl"
            >
              Registrar
            </button>

            {mensaje && (
              <p className="text-center text-blue-700 font-semibold mt-2 animate-fade-in-up">
                {mensaje}
              </p>
            )}
          </form>
        </div>

        {/* Panel derecho */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-blue-800 p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center text-white animate-fade-in-up">
            <h2 className="text-5xl font-bold mb-4">Bienvenido</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Registrá un nuevo usuario para el sistema
            </p>
            <p className="text-blue-200">✓ Roles personalizados</p>
            <p className="text-blue-200">✓ Accesos seguros</p>
            <p className="text-blue-200">✓ Gestión completa</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
