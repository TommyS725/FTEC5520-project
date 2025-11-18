import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { REQUIRED_CONFIRMATIONS } from "@/lib/constants";
import { FlightInsurance } from "@/lib/contracts";
import {
  InsuranceTokenKeyFactory,
  AdminKeyFactory,
  PolicyKeyFactory,
} from "@/lib/query";
import { useTransactionTrack } from "@/providers/txTrack";
import { queryOptions, useMutation } from "@tanstack/react-query";
import type { Hex } from "viem";
import { usePublicClient, useWriteContract } from "wagmi";

const policyQueryDocument = graphql(/* GraphQL */ `
  query Policy {
    policies {
      id
      flight {
        id
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
      insuredTokens {
        id
      }
    }
  }
`);

const openPolicyQueryDocument = graphql(/* GraphQL */ `
  query OpenPolicy($currentTimestamp: String!) {
    policies(
      where: {
        expiration_gt: $currentTimestamp
        open: true
        inventory_gt: "0"
        flight_: { settled: false, delay: null }
      }
    ) {
      id
      flight {
        id
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
      insuredTokens {
        id
      }
    }
  }
`);

export const policyQueryOptions = () =>
  queryOptions({
    queryKey: PolicyKeyFactory.all(),
    queryFn: ({ signal }) => execute(policyQueryDocument, signal),
  });

export const openPolicyQueryOptions = () =>
  queryOptions({
    queryKey: PolicyKeyFactory.all(),
    queryFn: ({ signal }) =>
      execute(openPolicyQueryDocument, signal, {
        currentTimestamp: Math.floor(Date.now() / 1000).toString(),
      }),
  });

export const usePurchaseInsuranceMutation = () => {
  const { showTransactionDialog } = useTransactionTrack();

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  return useMutation({
    mutationFn: async (args: { policyId: bigint; price: bigint }) => {
      const txHash = await writeContractAsync({
        abi: FlightInsurance.abi,
        address: FlightInsurance.address,
        functionName: "purchaseInsurance",
        args: [args.policyId],
        value: args.price,
      });
      showTransactionDialog(txHash);
      return publicClient?.waitForTransactionReceipt({
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
      client.invalidateQueries({
        queryKey: AdminKeyFactory.requiredReserve(),
      });
      client.invalidateQueries({
        queryKey: AdminKeyFactory.insuranceContractBalance(),
      });
    },
  });
};

export const useUpdatePolicyStatusMutation = () => {
  const { showTransactionDialog } = useTransactionTrack();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  return useMutation({
    mutationFn: async (args: { policyId: bigint; active: boolean }) => {
      const txHash = await writeContractAsync({
        abi: FlightInsurance.abi,
        address: FlightInsurance.address,
        functionName: args.active ? "activatePolicy" : "deactivatePolicy",
        args: [args.policyId],
      });
      showTransactionDialog(txHash);
      return publicClient?.waitForTransactionReceipt({
        hash: txHash,
        confirmations: REQUIRED_CONFIRMATIONS,
      });
    },
    onSuccess(...args) {
      const client = args[3].client;
      client.invalidateQueries({
        queryKey: PolicyKeyFactory.all(),
      });
    },
  });
};

export const useSettleFlightMutation = () => {
  const { showTransactionDialog } = useTransactionTrack();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  return useMutation({
    mutationFn: async (flightId: Hex) => {
      const txHash = await writeContractAsync({
        abi: FlightInsurance.abi,
        address: FlightInsurance.address,
        functionName: "settleFlight",
        args: [flightId],
      });
      showTransactionDialog(txHash);
      return publicClient?.waitForTransactionReceipt({
        hash: txHash,
        confirmations: REQUIRED_CONFIRMATIONS,
      });
    },
    onSuccess(...args) {
      const client = args[3].client;
      client.invalidateQueries({
        queryKey: PolicyKeyFactory.all(),
      });
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

export const useRequestFlightDataByFlightMutation = () => {
  const { showTransactionDialog } = useTransactionTrack();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  return useMutation({
    mutationFn: async ({
      flightNumber,
      flightDate,
    }: {
      flightNumber: string;
      flightDate: string;
    }) => {
      const txHash = await writeContractAsync({
        abi: FlightInsurance.abi,
        address: FlightInsurance.address,
        functionName: "requestFlightDataByFlight",
        args: [flightNumber, flightDate],
      });
      showTransactionDialog(txHash);
      return publicClient?.waitForTransactionReceipt({
        hash: txHash,
        confirmations: REQUIRED_CONFIRMATIONS,
      });
    },
    onSuccess(...args) {
      const client = args[3].client;
      client.invalidateQueries({
        queryKey: PolicyKeyFactory.all(),
      });
    },
  });
};

interface NewPolicyParams {
  flightNumber: string;
  flightDate: string;
  delayThreshold: bigint;
  expirationTs: bigint;
  payout: bigint;
  inventory: number;
  price: bigint;
  open: boolean;
}

export const useNewPolicyMutation = () => {
  const { showTransactionDialog } = useTransactionTrack();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  return useMutation({
    mutationFn: async (params: NewPolicyParams) => {
      const txHash = await writeContractAsync({
        abi: FlightInsurance.abi,
        address: FlightInsurance.address,
        functionName: "createPolicy",
        args: [
          params.flightNumber,
          params.flightDate,
          params.delayThreshold,
          params.expirationTs,
          params.payout,
          params.inventory,
          params.price,
          params.open,
        ],
      });
      showTransactionDialog(txHash);
      return publicClient?.waitForTransactionReceipt({
        hash: txHash,
        confirmations: REQUIRED_CONFIRMATIONS,
      });
    },
    onSuccess(...args) {
      const client = args[3].client;
      client.invalidateQueries({
        queryKey: PolicyKeyFactory.all(),
      });
    },
  });
};
