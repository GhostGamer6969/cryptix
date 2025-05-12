import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useRef } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from "@solana/web3.js";
import { getSetup } from "../anchor/setup";

export default function AddCid({ masterHash }: { masterHash: string }) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToPinata = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("network", "public");
    form.append("file", file);

    const response = await fetch("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
      body: form,
    });

    const result = await response.json();
    const cid = result?.data?.cid;

    if (!cid) {
      console.error("Unexpected Pinata response:", result);
      throw new Error("No CID returned from Pinata");
    }

    return cid;
  };

  const onClick = async () => {
    if (!publicKey || !fileInputRef.current?.files?.[0]) return;

    setIsLoading(true);

    try {
      const file = fileInputRef.current.files[0];
      const cid = await uploadToPinata(file);
      console.log("Uploaded CID:", cid);

      const { program, vaultPDA, cidPDA } = await getSetup(masterHash);
      const vault = await program.account.vault.fetch(vaultPDA);
      const maxIndex = vault.cidCount.toNumber();
      console.log("Adding CID to index", maxIndex);
      const transaction = await program.methods
        .addCidEntry(new PublicKey(masterHash), new anchor.BN(maxIndex), String(cid))
        .accounts({
          user: publicKey,
          vault: vaultPDA,
          cidEntry: cidPDA,
        })
        .transaction();

      const sig = await sendTransaction(transaction, connection);
      console.log(`Explorer: https://solana.fm/tx/${sig}?cluster=devnet-alpha`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" ref={fileInputRef} />
      <button className="w-24" onClick={onClick} disabled={!publicKey || isLoading}>
        {isLoading ? "Uploading..." : "Add CID"}
      </button>
    </div>
  );
}
