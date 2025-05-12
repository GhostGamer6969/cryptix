import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { IdlAccounts } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { getSetup } from "../anchor/setup";
import { Version3 } from "../anchor/idl";
import { Buffer } from "buffer";

type CidData = IdlAccounts<Version3>["cidEntry"];

export default function CidState({ masterHash }: { masterHash: string }) {
    const { connection } = useConnection();
    const [cidEntries, setCidEntries] = useState<{ pda: PublicKey, data: CidData | null }[]>([]);

    useEffect(() => {
        if (!masterHash) return;

        const subscriptions: number[] = [];

        const fetchAllEntries = async () => {
            try {
                const { program, vaultPDA } = await getSetup(masterHash);

                const vault = await program.account.vault.fetch(vaultPDA);
                const maxIndex = vault.cidCount.toNumber();

                const newEntries: { pda: PublicKey, data: CidData | null }[] = [];

                for (let cidIndex = 0; cidIndex < maxIndex; cidIndex++) {
                    const cidIndexBuffer = Buffer.alloc(8);
                    cidIndexBuffer.writeBigUInt64LE(BigInt(cidIndex));

                    const [cidPDA] = PublicKey.findProgramAddressSync(
                        [
                            Buffer.from("pic"),
                            new PublicKey(vaultPDA).toBuffer(),
                            cidIndexBuffer,
                        ],
                        program.programId
                    );

                    try {
                        const data = await program.account.cidEntry.fetch(cidPDA);
                        newEntries.push({ pda: cidPDA, data });
                    } catch (error) {
                        console.error(`Error fetching CID entry ${cidIndex}:`, error);
                        newEntries.push({ pda: cidPDA, data: null });
                    }

                    // Subscribe to account changes
                    const subscriptionId = connection.onAccountChange(cidPDA, (accountInfo) => {
                        try {
                            const decodedData = program.coder.accounts.decode("cidEntry", accountInfo.data);
                            setCidEntries(prev =>
                                prev.map(entry =>
                                    entry.pda.equals(cidPDA) ? { pda: cidPDA, data: decodedData } : entry
                                )
                            );
                        } catch (error) {
                            console.error(`Error decoding CID entry ${cidIndex}:`, error);
                        }
                    });

                    subscriptions.push(subscriptionId);
                }

                setCidEntries(newEntries);
            } catch (e) {
                console.error("Failed to fetch vault or entries:", e);
            }
        };

        fetchAllEntries();

        return () => {
            for (const subId of subscriptions) {
                connection.removeAccountChangeListener(subId);
            }
        };
    }, [connection, masterHash]);

    return (
        <div>
            {cidEntries.map((entry, index) => (
                <div key={index} className="text-lg">
                    <p><br />
                        public_key: {entry.pda.toString()} <br />
                        cid: {entry.data?.cid ?? "Loading..."} <br />
                    </p>
                    {entry.data?.cid && (
                        <div>
                            <p>Image:</p>
                            <img
                                src={`https://copper-causal-mite-58.mypinata.cloud/ipfs/${entry.data?.cid}?pinataGatewayToken=-63i3fpaKVLNKPb-lHAkqF3UaC9Y67j7CW2NWL-827AfgPwbUSbyh9luDaFu0GTL`}
                                alt="CID Image"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
