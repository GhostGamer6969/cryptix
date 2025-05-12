
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "@solana/wallet-adapter-react-ui/styles.css";
// Corrected import

import WalletContextLayout from "./contexts/walletContextLayout";
import Dashboard from "./pages/Dashboard";



function App() {
  return (
    <WalletContextLayout>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </WalletContextLayout>
  );
}

export default App;
