export default function Home() {
  return (
    <main
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100svh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Hoş geldiniz 👋
        </h1>
        <p style={{ color: "#555", maxWidth: 640, margin: "0 auto" }}>
          ReviewBoard’a hoş geldin. Başlamak için sol menüyü veya üst
          navigasyonu kullanabilirsin.
        </p>
      </div>
    </main>
  );
}


