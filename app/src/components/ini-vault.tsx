import { getSetup } from "../anchor/setup";
import { PublicKey } from "@solana/web3.js";

export async function initializeVault(masterhash: string, connection: any, publicKey: PublicKey, sendTransaction: any) {
    const { program, vaultPDA } = await getSetup(masterhash);

    const vaultInfo = await connection.getAccountInfo(vaultPDA);
    if (vaultInfo) {
        console.log("Vault already exists, skipping initialization.");
        return;
    }
    const masterPubkey = new PublicKey(masterhash);
    try {
        const transaction = await program.methods.initializeVault(masterPubkey).accountsPartial({
            vault: vaultPDA,
            user: publicKey,
        }).transaction();
        await sendTransaction(transaction, connection,);
        // const signature = await sendTransaction(transaction, connection,);
        // console.log(`Vault initialized. Explorer: https://solana.fm/tx/${signature}?cluster=devnet-alpha`);


    } catch (err) {
        console.error("Vault initialization failed:", err);
        throw err;
    }
}
