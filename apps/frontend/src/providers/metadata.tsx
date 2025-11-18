import { FlightDelay, FlightInsurance } from "@/lib/contracts";
import { useAppKitAccount } from "@reown/appkit/react";
import { createContext, useContext } from "react";
import type { Address } from "viem";
import { useReadContracts } from "wagmi";




interface MetadataContextType {
    flightDelayAdmin?: Address
    flightInsuranceAdmin?: Address
    isDelayAdmin?: boolean
    isInsuranceAdmin?: boolean
}

const metadataContext = createContext<MetadataContextType | undefined>(undefined);

export function MetadataProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { address } = useAppKitAccount();
    const contractReads = useReadContracts({
        contracts: [
            {
                abi: FlightDelay.abi,
                address: FlightDelay.address,
                functionName: "owner",
            },
            {
                abi: FlightInsurance.abi,
                address: FlightInsurance.address,
                functionName: "owner",
            },
        ],
    });
    const metadata: MetadataContextType = {
        flightDelayAdmin: contractReads.data?.[0].result,
        flightInsuranceAdmin: contractReads.data?.[1].result,
        isDelayAdmin: address?.toLowerCase() === contractReads.data?.[0].result?.toLowerCase(),
        isInsuranceAdmin: address?.toLowerCase() === contractReads.data?.[1].result?.toLowerCase(),
    };

    return (
        <metadataContext.Provider value={metadata}>
            {children}
        </metadataContext.Provider>
    );
}

export function useMetadata() {
    const context = useContext(metadataContext);
    if (context === undefined) {
        throw new Error("useMetadata must be used within a MetadataProvider");
    }
    return context;
}   