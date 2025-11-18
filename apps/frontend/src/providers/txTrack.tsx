import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { zeroAddress } from "viem";


type TransactionTrackContextType = {
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    showTransactionDialog: (txHash: `0x${string}`) => void;
    txHash: `0x${string}`;
}

const TransactionTrackContext = createContext<TransactionTrackContextType | undefined>(undefined);

export function TransactionTrackProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [txHash, setTxHash] = useState<`0x${string}`>(zeroAddress);
    const showTransactionDialog = (hash: `0x${string}`) => {
        setTxHash(hash);
        setDialogOpen(true);
    };
    return (
        <TransactionTrackContext.Provider value={{
            dialogOpen,
            showTransactionDialog,
            txHash,
            setDialogOpen
        }}>
            {children}
        </TransactionTrackContext.Provider>
    );

}

export function useTransactionTrack() {
    const context = useContext(TransactionTrackContext);
    if (context === undefined) {
        throw new Error(
            "useTransactionTrack must be used within a TransactionTrackProvider"
        );
    }
    return context;
}
