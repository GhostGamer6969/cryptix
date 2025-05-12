import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { IdlAccounts } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { program, vaultPDA, vaultData } from "../anchor/setup";

export default function VaultState() {
    const { connection } = useConnection();
    const [vaultData, setVaultData] = useState<vaultData | null>(null);

    useEffect(() => {
        const fetchVaultData = async () => {
            try {
                // Fetch initial account data
                const data = await program.account.vault.fetch(vaultPDA)
                setVaultData(data);
            } catch (error) {
                console.error("Error fetching counter data:", error);
            }
        };

        fetchVaultData();

        // Subscribe to account change
        const subscriptionId = connection.onAccountChange(
            // The address of the account we want to watch
            vaultPDA,
            // Callback for when the account changes
            (accountInfo) => {
                try {
                    const decodedData = program.coder.accounts.decode(
                        "vault",
                        accountInfo.data,
                    );
                    setVaultData(decodedData);
                } catch (error) {
                    console.error("Error decoding account data:", error);
                }
            },
        );

        return () => {
            // Unsubscribe from account change
            connection.removeAccountChangeListener(subscriptionId);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [program, vaultPDA, connection]);

    // Render the value of the counter
    return <>
        <p className="text-lg"><br />
            public_key: {vaultPDA.toString()} <br />
            masterhash: {vaultData?.masterhash?.toString()}<br />
            entry_count: {vaultData?.entryCount?.toString()}<br />
            cid_count: {vaultData?.cidCount?.toString()}<br />

        </p>
    </>;
}
