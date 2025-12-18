import Navbar from "./Navbar.jsx";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {children}
      </div>
    </div>
  );
}
