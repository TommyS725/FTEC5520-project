import { queryOptions, useMutation } from "@tanstack/react-query";
import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { usePublicClient, useWriteContract } from "wagmi";
import { FlightInsurance } from "@/lib/contracts";
import { useTransactionTrack } from "@/providers/txTrack";
import {
  InsuranceTokenKeyFactory,
  AdminKeyFactory,
  PolicyKeyFactory,
} from "@/lib/query";
import { REQUIRED_CONFIRMATIONS } from "@/lib/constants";

const listedInsuranceTokenQueryDocument = graphql(/* GraphQL */ `
  query listedInsuranceTokens {
    insuranceTokens(where: { listedPrice_not: null }) {
      id
      owner
      listedPrice
      processed
      policy {
        id
        flight {
          flightNumber
          flightDate
          settled
          requestedAt
          delay
        }
        payout
        delayThreshold
        expiration
        inventory
        open
        price
      }
    }
  }
`);

const ownedInsuranceTokenQueryDocument = graphql(/* GraphQL */ `
  query ownedInsuranceTokens($address: String!) {
    insuranceTokens(where: { owner: $address }) {
      id
      owner
      listedPrice
      processed
      policy {
        id
        flight {
          flightNumber
          flightDate
          settled
          requestedAt
          delay
        }
        payout
        delayThreshold
        expiration
        inventory
        open
        price
      }
    }
  }
`);

export const ownedInsuranceTokenQueryOptions = (address: string) =>
  queryOptions({
    queryKey: InsuranceTokenKeyFactory.owned(address),
    queryFn: ({ signal }) =>
      execute(ownedInsuranceTokenQueryDocument, signal, {
        address: address.toLowerCase(),
      }),
    enabled: Boolean(address),
  });

export const listedInsuranceTokenQueryOptions = () =>
  queryOptions({
    queryKey: InsuranceTokenKeyFactory.all(),
    queryFn: ({ signal }) => execute(listedInsuranceTokenQueryDocument, signal),
  });

export const useUnlistTokenMutation = () => {
  const { showTransactionDialog } = useTransactionTrack();
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();
  return useMutation({
    mutationFn: async (tokenId: bigint) => {
      const txHash = await writeContractAsync({
        abi: FlightInsurance.abi,
        address: FlightInsurance.address,
        functionName: "unlistToken",
        args: [tokenId],
      });
      showTransactionDialog(txHash);
      return client?.waitForTransactionReceipt({
        hash: txHash,
        confirmations: REQUIRED_CONFIRMATIONS,
      });
    },
    onSuccess(...args) {
      const client = args[3].client;
      client.invalidateQueries({
        queryKey: InsuranceTokenKeyFactory.all(),
      });
    },
  });
};

export const useListTokenMutation = () => {
  const { showTransactionDialog } = useTransactionTrack();
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();

  return useMutation({
    mutationFn: async (params: { tokenId: bigint; price: bigint }) => {
      const txHash = await writeContractAsync({
        abi: FlightInsurance.abi,
        address: FlightInsurance.address,
        functionName: "listToken",
        args: [params.tokenId, params.price],
      });
      showTransactionDialog(txHash);
      return client?.waitForTransactionReceipt({
        hash: txHash,
        confirmations: REQUIRED_CONFIRMATIONS,
      });
    },
    onSuccess(...args) {
      const client = args[3].client;
      client.invalidateQueries({
        queryKey: InsuranceTokenKeyFactory.all(),
      });
    },
  });
};

export const useBuyTokenMutation = () => {
  const { showTransactionDialog } = useTransactionTrack();
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();

  return useMutation({
    mutationFn: async (params: { tokenId: bigint; value: bigint }) => {
      const txHash = await writeContractAsync({
        abi: FlightInsurance.abi,
        address: FlightInsurance.address,
        functionName: "purchaseToken",
        args: [params.tokenId],
        value: params.value,
      });
      showTransactionDialog(txHash);
      return client?.waitForTransactionReceipt({
        hash: txHash,
        confirmations: REQUIRED_CONFIRMATIONS,
      });
    },
    onSuccess(...args) {
      const client = args[3].client;
      client.invalidateQueries({
        queryKey: InsuranceTokenKeyFactory.all(),
      });
    },
  });
};

export const useClaimPayoutMutation = () => {
  const { showTransactionDialog } = useTransactionTrack();
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();

  return useMutation({
    mutationFn: async (tokenId: bigint) => {
      const txHash = await writeContractAsync({
        abi: FlightInsurance.abi,
        address: FlightInsurance.address,
        functionName: "claimPayout",
        args: [tokenId],
      });
      showTransactionDialog(txHash);
      return client?.waitForTransactionReceipt({
        hash: txHash,
        confirmations: REQUIRED_CONFIRMATIONS,
      });
    },
    onSuccess(...args) {
      const client = args[3].client;
      client.invalidateQueries({
        queryKey: InsuranceTokenKeyFactory.all(),
      });
      client.invalidateQueries({
        queryKey: AdminKeyFactory.requiredReserve(),
      });
      client.invalidateQueries({
        queryKey: AdminKeyFactory.insuranceContractBalance(),
      });
    },
  });
};

export const useRequestFlightDelayInfoWithTokenMutation = () => {
  const { showTransactionDialog } = useTransactionTrack();
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();

  return useMutation({
    mutationFn: async (tid: bigint) => {
      const txHash = await writeContractAsync({
        abi: FlightInsurance.abi,
        address: FlightInsurance.address,
        functionName: "tokenOwnerRequestFlightData",
        args: [tid],
      });
      showTransactionDialog(txHash);
      return client?.waitForTransactionReceipt({
        hash: txHash,
        confirmations: REQUIRED_CONFIRMATIONS,
      });
    },
    onSuccess(...args) {
      const client = args[3].client;
      client.invalidateQueries({
        queryKey: InsuranceTokenKeyFactory.all(),
      });
      client.invalidateQueries({
        queryKey: PolicyKeyFactory.all(),
      });
    },
  });
};
