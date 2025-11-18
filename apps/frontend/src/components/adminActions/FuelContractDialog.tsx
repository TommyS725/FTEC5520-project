import { useFuelContractMutation } from "@/action/admin";
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
import { useState } from "react";
import { parseEther } from "viem";

interface FuelContractDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FuelContractDialog({
    open, onOpenChange,
}: FuelContractDialogProps) {
    const fuelInsuranceContractMutation = useFuelContractMutation();
    const [inputValue, setInputValue] = useState('');
    const err = Number.isNaN(Number(inputValue)) || Number(inputValue) <= 0;
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Fuel Insurance Contract
                    </DialogTitle>
                    <DialogDescription>
                        Enter amount of ETH to send to the insurance contract to fund it.
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
                        {err && inputValue && <p className="text-sm text-red-600">Please enter a valid positive number.</p>}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        disabled={err || inputValue === '' || fuelInsuranceContractMutation.isPending}
                        onClick={() => {
                            onOpenChange(false);
                            fuelInsuranceContractMutation.mutate(
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
