// setup.ts
import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { Version3 } from "./idl";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import idl from "./version3.json";
import { Buffer } from "buffer";

const IDL = idl as Version3;
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export async function getSetup(masterHash: string) {
    const program = new Program<Version3>(IDL, { connection });

    // Derive the vault PDA using the masterHash
    const [vaultPDA] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("vault"),
            new PublicKey(masterHash).toBuffer(),
        ],
        program.programId,
    );

    // Fetch vault info only if it exists, else don't try to fetch it
    const vaultInfo = await connection.getAccountInfo(vaultPDA);
    if (!vaultInfo) {
        // console.log("Vault does not exist. You will need to initialize it.");
        return { program, vaultPDA, vaultExists: false };
    }

    // If vault exists, fetch the data
    const vault = await program.account.vault.fetch(vaultPDA);
    const entryIndex = vault.entryCount.toNumber();
    const cidIndex = vault.cidCount.toNumber();

    const entryIndexBuffer = Buffer.alloc(8);
    entryIndexBuffer.writeBigUInt64LE(BigInt(entryIndex));

    const [entryPDA] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("entry"),
            vaultPDA.toBuffer(),
            entryIndexBuffer,
        ],
        program.programId,
    );

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

    return {
        program,
        vaultPDA,
        entryPDA,
        cidPDA,
        vaultExists: true,
    };
}

export type vaultData = IdlAccounts<Version3>["vault"];
export type entryData = IdlAccounts<Version3>["vaultEntry"];
export type CidData = IdlAccounts<Version3>["cidEntry"];
