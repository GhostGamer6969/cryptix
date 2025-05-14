import { useNavigate } from "react-router-dom";
import { useMasterHash } from "../contexts/MasterHashContext";
import FloatingBtn from "../components/floating-btn";
import CidState from "../components/cid-state";
import AddCid from "../components/add-cid";


function Drive() {
    const { masterHash } = useMasterHash();
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
            <div className="flex flex-col items-center shadow-2xl rounded-lg p-4">
                <AddCid masterHash={masterHash} />
                <div className="mt-4">

                    <CidState masterHash={masterHash} />
                </div>
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

export default Drive;
