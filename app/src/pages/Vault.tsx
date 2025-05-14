import { useNavigate } from "react-router-dom";
import VaultEntry from "../components/vault-entry";
import { useMasterHash } from "../contexts/MasterHashContext";
import FloatingBtn from "../components/floating-btn";


function Vault() {
    const { masterHash } = useMasterHash();
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
            <div className="flex flex-col items-center shadow-2xl rounded-lg p-4">
                <VaultEntry masterHash={masterHash} />
            </div>

            {/* Home Button */}
            <button
                className="absolute bottom-6 right-6 bg-black text-white font-sans rounded-2xl h-10 w-20"
                onClick={() => navigate("/")}>
                Home
            </button>
            <FloatingBtn />
        </div>

    );
}

export default Vault;
