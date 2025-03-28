"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/authContext';
import { CONFIGURACIONES } from '../../config/config';

function ResetPasswordPage({ params }) {
  const { theme } = useAuth();
  const router = useRouter();

  const token = params?.token;

  // Estados para las contraseñas
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Para mostrar un mensaje de error (contraseñas no coinciden, etc.)
  const [error, setError] = useState("");

  // Para saber si se reestableció la contraseña
  const [passwordReset, setPasswordReset] = useState(false);

  // Estados de requisitos individuales
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasMaxLength, setHasMaxLength] = useState(true);
  const [hasLetter, setHasLetter] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  // Nivel de fortaleza (0 a 6)
  const [passwordStrength, setPasswordStrength] = useState(0);

  // ------------------------------------------------------------------
  // Funciones para manejar la contraseña
  // ------------------------------------------------------------------

  // Verifica cada requisito y asigna un "score"
  const checkPasswordRequirements = (pwd) => {
    const minLen = pwd.length >= 8;
    const maxLen = pwd.length <= 30;
    const letter = /[A-Za-z]/.test(pwd);
    const number = /\d/.test(pwd);
    const uppercase = /[A-Z]/.test(pwd);
    const specialChar = /[^A-Za-z0-9]/.test(pwd);

    setHasMinLength(minLen);
    setHasMaxLength(maxLen);
    setHasLetter(letter);
    setHasNumber(number);
    setHasUppercase(uppercase);
    setHasSpecialChar(specialChar);

    // Calcula un "score" sumando cuántos requisitos se cumplen
    let score = 0;
    if (minLen) score++;
    if (maxLen) score++;
    if (letter) score++;
    if (number) score++;
    if (uppercase) score++;
    if (specialChar) score++;
    setPasswordStrength(score);
  };

  // Cada vez que cambie la contraseña
  const handlePasswordInputChange = (e) => {
    const newPwd = e.target.value;
    setPassword(newPwd);
    checkPasswordRequirements(newPwd);
    // Limpiamos el error si se está mostrando uno previo
    setError("");
  };

  // Cada vez que cambie la confirmación
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  // ------------------------------------------------------------------
  // Funciones para mostrar barra y texto de fortaleza
  // ------------------------------------------------------------------

  // Color de la barra según el "score"
  const getStrengthBarColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    if (passwordStrength === 4) return "bg-blue-500";
    if (passwordStrength >= 5) return "bg-green-500";
    return "bg-gray-300";
  };

  // Texto descriptivo de fortaleza
  const getStrengthText = () => {
    if (passwordStrength <= 2) return "Débil";
    if (passwordStrength === 3) return "Media";
    if (passwordStrength === 4) return "Fuerte";
    if (passwordStrength >= 5) return "Muy fuerte";
    return "";
  };

  // Color del texto de fortaleza
  const getStrengthTextColor = () => {
    if (passwordStrength <= 2) return "text-red-500";
    if (passwordStrength === 3) return "text-yellow-500";
    if (passwordStrength === 4) return "text-blue-500";
    if (passwordStrength >= 5) return "text-green-500";
    return "text-gray-500";
  };

  // ------------------------------------------------------------------
  // Manejo del Submit (restablecer la contraseña)
  // ------------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Verifica que todos los requisitos se cumplan (score = 6)
    if (passwordStrength < 6) {
      setError("La contraseña no cumple todos los requisitos.");
      return;
    }

    // Verifica que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Petición al backend
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setPasswordReset(true);
      } else {
        const result = await response.json();
        setError(result.message);
      }
    } catch (error) {
      setError("Error restableciendo la contraseña.");
    }
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div
      className={`
        min-h-screen flex items-center justify-center pt-48
        ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}
      `}
    >
      <div
        className={`
          w-full max-w-md p-8 rounded-lg shadow-md
          ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
        `}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Restablecer Contraseña
        </h2>

        {passwordReset ? (
          <p className="text-pink-700 text-sm text-center mt-6">
            Tu contraseña ha sido restablecida con éxito. Ahora puedes iniciar sesión.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Campo de Nueva Contraseña */}
            <div className="mb-4">
              <label
                className={`block pb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Nueva contraseña
              </label>
              <input
                type="password"
                placeholder="Ingresa tu nueva contraseña"
                value={password}
                onChange={handlePasswordInputChange}
                className={`w-full border p-2 rounded-lg
                  ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}
                `}
                required
              />
              {/* Barra de fortaleza */}
              <div className="mt-2 h-2 w-full bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${getStrengthBarColor()}`}
                  style={{ width: `${(passwordStrength / 6) * 100}%` }}
                ></div>
              </div>
              {/* Texto de fortaleza */}
              <p className={`mt-1 ${getStrengthTextColor()}`}>
                {getStrengthText()}
              </p>
            </div>

            {/* Campo de Confirmar Contraseña */}
            <div className="mb-4">
              <label
                className={`block pb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Confirmar contraseña
              </label>
              <input
                type="password"
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full border p-2 rounded-lg
                  ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}
                `}
                required
              />
            </div>

            {/* Lista de requisitos */}
            <div className="mb-4 text-sm">
              <p>Tu contraseña debe tener:</p>
              <ul className="list-disc pl-5">
                <li className={hasMinLength ? "text-green-600" : "text-gray-600"}>
                  De 8 a 30 caracteres
                </li>
                <li className={hasNumber ? "text-green-600" : "text-gray-600"}>
                  Al menos 1 número
                </li>
                <li className={hasLetter ? "text-green-600" : "text-gray-600"}>
                  Al menos 1 letra
                </li>
                <li className={hasSpecialChar ? "text-green-600" : "text-gray-600"}>
                  Un símbolo especial
                </li>
                <li className={hasUppercase ? "text-green-600" : "text-gray-600"}>
                  Una mayúscula
                </li>
              </ul>
            </div>

            {/* Botón de Restablecer */}
            <button
              type="submit"
              className="w-full bg-pink-700 text-white py-2 px-4 rounded-lg hover:bg-pink-500"
            >
              Restablecer Contraseña
            </button>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;

