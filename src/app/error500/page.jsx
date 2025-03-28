export default function Error500() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "114vh",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
      }}
    >
      <img
        src="/assets/error500.png" // Ruta de tu imagen para error 500
        alt="500 Error"
        style={{ width: "300px", marginBottom: "1rem" }}
      />
      <h1 style={{ fontSize: "2rem" }}>Error 500 - Error interno del servidor</h1>
      <p style={{ fontSize: "1rem", color: "#555" }}>
        Algo salió mal. Por favor, inténtalo nuevamente más tarde o contacta al
        soporte.
         Regresar al{" "}
        <a href="/" style={{ color: "#0070f3", textDecoration: "underline" }}>
          inicio
        </a>.
      </p>
      
    </div>
  );
}
