import { insuranceContractBalanceQueryOptions, requiredReserveQueryOption, useWithdrawMutation } from "@/action/admin";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useConfig, usePublicClient } from "wagmi";
import { Badge } from "../ui/badge";

interface WithdrawDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function WithdrawDialog({
    open, onOpenChange,
}: WithdrawDialogProps) {
    const publicClient = usePublicClient();
    const config = useConfig();
    const balanceQuery = useQuery(insuranceContractBalanceQueryOptions(publicClient));
    const requiredReserveQuery = useQuery(requiredReserveQueryOption(config));
    const withdrawMutation = useWithdrawMutation();
    const [inputValue, setInputValue] = useState('');
    const notNumber = Number.isNaN(Number(inputValue)) || Number(inputValue) <= 0;
    const loading = balanceQuery.isLoading || requiredReserveQuery.isLoading || withdrawMutation.isPending;
    const remainReserve = balanceQuery.isSuccess && requiredReserveQuery.isSuccess ?
        balanceQuery.data - requiredReserveQuery.data : undefined;
    const exceed = remainReserve !== undefined && !notNumber && parseEther(inputValue) > remainReserve;
    const err = notNumber ? "Please enter a valid positive number." : exceed ? "Amount exceeds available withdrawable funds." : undefined;
    const useMax = () => {
        if (remainReserve === undefined) return;
        setInputValue(formatEther(remainReserve));
    }
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Withdraw Funds
                    </DialogTitle>
                    <DialogDescription>
                        Enter amount of ETH to withdraw from the insurance contract.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="amount">Amount (in ETH)</Label>
                        <Input
                            id="amount"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="e.g., 1.5"
                            type="number"
                            step="0.01"
                            min="0"
                        />
                        {
                            remainReserve !== undefined && <div>
                                <Badge>
                                    Max: {formatEther(remainReserve)} ETH
                                </Badge>
                                <Button
                                    variant="link"
                                    className="ml-2 p-0"
                                    onClick={useMax}
                                >
                                    Use Max
                                </Button>
                            </div>
                        }
                        {err && inputValue && <p className="text-sm text-red-600">{err}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        disabled={err !== undefined || inputValue === '' || loading}
                        onClick={() => {
                            onOpenChange(false);
                            withdrawMutation.mutate(
                                parseEther(inputValue)
                            );
                        }}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
