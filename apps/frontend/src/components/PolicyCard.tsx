import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { ComponentProps } from "react";
import { cn, dateFormat } from "@/lib/utils";
import { formatEther, type Hex } from "viem";
import type { Policy } from "@/lib/types";
import { Button } from "./ui/button";
import { usePurchaseInsuranceMutation, useRequestFlightDataByFlightMutation, useSettleFlightMutation, useUpdatePolicyStatusMutation } from "@/action/policy";


interface PolicyCardProps {
    policy: Policy
    isAdmin?: boolean
    availableReserve?: bigint
}

export const PolicyCard = ({ policy, className, isAdmin, ...props }: PolicyCardProps & ComponentProps<typeof Card>) => {
    const purchaseInsuranceMutation = usePurchaseInsuranceMutation();
    const updatePolicyStatusMutation = useUpdatePolicyStatusMutation();
    const settleFlightMutation = useSettleFlightMutation();
    const requestFlightDataMutation = useRequestFlightDataByFlightMutation();
    const flight = policy.flight;
    const expired = Number(policy.expiration) < Date.now() / 1000;
    const dataStatus =
        flight.delay ? (
            flight.delay >= policy.delayThreshold ? "Delayed" : "On Time"
        ) : flight.requestedAt ? "Delay Info Requested" : "Awaiting Data Request";
    const enoughReserve = props.availableReserve !== undefined && BigInt(policy.payout) <= props.availableReserve;
    const canPurchase = policy.open && !expired && flight.settled === false && flight.delay === null &&
        Number(policy.inventory) > 0 && !purchaseInsuranceMutation.isPending && enoughReserve;

    return (
        <Card
            {...props}
            className={cn("min-w-96 shadow-xl", className)}
        >
            <CardHeader>
                <CardTitle>
                    <div
                        className="flex justify-between"
                    >
                        <p>
                            {flight.flightNumber}
                        </p>
                        <p>
                            {flight.flightDate}
                        </p>
                    </div>
                </CardTitle>
                <CardDescription>
                    <p>Policy ID: {policy.id}</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    Status: {dataStatus}
                </p>
                <p>
                    Open for Sale : {policy.open ? "Yes" : "No"}
                </p>
                <p>
                    Delay Threshold: {policy.delayThreshold} minutes
                </p>
                {
                    flight.delay && <p>
                        Actual Delay: {flight.delay} minutes
                    </p>
                }
                <p>
                    Payout: {formatEther(BigInt(policy.payout))} ETH
                </p>
                <p>
                    Price: {formatEther(BigInt(policy.price))} ETH
                </p>
                <p>
                    Inventory: {policy.inventory} tokens
                </p>
                <p>
                    Sold: {policy.insuredTokens.length} tokens
                </p>
                <p>
                    Expiration: {dateFormat.format(new Date(Number(policy.expiration) * 1000))}
                </p>
            </CardContent>
            <CardFooter
                className=" mt-auto justify-end gap-4"
            >
                {
                    !isAdmin && <Button
                        disabled={!canPurchase}
                        onClick={() => {
                            purchaseInsuranceMutation.mutate({
                                policyId: BigInt(policy.id),
                                price: BigInt(policy.price),
                            });
                        }}
                    >
                        {
                            flight.settled || flight.delay !== null ? "Flight Processed" :
                                expired ? "Policy Expired" :
                                    policy.open ? (enoughReserve ? (Number(policy.inventory) > 0 ? "Purchase" : "Sold Out") : "Insufficient Reserve") : "Policy Closed"
                        }
                    </Button>
                }
                {/* change status */}
                {
                    isAdmin &&
                    <Button
                        disabled={updatePolicyStatusMutation.isPending}
                        onClick={() => {
                            updatePolicyStatusMutation.mutate({
                                policyId: BigInt(policy.id),
                                active: !policy.open,
                            });
                        }}
                    >
                        {policy.open ? "Deactivate Policy" : "Activate Policy"}
                    </Button>

                }
                {/* flight settle/request */}
                {
                    isAdmin && !flight.settled &&
                    <Button
                        disabled={settleFlightMutation.isPending || requestFlightDataMutation.isPending}
                        onClick={() => {
                            if (flight.delay !== null) {
                                settleFlightMutation.mutate(flight.id as Hex);
                            } else {
                                requestFlightDataMutation.mutate({
                                    flightNumber: flight.flightNumber,
                                    flightDate: flight.flightDate,
                                });
                            }
                        }}
                    >
                        {flight.delay ? "Settle Flight" :
                            flight.requestedAt ? "Awaiting Delay Info" : "Request Delay Info"
                        }
                    </Button>
                }
            </CardFooter>
        </Card>
    )
};
