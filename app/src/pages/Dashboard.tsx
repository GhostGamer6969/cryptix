import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";
import { initializeVault } from "../components/ini-vault";
import { useMasterHash } from "../contexts/MasterHashContext"; // adjust path
import { useNavigate } from "react-router-dom"; // <-- import useNavigate

function Dashboard() {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { setMasterHash } = useMasterHash();
    const navigate = useNavigate(); // <-- useNavigate hook

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
        // console.log("Master hash computed:", hashBase58);

        try {
            await initializeVault(hashBase58, connection, publicKey, sendTransaction);
            alert("Vault initialized successfully!");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            navigate("/vault");
        } catch (err) {
            console.error("Failed to initialize vault:", err);
        }
    }


    return (
        <>
            <div className="absolute top-4 right-4">
                <WalletMultiButton style={{ borderRadius: "0.75", backgroundColor: "black", color: "white" }}>
                    {publicKey ? "Options" : "Connect Wallet"}
                </WalletMultiButton>
            </div>

            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-6xl font-bold font-sans  m-4">Criptex</h1>
                <input placeholder="Enter master password" className="p-2 text-black bg-gray-100 rounded-xl w-96 text-center mb-4 " id="masterPass" /> <br />
                <button
                    className="bg-black text-white font-sans rounded-2xl h-10 w-20 mt-4"
                    onClick={handleSaveHash}>
                    Submit
                </button>
            </div>

            {/* {masterHash && <AddCid masterHash={masterHash} />} */}
            {/* <CidState masterHash={masterHash} /> */}
            {/* {masterHash && <AddEntry masterHash={masterHash} />}*/}
            {/* <VaultEntry masterHash={masterHash} /> */}
        </>
    );
}

export default Dashboard;
