import { useState } from "react";
import { Plus, Vault, Image, CreditCard, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FloatingBtn() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
            <div className="relative flex items-center justify-center">
                {isOpen && (
                    <>
                        <button onClick={() => navigate("/vault")} className="absolute -top-20 bg-violet-100 text-black rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-md text-sm">
                            <Vault className="w-4 h-4 mb-1" />
                            Vault
                        </button>
                        <button onClick={() => navigate("/images")} className="absolute -left-20 top-0 bg-pink-100 text-black rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-md text-sm">
                            <Image className="w-4 h-4 mb-1" />
                            Images
                        </button>
                        <button onClick={() => navigate("/entry")} className="absolute -right-20 top-0 bg-purple-100 text-black rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-md text-sm">
                            <CreditCard className="w-4 h-4 mb-1" />
                            Entry
                        </button>
                    </>
                )}

                {/* Central toggle button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-purple-600 text-white rounded-full w-14 h-14 text-3xl shadow-lg flex items-center justify-center transition-transform duration-200"
                >
                    {isOpen ? <X size={24} /> : <Plus size={24} />}
                </button>
            </div>
        </div>
    );
}
