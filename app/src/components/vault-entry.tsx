
import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { IdlAccounts } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";

import { getSetup } from "../anchor/setup";
import { Version3 } from "../anchor/idl";

type EntryData = IdlAccounts<Version3>["vaultEntry"];

export default function VaultEntry({ masterHash }: { masterHash: string }) {
    const { connection } = useConnection();
    const [entryData, setEntryData] = useState<{ pda: PublicKey, data: EntryData | null }[]>([]);

    useEffect(() => {
        if (!masterHash) return;

        const subscriptions: number[] = [];

        const fetchEntryData = async () => {
            try {
                const { program, vaultPDA } = await getSetup(masterHash);

                const vault = await program.account.vault.fetch(vaultPDA);
                const maxIndex = vault.entryCount.toNumber();
                const newEntries: { pda: PublicKey, data: EntryData | null }[] = [];

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
                        newEntries.push({ pda: entryPDA, data });
                    } catch (error) {
                        console.error(`Error fetching entry ${entryIndex}:`, error);
                        newEntries.push({ pda: entryPDA, data: null });
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
                                        ? { pda: entryPDA, data: decodedData }
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

    return (
        <>
            {entryData.map((entry, index) => (
                <div key={index}>
                    <p className="text-lg"><br />
                        public_key: {entry.pda.toString()} <br />
                        website: {entry.data?.website} <br />
                        uname: {entry.data?.uname} <br />
                        pass: {entry.data?.pass} <br />
                    </p>
                </div>
            ))}
        </>
    );
}
