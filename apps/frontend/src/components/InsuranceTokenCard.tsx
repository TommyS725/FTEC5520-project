import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { isTokenDelayed, tokenStatus } from "@/lib/token";
import type { InsuranceToken } from "@/lib/types";
import { cn, explorerLink, shortenAddress } from "@/lib/utils";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState, type ComponentProps } from "react";
import { formatEther, parseEther } from "viem"
import { Button } from "./ui/button";
import { useBuyTokenMutation, useClaimPayoutMutation, useListTokenMutation, useRequestFlightDelayInfoWithTokenMutation, useUnlistTokenMutation } from "@/action/insuranceToken";


interface InsuranceTokenCardProps {
    token: InsuranceToken
    showOwner?: boolean
}

export function InsuranceTokenCard({ token, className, showOwner, ...props }: InsuranceTokenCardProps & ComponentProps<typeof Card>) {
    const [price, setPrice] = useState("");
    const [priceDialogOpen, setPriceDialogOpen] = useState(false);
    const { address } = useAppKitAccount();
    const listMutation = useListTokenMutation();
    const unlistMutation = useUnlistTokenMutation();
    const buyMutation = useBuyTokenMutation();
    const requestFlightDelayInfoMutation = useRequestFlightDelayInfoWithTokenMutation();
    const claimPayoutMutation = useClaimPayoutMutation();
    const isOwner = address?.toLowerCase() === token.owner.toLowerCase();
    const policy = token.policy;
    const flight = policy.flight;
    const delayed = isTokenDelayed(token);
    const priceError = price !== "" && Number.isNaN(Number(price)) &&
        "Please enter a valid number";
    return <Card
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
                <p>Token ID: {token.id}</p>
                {showOwner &&
                    <p>Owner:
                        <a
                            href={explorerLink(token.owner, "address")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600  ml-1"
                        >
                            {shortenAddress(token.owner, 10)}
                        </a>
                        {
                            isOwner && " (You)"
                        }
                    </p>
                }
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p>
                Status: {tokenStatus(token)}
            </p>
            <p>
                {token.processed && delayed ? "" : "Planned"} Payout: {formatEther(BigInt(policy.payout))} ETH
            </p>
            <p>
                Delay Threshold: {policy.delayThreshold} minutes
            </p>
            {
                flight.delay && <p>
                    Actual Delay: {flight.delay} minutes
                </p>
            }
            {
                token.listedPrice && <p>
                    Listed Price: {formatEther(BigInt(token.listedPrice))} ETH
                </p>
            }
        </CardContent>
        <CardFooter
            className=" mt-auto justify-end gap-4"
        >
            {/* Token List */}
            {
                token.listedPrice && (isOwner ?
                    <Button
                        disabled={unlistMutation.isPending}
                        onClick={() => unlistMutation.mutate(BigInt(token.id))}
                    >
                        Unlist
                    </Button> :
                    <Button
                        disabled={buyMutation.isPending}
                        onClick={() => buyMutation.mutate({
                            tokenId: BigInt(token.id),
                            value: BigInt(token.listedPrice ?? '0'),
                        })}
                    >
                        Buy
                    </Button>
                )



            }
            {/* not listed */}
            {
                !token.listedPrice && isOwner && <Dialog
                    open={priceDialogOpen}
                    onOpenChange={setPriceDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button
                            disabled={listMutation.isPending}
                        >
                            List on Marketplace
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                List Token #{token.id} on Marketplace
                            </DialogTitle>
                            <DialogDescription>
                                Enter the price at which you want to list your insurance token.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <Label htmlFor="price">Price (ETH)</Label>
                            <Input
                                id="price" placeholder="0.05"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            {priceError && <p className="text-sm text-red-600">{priceError}</p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                disabled={Boolean(priceError) || price === "" || listMutation.isPending}
                                onClick={() => {
                                    setPriceDialogOpen(false);
                                    listMutation.mutate({
                                        tokenId: BigInt(token.id),
                                        price: parseEther(price),
                                    })
                                    setPrice("");
                                }}
                            >Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
            {
                isOwner && !token.processed && !flight.delay &&
                <Button
                    disabled={requestFlightDelayInfoMutation.isPending}
                    onClick={() => requestFlightDelayInfoMutation.mutate(BigInt(token.id))}
                >
                    Request Flight Delay
                </Button>
            }
            {
                isOwner && !token.processed && flight.delay &&
                <Button
                    disabled={claimPayoutMutation.isPending || !delayed}
                    onClick={() => claimPayoutMutation.mutate(BigInt(token.id))}
                >
                    {
                        delayed ? "Claim Payout" : "Not Claimable"
                    }
                </Button>
            }
        </CardFooter>
    </Card>
}



