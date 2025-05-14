import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { getSetup } from "../anchor/setup";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { encryptPassword } from "../utils/encryption";

export default function AddEntry({ masterHash }: { masterHash: string }) {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    const [isLoading, setIsLoading] = useState(false);
    const [website, setWebsite] = useState("");
    const [uname, setUname] = useState("");
    const [pass, setPass] = useState("");



    const onClick = async () => {
        if (!publicKey || !website || !uname || !pass) return;
        const time = Date.now();
        const encryptedPass = encryptPassword(masterHash, pass, time);
        setIsLoading(true);
        // console.log(time);

        try {
            const { program, vaultPDA } = await getSetup(masterHash);

            const vault = await program.account.vault.fetch(vaultPDA);
            const maxIndex = vault.entryCount.toNumber();
            // console.log("Adding entry to index", maxIndex);

            const transaction = await program.methods
                .addVaultEntry(
                    new PublicKey(masterHash),
                    new anchor.BN(maxIndex),
                    String(website),
                    String(uname),
                    String(encryptedPass),
                    new anchor.BN(time),
                )
                .accounts({
                    user: publicKey,
                    // vault: vaultPDA,
                    // entry: entryPDA,
                })
                .transaction()

            await sendTransaction(transaction, connection);
            // const sig = await sendTransaction(transaction, connection);
            // console.log(`Explorer: https://solana.fm/tx/${sig}?cluster=devnet-alpha`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        // <div>
        //     <input
        //         type="text"
        //         id="website"
        //         placeholder="website"
        //         value={website}
        //         onChange={(e) => setWebsite(e.target.value)}
        //     />
        //     <input
        //         type="text"
        //         id="uname"
        //         placeholder="username"
        //         value={uname}
        //         onChange={(e) => setUname(e.target.value)}
        //     />
        //     <input
        //         type="password"
        //         id="pass"
        //         placeholder="password"
        //         value={pass}
        //         onChange={(e) => setPass(e.target.value)}
        //     />
        //     <button onClick={onClick} disabled={isLoading}>
        //         {isLoading ? "Uploading..." : "Upload"}
        //     </button>
        // </div>
        <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Login Details</h2>

            <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Service
                </label>
                <input
                    type="text"
                    id="website"
                    placeholder="Github"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 text-gray-500 rounded-md border border-gray-200 focus:outline-none"
                />
            </div>

            <div>
                <label htmlFor="uname" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                </label>
                <input
                    type="text"
                    id="uname"
                    placeholder="@username"
                    value={uname}
                    onChange={(e) => setUname(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 text-gray-500 rounded-md border border-gray-200 focus:outline-none"
                />
            </div>

            <div>
                <label htmlFor="pass" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <div className="relative">
                    <input
                        type="password"
                        id="pass"
                        placeholder="********"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        className="w-full px-3 py-2 pr-10 bg-gray-50 text-gray-700 rounded-md border border-gray-200 focus:outline-none"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                        👁️
                    </span>
                </div>
            </div>

            <div className="flex justify-between items-center pt-2">
                <button className="text-gray-500 hover:underline" disabled={isLoading}>
                    Cancel
                </button>
                <button
                    onClick={onClick}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-md bg-purple-500 text-white font-medium hover:bg-purple-600 disabled:opacity-50"
                >
                    {isLoading ? "Uploading..." : "Save Login"}
                </button>
            </div>
        </div>

    );
}
