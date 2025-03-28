export default function NotFound() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "110vh",
          backgroundColor: "#f9f9f9",
          textAlign: "center",
        }}
      >
        <img
          src="/assets/error404.png"
          alt="404 Error"
          style={{ width: "300px", marginBottom: "1rem" }}
        />
        <h1>¡Oops! Página no encontrada</h1>
        <p>
          La página que buscas no existe. Por favor, regresa al{" "}
        <a href="/" style={{ color: "#0070f3", textDecoration: "underline" }}>
          inicio
        </a>.
        </p>

        
      </div>
    );
  }