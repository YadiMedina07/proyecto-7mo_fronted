export default function Error400() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "125vh",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <img
          src="/assets/error400.png" // Asegúrate de tener esta imagen en public/assets/
          alt="400 Error"
          style={{
            width: "100%",
            maxWidth: "300px",
            height: "auto",
            objectFit: "contain",
          }}
        />
        <h1 style={{ fontSize: "2rem", marginTop: "20px" }}>Error 400 - Solicitud incorrecta</h1>
        <p style={{ fontSize: "1rem", color: "#555" }}>
          La solicitud realizada no es válida. Verifica la información e inténtalo nuevamente.
        </p>
        <p>
         Por favor, regresa al{" "}
        <a href="/" style={{ color: "#0070f3", textDecoration: "underline" }}>
          inicio
        </a>.
        </p>
      </div>
    );
  }
  