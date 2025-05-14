import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import WalletContextLayout from "./contexts/walletContextLayout";
import { MasterHashProvider } from "./contexts/MasterHashContext"; // <-- import
import Dashboard from "./pages/Dashboard";
import Vault from "./pages/Vault"; // if you have this
import Drive from "./pages/Drive";
import Entry from "./pages/Entry";

function App() {
  return (
    <WalletContextLayout>
      <MasterHashProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/images" element={<Drive />} />
            <Route path="/entry" element={<Entry />} />
          </Routes>
        </Router>
      </MasterHashProvider>
    </WalletContextLayout>
  );
}

export default App;
