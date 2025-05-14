import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";

import { getSetup } from "../anchor/setup";
import { Eye } from "lucide-react";

import { decryptPassword } from "../utils/encryption";
import { IdlAccounts } from "@coral-xyz/anchor";
import { Version3 } from "../anchor/idl";


type EntryData = IdlAccounts<Version3>["vaultEntry"];

export default function VaultEntry({ masterHash }: { masterHash: string }) {
    const { connection } = useConnection();
    const [entryData, setEntryData] = useState<{ pda: PublicKey, data: EntryData | null, isCardVisible: boolean }[]>([]);

    useEffect(() => {
        if (!masterHash) return;

        const subscriptions: number[] = [];

        const fetchEntryData = async () => {
            try {
                const { program, vaultPDA } = await getSetup(masterHash);

                const vault = await program.account.vault.fetch(vaultPDA);
                const maxIndex = vault.entryCount.toNumber();
                const newEntries: { pda: PublicKey, data: EntryData | null, isCardVisible: boolean }[] = [];

                for (let entryIndex = 0; entryIndex < maxIndex; entryIndex++) {
                    const entryIndexBuffer = Buffer.alloc(8);
                    entryIndexBuffer.writeBigUInt64LE(BigInt(entryIndex));

                    const [entryPDA] = PublicKey.findProgramAddressSync(
                        [
                            Buffer.from("entry"),
                            vaultPDA.toBuffer(),
                            entryIndexBuffer,
                        ],
                        program.programId
                    );

                    try {
                        const data = await program.account.vaultEntry.fetch(entryPDA);
                        newEntries.push({ pda: entryPDA, data, isCardVisible: false });
                    } catch (error) {
                        console.error(`Error fetching entry ${entryIndex}:`, error);
                        newEntries.push({ pda: entryPDA, data: null, isCardVisible: false });
                    }

                    const subscriptionId = connection.onAccountChange(entryPDA, (accountInfo) => {
                        try {
                            const decodedData = program.coder.accounts.decode(
                                "vaultEntry",
                                accountInfo.data,
                            );
                            setEntryData(prev =>
                                prev.map(entry =>
                                    entry.pda.equals(entryPDA)
                                        ? { pda: entryPDA, data: decodedData, isCardVisible: entry.isCardVisible }
                                        : entry
                                )
                            );
                        } catch (error) {
                            console.error("Error decoding account data:", error);
                        }
                    });

                    subscriptions.push(subscriptionId);
                }

                setEntryData(newEntries);
            } catch (error) {
                console.error("Error fetching entry data:", error);
            }
        };

        fetchEntryData();

        return () => {
            for (const subscriptionId of subscriptions) {
                connection.removeAccountChangeListener(subscriptionId);
            }
        };
    }, [connection, masterHash]);

    const toggleCardVisibility = (index: number) => {
        setEntryData(prev =>
            prev.map((entry, i) =>
                i === index ? { ...entry, isCardVisible: !entry.isCardVisible } : entry
            )
        );
    };

    return (
        <>
            <div className="grid grid-cols-5 gap-6 p-8">
                {entryData.map((entry, index) => (
                    <div key={index} className="min-w-[120px] bg-white border border-gray-300 rounded-xl px-4 py-2 flex items-center justify-between shadow-sm">
                        <span className="text-sm font-medium text-gray-800 truncate pr-2 max-w-[120px]">
                            {entry.data?.website}
                        </span>
                        <button onClick={() => toggleCardVisibility(index)} className="text-gray-500 hover:text-gray-700 transition">
                            <Eye className="w-4 h-4" />
                        </button>

                        {/* Overlay for the card with blurred background */}
                        {entry.isCardVisible && entry.data && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-md z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                    <h3 className="text-lg font-semibold mb-4">Entry Details</h3>
                                    <p className="text-sm font-medium text-gray-800">Username: {entry.data?.uname}</p>
                                    <p className="text-sm font-medium text-gray-800">Password: {decryptPassword(masterHash, String(entry.data?.pass), Number(entry.data?.timeStored))}</p>
                                    <button
                                        onClick={() => toggleCardVisibility(index)}
                                        className="mt-4 bg-gray-500 text-white rounded px-4 py-2"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
