import { Navbar } from "../components/navbar/Navbar";
import { Globe } from "../components/globe/Globe";

export function App() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Globe />
    </div>
  );
}
