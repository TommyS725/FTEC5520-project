import { FlightInsurance__factory } from "contracts/types/ethers-contracts";
import { FlightDelay__factory } from "contracts/types/ethers-contracts";
import type { Address, ContractFunctionName } from "viem";

export const FlightInsurance = {
  abi: FlightInsurance__factory.abi,
  address: import.meta.env.VITE_FLIGHT_INSURANCE_ADDRESS as Address,
};

export const FlightDelay = {
  abi: FlightDelay__factory.abi,
  address: import.meta.env.VITE_FLIGHT_DELAY_ADDRESS as Address,
};

export const Contracts = [FlightInsurance, FlightDelay];
export type ContractsType = (typeof Contracts)[number];
export const readRequiredReserveParam = {
  abi: FlightInsurance.abi,
  address: FlightInsurance.address,
  functionName: "requiredReserve" as const satisfies ContractFunctionName<
    typeof FlightInsurance.abi
  >,
};
