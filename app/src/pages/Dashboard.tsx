import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";
import AddCid from "../components/add-cid";
import CidState from "../components/cid-state";
import { initializeVault } from "../components/ini-vault";

function Dashboard() {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [masterHash, setMasterHash] = useState("");

    async function handleSaveHash() {
        const masterPass = (document.getElementById("masterPass") as HTMLInputElement).value;

        if (!publicKey) {
            alert("Please connect your wallet first.");
            return;
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(publicKey.toString() + masterPass);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = new Uint8Array(hashBuffer);
        const hashBase58 = bs58.encode(hashArray);

        setMasterHash(hashBase58);
        console.log("Master hash computed:", hashBase58);

        try {
            await initializeVault(hashBase58, connection, publicKey, sendTransaction);
        } catch (err) {
            console.error("Failed to initialize vault:", err);
        }
    }

    return (
        <>
            <WalletMultiButton /> <br />
            <h1 className="text-3xl font-bold font-sans">Criptex</h1>
            <input placeholder="Enter master password" id="masterPass" /> <br />
            <button
                className="bg-black text-white font-sans rounded-2xl h-10 w-20"
                onClick={handleSaveHash}>
                Submit
            </button>

            {masterHash && <AddCid masterHash={masterHash} />}
            <CidState masterHash={masterHash} />
        </>
    );
}

export default Dashboard;
