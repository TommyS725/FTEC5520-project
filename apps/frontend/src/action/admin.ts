import { REQUIRED_CONFIRMATIONS } from "@/lib/constants";
import { FlightInsurance, readRequiredReserveParam } from "@/lib/contracts";
import { AdminKeyFactory } from "@/lib/query";
import { useTransactionTrack } from "@/providers/txTrack";
import { queryOptions, useMutation } from "@tanstack/react-query";
import type { PublicClient } from "viem";
import {
  usePublicClient,
  useSendTransaction,
  useWriteContract,
  type Config,
} from "wagmi";
import { readContractQueryOptions } from "wagmi/query";

export const insuranceContractBalanceQueryOptions = (
  client: PublicClient | undefined
) =>
  queryOptions({
    queryKey: AdminKeyFactory.insuranceContractBalance(),
    queryFn: async () => {
      const balance = await client?.getBalance({
        address: FlightInsurance.address,
      });
      return balance ?? 0n;
    },
    enabled: !!client,
  });

export const requiredReserveQueryOption = (config: Config) =>
  readContractQueryOptions(config, readRequiredReserveParam);

export const useFuelContractMutation = () => {
  const { showTransactionDialog } = useTransactionTrack();
  const { sendTransactionAsync } = useSendTransaction();
  const client = usePublicClient();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      const txHash = await sendTransactionAsync({
        to: FlightInsurance.address,
        value: amount,
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
        queryKey: AdminKeyFactory.insuranceContractBalance(),
      });
    },
  });
};

export const useWithdrawMutation = () => {
  const { showTransactionDialog } = useTransactionTrack();
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();

  return useMutation({
    mutationFn: async (wei: bigint) => {
      const txHash = await writeContractAsync({
        address: FlightInsurance.address,
        abi: FlightInsurance.abi,
        functionName: "withdraw",
        args: [wei],
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
        queryKey: AdminKeyFactory.insuranceContractBalance(),
      });
      client.invalidateQueries({
        queryKey: AdminKeyFactory.requiredReserve(),
      });
    },
  });
};
