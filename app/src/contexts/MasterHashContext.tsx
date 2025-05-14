import { createContext, useContext, useState, ReactNode } from "react";

type MasterHashContextType = {
    masterHash: string;
    setMasterHash: (hash: string) => void;
};

const MasterHashContext = createContext<MasterHashContextType | undefined>(undefined);

export function MasterHashProvider({ children }: { children: ReactNode }) {
    const [masterHash, setMasterHash] = useState(() => {
        // Retrieve masterHash from localStorage if available
        const storedHash = localStorage.getItem("masterHash");
        return storedHash || "";
    });

    const updateMasterHash = (hash: string) => {
        setMasterHash(hash);
        localStorage.setItem("masterHash", hash); // Save to localStorage
    };

    return (
        <MasterHashContext.Provider value={{ masterHash, setMasterHash: updateMasterHash }}>
            {children}
        </MasterHashContext.Provider>
    );
}

export function useMasterHash() {
    const context = useContext(MasterHashContext);
    if (!context) {
        throw new Error("useMasterHash must be used within a MasterHashProvider");
    }
    return context;
}
