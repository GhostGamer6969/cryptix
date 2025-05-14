import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useRef } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from "@solana/web3.js";
import { getSetup } from "../anchor/setup";

export default function AddCid({ masterHash }: { masterHash: string }) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
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

      const { program, vaultPDA } = await getSetup(masterHash);
      const vault = await program.account.vault.fetch(vaultPDA);
      const maxIndex = vault.cidCount.toNumber();

      const transaction = await program.methods
        .addCidEntry(new PublicKey(masterHash), new anchor.BN(maxIndex), String(cid))
        .accounts({
          // vault: vaultPDA,
          user: publicKey,
          // cidEntry: cidPDA,
        })
        .transaction();

      await sendTransaction(transaction, connection);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-md w-fit">
      <label
        htmlFor="file-upload"
        className="text-sm text-gray-700 cursor-pointer"
      >
        {fileName ? fileName : "Upload The Image"}
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
      />

      <button
        className="bg-black text-white text-sm px-4 py-1 rounded disabled:opacity-50"
        onClick={onClick}
        disabled={!publicKey || isLoading}
      >
        {isLoading ? "Uploading..." : "Upload"}
      </button>

    </div>
  );
}
