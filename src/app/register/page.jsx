"use client";

import { useState } from "react";
import Link from "next/link";
import CryptoJS from "crypto-js";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'; // Importa useRouter
import { CONFIGURACIONES } from '../config/config';
import { useAuth } from '../../context/authContext'; // Importa el contexto para usar theme


function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [birthDate, setBirthDate] = useState("");
  const [birthDateValid, setBirthDateValid] = useState(true);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [onSubmitLoading, setOnSubmitLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [preguntaSecreta, setPreguntaSecreta] = useState("default");
  const [respuestaSecreta, setRespuestaSecreta] = useState("");

  // Función para manejar el token generado por el CAPTCHA
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token); // Almacena el token generado por el CAPTCHA
  };

  // Función para validar los requisitos de la contraseña
  const checkPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8 && password.length <= 30) strength++;
    if (/\d/.test(password)) strength++;
    if (/[a-zA-Z]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    setPasswordStrength(strength);
  };

  const [passwordWarning, setPasswordWarning] = useState(""); // Nuevo estado para el mensaje de advertencia

  // Función para manejar el cambio de contraseña y verificar patrones prohibidos
  const handlePasswordChange = async (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);

    // Verificar si la contraseña contiene patrones prohibidos
    const containsForbiddenPattern = forbiddenPatterns.some((pattern) =>
      newPassword.toLowerCase().includes(pattern)
    );

    if (containsForbiddenPattern) {
      setPasswordWarning(
        "Tu contraseña contiene patrones comunes o inseguros."
      );
    } else {
      setPasswordWarning("");
    }

    // 5. Verificar si la contraseña ha sido filtrada en una base de datos pública
    const isPwned = await checkPasswordInPwned(newPassword);
    if (isPwned) {
      setPasswordWarning(
        "Tu contraseña ha sido filtrada en una base de datos pública. Por favor, elige otra."
      );
    } else {
      setPasswordWarning("");
    }

    checkPasswordMatch(newPassword, confirmPassword); // Verificar coincidencia de contraseñas
  };

  // Cambia el estado de la confirmación de contraseña
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    checkPasswordMatch(password, newConfirmPassword);
  };

  // Verifica si las contraseñas coinciden
  const checkPasswordMatch = (password, confirmPassword) => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  };

  // Verifica si la fecha de nacimiento está dentro del rango permitido
  const handleBirthDateChange = (e) => {
    const selectedDate = e.target.value;
    setBirthDate(selectedDate);

    const minDate = new Date("1960-01-01");
    const maxDate = new Date("2006-12-31");
    const userDate = new Date(selectedDate);

    if (userDate >= minDate && userDate <= maxDate) {
      setBirthDateValid(true);
    } else {
      setBirthDateValid(false);
    }
  };

  // Color de la barra según la fortaleza
  const getStrengthBarColor = () => {
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    if (passwordStrength === 4) return "bg-green-500";
    return "bg-gray-300";
  };

  // Texto de fortaleza según el nivel
  const getStrengthText = () => {
    if (passwordStrength === 1) return "Débil";
    if (passwordStrength === 2) return "Media";
    if (passwordStrength === 3) return "Fuerte";
    if (passwordStrength === 4) return "Muy fuerte";
    return "";
  };

  // Color del texto según la fortaleza
  const getStrengthTextColor = () => {
    if (passwordStrength === 1) return "text-red-500";
    if (passwordStrength === 2) return "text-yellow-500";
    if (passwordStrength === 3) return "text-blue-500";
    if (passwordStrength === 4) return "text-green-500";
    return "text-gray-500";
  };

  // Añade un estado para controlar la visibilidad de la contraseña
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Añade un estado para controlar la visibilidad de la confirmación de la contraseña
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Función para alternar la visibilidad de la confirmación de la contraseña
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  //Funcion para patrones prohibidos
  const forbiddenPatterns = ["12345", "password", "admin", "qwerty", "abc123", "abcdefgh123456@"];

  const checkPasswordInPwned = async (password) => {
    // 1. Hashear la contraseña usando SHA-1
    const sha1Hash = CryptoJS.SHA1(password).toString().toUpperCase();

    // 2. Tomar los primeros 5 caracteres del hash
    const hashPrefix = sha1Hash.substring(0, 5);
    const hashSuffix = sha1Hash.substring(5);

    try {
      // 3. Consultar la API de Have I Been Pwned
      const response = await fetch(
        `https://api.pwnedpasswords.com/range/${hashPrefix}`
      );
      const data = await response.text();

      // 4. Buscar si el sufijo completo está en la lista de hashes devueltos
      const isPwned = data.split("\n").some((line) => {
        const [hash, count] = line.split(":");
        return hash === hashSuffix;
      });

      return isPwned;
    } catch (error) {
      console.error("Error checking password with HIBP:", error);
      return false;
    }
  };

  // Hook para redireccionar
  const { theme } = useAuth(); // Obtener el tema desde el contexto
  const router = useRouter(); // Inicializa el hook de enrutamiento
  //const router = useRouter(); // Hook para redireccionar

  // Función para manejar el envío del formulario al backend
  const onSubmit = async (event) => {
    event.preventDefault();
    setOnSubmitLoading(true); // Mostrar loading al enviar

    // Validar la contraseña antes de hacer la solicitud
    if (!isPasswordValid(password)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La contraseña no cumple con los requisitos.",
      });
      setOnSubmitLoading(false); // Detener loading
      return;
    }

    if (preguntaSecreta === "default") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor selecciona una pregunta secreta válida.",
      });
      setOnSubmitLoading(false); // Detener loading
      return;
    }

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nombre,
          lastname: apellido,
          email,
          password,
          fechadenacimiento: birthDate,
          user: nombre,
          telefono,
          preguntaSecreta,
          respuestaSecreta,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "¡Te has registrado con éxito!",
        }).then(() => {
          // Redireccionar al login después de que el usuario haga clic en "OK"
          router.push('/login');
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: "Hubo un problema al registrar tu cuenta.",
      });
    } finally {
      setOnSubmitLoading(false); // Detener loading
    }
  };

  // Función para validar la contraseña
  const isPasswordValid = (password) => {
    const minLength = 8;
    const maxLength = 30;
    const numberRegex = /\d/;
    const letterRegex = /[a-zA-Z]/;
    const specialCharRegex = /[^A-Za-z0-9]/;
    const uppercaseRegex = /[A-Z]/;

    // Comprobaciones de la contraseña
    if (password.length < minLength || password.length > maxLength) {
      setPasswordWarning("La contraseña debe tener entre 8 y 30 caracteres.");
      return false;
    } else if (!numberRegex.test(password)) {
      setPasswordWarning("La contraseña debe contener al menos un número.");
      return false;
    } else if (!letterRegex.test(password)) {
      setPasswordWarning("La contraseña debe contener al menos una letra.");
      return false;
    } else if (!specialCharRegex.test(password)) {
      setPasswordWarning("La contraseña debe contener al menos un símbolo especial.");
      return false;
    } else if (!uppercaseRegex.test(password)) {
      setPasswordWarning("La contraseña debe contener al menos una letra mayúscula.");
      return false;
    }

    setPasswordWarning(""); // Si la contraseña es válida, limpiar la advertencia
    return true;
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Sección izquierda: Formulario */}
      <div className={`w-full max-w-md p-8 shadow-lg rounded-lg mt-40 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="mb-4">
          <Link href="/">
            <p className={`font-bold mb-6 block ${theme === 'dark' ? 'text-blue-300 hover:text-blue-600' : 'text-pink-700'}`}>&larr; Atrás</p>
          </Link>

          {/* Logo */}
          <div className="text-center mb-8"></div>

          <h2 className={`text-2xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Crea tu cuenta</h2>

          {/* El formulario ahora ejecuta la función onSubmit */}
          <form onSubmit={onSubmit}>
            {/* Nombre */}
            <div className="mb-4">
              <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Nombre</label>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`} />
            </div>

            {/* Apellido */}
            <div className="mb-4">
              <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Apellido</label>
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
              />
            </div>

            {/* Correo Electrónico */}
            <div className="mb-4">
              <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Correo Electrónico</label>
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`} />
            </div>

            {/* Teléfono */}
            <div className="mb-4">
              <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Teléfono</label>
              <input
                type="tel"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
                pattern="[0-9]{10}" // Solo números y exactamente 10 dígitos
                maxLength="10" // Máximo 10 caracteres
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Reemplaza cualquier caracter que no sea un número
                }}
                required // Campo obligatorio
              />
              <p className="text-sm text-gray-500 mt-2">
                *Ingresa un número de teléfono válido (10 dígitos).
              </p>
            </div>

            {/* Fecha de Nacimiento */}
            <div className="mb-4">
              <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Fecha de Nacimiento</label>
              <input
                type="date"
                className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
                value={birthDate}
                onChange={handleBirthDateChange}
                min="1960-01-01"
                max="2006-12-31"
              />
              {!birthDateValid && (
                <p className="text-red-500 text-sm mt-1">
                  Su edad está fuera del rango permitido.
                </p>
              )}
            </div>

            {/* Pregunta Secreta */}
            <div className="mb-4">
              <label className="block text-gray-700">Pregunta Secreta</label>
              <select
                value={preguntaSecreta}
                onChange={(e) => setPreguntaSecreta(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                <option value="default" disabled>
                  Selecciona una pregunta secreta
                </option>
                <option value="¿Cuál es el nombre de tu primera mascota?">
                  ¿Cuál es el nombre de tu primera mascota?
                </option>
                <option value="¿Cuál es tu película favorita?">
                  ¿Cuál es tu película favorita?
                </option>
                <option value="¿En qué ciudad naciste?">
                  ¿En qué ciudad naciste?
                </option>
              </select>
            </div>


            {/* Respuesta Secreta */}
            <div className="mb-4">
              <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Respuesta Secreta</label>
              <input
                type="text"
                placeholder="Respuesta Secreta"
                value={respuestaSecreta}
                onChange={(e) => setRespuestaSecreta(e.target.value)}
                className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
              />
            </div>

            {/* Contraseña */}
            <div className="mb-4 relative">
              <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Contraseña</label>
              <input
                type={passwordVisible ? "text" : "password"} // Cambia entre "text" y "password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  handlePasswordChange(e); // Llama a handlePasswordChange
                  validatePassword(e.target.value); // Llama a validatePassword para validar los requisitos de la contraseña
                }}
                className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-9 top-8 text-gray-600"
              >
                {passwordVisible ? "Ocultar" : "Mostrar"}
              </button>
              {passwordWarning && (
                <p className="text-red-500 text-sm mt-1">{passwordWarning}</p>
              )}
            </div>



            {/* Barra de fortaleza */}
            <div className="mb-4">
              <div
                className={`h-2 rounded-lg ${getStrengthBarColor()}`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              ></div>
              <p className={`mt-1 ${getStrengthTextColor()}`}>
                {getStrengthText()}
              </p>
            </div>

            {/* Confirmar Contraseña */}
            <div className="mb-4 relative">
              <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirmar Contraseña
              </label>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-9 top-8 text-gray-600"
              >
                {confirmPasswordVisible ? "Ocultar" : "Mostrar"}
              </button>
              {!passwordMatch && (
                <p className="text-red-500 text-sm mt-1">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            {/* Requisitos de contraseña */}
            <div className="mb-4 text-sm">
              <p>Tu contraseña debe tener:</p>
              <ul className="list-disc pl-5">
                <li className={`${password.length >= 8 && password.length <= 30 ? 'text-green-600' : 'text-gray-600'}`}>De 8 a 30 caracteres</li>
                <li className={`${/\d/.test(password) ? 'text-green-600' : 'text-gray-600'}`}>Al menos 1 número</li>
                <li className={`${/[a-zA-Z]/.test(password) ? 'text-green-600' : 'text-gray-600'}`}>Al menos 1 letra</li>
                <li className={`${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-600'}`}>Un símbolo especial</li>
                <li className={`${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-600'}`}>
                  Una mayúscula
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <ReCAPTCHA
                sitekey="6Le0l2kqAAAAACYJHrkCQ6HwJrxjWSuj9e6NxIvY"
                onChange={handleRecaptchaChange}
              />
            </div>

            {/* Botón de Crear Cuenta */}
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-lg ${theme === 'dark' ? 'bg-pink-600 hover:bg-pink-500' : 'bg-pink-600 hover:bg-pink-500'} text-white`}
              disabled={!passwordMatch || !recaptchaToken || onSubmitLoading} // Deshabilitar cuando está cargando
            >
              {onSubmitLoading ? "Cargando..." : "Crear Cuenta"}
            </button>

            <span className={`text-xs mt-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-black'}`}>
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login">
                <span className={`inline font-semibold ${theme === 'dark' ? 'text-blue-300 hover:text-blue-600' : 'text-blue-700'}`}>Ingresa aqui</span>
              </Link>
            </span>
          </form>
        </div>
      </div>

    </div>
  );
}

export default RegisterPage;
