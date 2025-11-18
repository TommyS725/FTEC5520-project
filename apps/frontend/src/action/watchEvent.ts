import { REFETCH_ON_EVENT_MS } from "@/lib/constants";
import {
  type ContractsType,
  FlightDelay,
  FlightInsurance,
} from "@/lib/contracts";
import {
  InsuranceTokenKeyFactory,
  AdminKeyFactory,
  PolicyKeyFactory,
} from "@/lib/query";
import type { QueryClient } from "@tanstack/react-query";
import type { ContractEventName, PublicClient } from "viem";

type Invalidate = {
  insuranceToken: boolean;
  policy: boolean;
  reserve: boolean;
  balance: boolean;
};

type WatchContractEventEntry<C extends ContractsType> = {
  eventName: ContractEventName<C["abi"]>;
  invalidate: Partial<Invalidate>;
};

const INVALIDATE_TO_QUERY_KEY: {
  [K in keyof Invalidate]: () => readonly unknown[];
} = {
  insuranceToken: InsuranceTokenKeyFactory.all,
  policy: PolicyKeyFactory.all,
  reserve: AdminKeyFactory.requiredReserve,
  balance: AdminKeyFactory.insuranceContractBalance,
};

const insuranceEventsConfig: WatchContractEventEntry<typeof FlightInsurance>[] =
  [
    {
      eventName: "Transfer",
      invalidate: { insuranceToken: true },
    },
    {
      eventName: "TokenListed",
      invalidate: { insuranceToken: true },
    },
    {
      eventName: "TokenUnlisted",
      invalidate: { insuranceToken: true },
    },
    {
      eventName: "TokenProcessed",
      invalidate: { insuranceToken: true, reserve: true },
    },
    {
      eventName: "InsurancePurchased",
      invalidate: { policy: true, reserve: true, balance: true }, //insurance is invalidated by the Transfer event watch
    },
    {
      eventName: "PolicyStatusChanged",
      invalidate: { policy: true },
    },
    {
      eventName: "FlightSettled",
      invalidate: { policy: true },
    },
    {
      eventName: "PolicyCreated",
      invalidate: { policy: true },
    },
    {
      eventName: "Withdrawal",
      invalidate: { reserve: true, balance: true },
    },
  ];

const flightDelayEventsConfig: WatchContractEventEntry<typeof FlightDelay>[] = [
  {
    eventName: "FlightDelayRequested",
    invalidate: { insuranceToken: true, policy: true },
  },
  {
    eventName: "FlightDelayFulfilled",
    invalidate: { insuranceToken: true, policy: true },
  },
];

const CONFIG_MAP = {
  [FlightInsurance.address]: insuranceEventsConfig,
  [FlightDelay.address]: flightDelayEventsConfig,
};

const createWatchEvent = <C extends ContractsType>(
  contract: C,
  publicClient: PublicClient,
  qc: QueryClient
) => {
  return publicClient.watchContractEvent({
    abi: contract.abi,
    address: contract.address,

    onLogs: (logs) => {
      const invalidate: Invalidate = {
        insuranceToken: false,
        policy: false,
        reserve: false,
        balance: false,
      };
      const config = CONFIG_MAP[contract.address];
      for (const log of logs) {
        const entry = config.find((e) => e.eventName === log.eventName);
        if (entry) {
          for (const key of Object.keys(
            entry.invalidate
          ) as (keyof Invalidate)[]) {
            if (entry.invalidate[key]) {
              invalidate[key] = true;
            }
          }
        }
      }
      setTimeout(() => {
        for (const key of Object.keys(invalidate) as (keyof Invalidate)[]) {
          console.log("Checking invalidate for key:", key);
          if (invalidate[key]) {
            const queryKey = INVALIDATE_TO_QUERY_KEY[key]();
            qc.invalidateQueries({
              queryKey,
              refetchType: "all",
            }).then(() => {
              qc.refetchQueries({
                queryKey,
                type: "all",
              });
            });
          }
        }
      }, REFETCH_ON_EVENT_MS); //give some time for the blockchain state to update
    },
  });
};

export const watchAllContractEvents = (
  publicClient: PublicClient,
  queryClient: QueryClient
) => {
  const cleanup = new Array<() => void>();
  cleanup.push(createWatchEvent(FlightInsurance, publicClient, queryClient));
  cleanup.push(createWatchEvent(FlightDelay, publicClient, queryClient));
  return () => {
    for (const fn of cleanup) {
      fn();
    }
  };
};
