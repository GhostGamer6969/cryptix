import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { IdlAccounts } from "@coral-xyz/anchor";
import { getSetup } from "../anchor/setup";
import { Version3 } from "../anchor/idl";
import { Buffer } from "buffer";
import { Eye } from "lucide-react";

type CidData = IdlAccounts<Version3>["cidEntry"];

export default function CidState({ masterHash }: { masterHash: string }) {
    const { connection } = useConnection();
    const [cidEntries, setCidEntries] = useState<{ pda: PublicKey, data: CidData | null }[]>([]);
    const [fileNames, setFileNames] = useState<Record<string, string>>({});
    const [previewCid, setPreviewCid] = useState<string | null>(null);

    const fetchFileName = async (cid: string) => {
        if (fileNames[cid]) return;

        try {
            const response = await fetch(`https://api.pinata.cloud/v3/files/public?cid=${cid}`, {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
                },
            });

            const result = await response.json();
            const name = result?.data?.files?.[0]?.name || "Unnamed File";
            setFileNames(prev => ({ ...prev, [cid]: name }));
        } catch (err) {
            console.error(`Failed to fetch filename for CID ${cid}:`, err);
            setFileNames(prev => ({ ...prev, [cid]: "Unknown File" }));
        }
    };

    useEffect(() => {
        if (!masterHash) return;
        const subscriptions: number[] = [];

        const loadEntries = async () => {
            try {
                const { program, vaultPDA } = await getSetup(masterHash);
                const vault = await program.account.vault.fetch(vaultPDA);
                const count = vault.cidCount.toNumber();
                const newEntries: typeof cidEntries = [];

                for (let i = 0; i < count; i++) {
                    const cidIndexBuffer = Buffer.alloc(8);
                    cidIndexBuffer.writeBigUInt64LE(BigInt(i));

                    const [cidPDA] = PublicKey.findProgramAddressSync(
                        [Buffer.from("pic"), vaultPDA.toBuffer(), cidIndexBuffer],
                        program.programId
                    );

                    try {
                        const data = await program.account.cidEntry.fetch(cidPDA);
                        newEntries.push({ pda: cidPDA, data });

                        if (data?.cid) fetchFileName(data.cid);
                    } catch (e) {
                        console.error(`Error fetching CID entry at index ${i}:`, e);
                        newEntries.push({ pda: cidPDA, data: null });
                    }

                    const subId = connection.onAccountChange(cidPDA, (acc) => {
                        try {
                            const decoded = program.coder.accounts.decode("cidEntry", acc.data);
                            setCidEntries(prev =>
                                prev.map(entry => entry.pda.equals(cidPDA) ? { pda: cidPDA, data: decoded } : entry)
                            );
                        } catch (e) {
                            console.error("Error decoding account:", e);
                        }
                    });

                    subscriptions.push(subId);
                }

                setCidEntries(newEntries);
            } catch (err) {
                console.error("Failed to load entries:", err);
            }
        };

        loadEntries();

        return () => {
            subscriptions.forEach(id => connection.removeAccountChangeListener(id));
        };
    }, [connection, masterHash]);

    return (
        <div className="space-y-4">
            {cidEntries.map((entry, i) => {
                const cid = entry.data?.cid;
                const filename = cid ? fileNames[cid] ?? "Loading..." : "Invalid Entry";

                return (
                    <div key={i} className="flex items-center justify-between bg-white border rounded-xl p-3 shadow-sm">
                        <span className="text-sm font-medium text-gray-800 truncate max-w-[140px]">{filename}</span>
                        {cid && (
                            <button
                                onClick={() => setPreviewCid(cid)}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Preview Image"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                );
            })}

            {previewCid && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
                    <div className="bg-white rounded-2xl shadow-lg p-4 max-w-full">
                        <img
                            src={`https://copper-causal-mite-58.mypinata.cloud/ipfs/${previewCid}?pinataGatewayToken=-63i3fpaKVLNKPb-lHAkqF3UaC9Y67j7CW2NWL-827AfgPwbUSbyh9luDaFu0GTL`}
                            alt="Preview"
                            width={640}
                            height={360}
                            className="rounded-xl object-contain"
                        />
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setPreviewCid(null)}
                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
