

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FilePlusIcon, FuelIcon, Code2Icon, BanknoteArrowDown } from "lucide-react";
import { FuelContractDialog } from "./FuelContractDialog"
import NewPolicyDialog from "./NewPolicyDialog"
import { WithdrawDialog } from "./WithdrawDialog";
import type { DialogState } from "@/lib/types";

interface AdminActionsDropdownProps {
    dialogState: DialogState
    setDialogState: (state: DialogState) => void
}

export default function AdminActionsDropdown({
    dialogState, setDialogState
}: AdminActionsDropdownProps) {

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="text-lg p-6 font-semibold"
                        variant={'secondary'}
                    >
                        <Code2Icon className="mr-2 size-6" />
                        Actions
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                    <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="text-md font-medium" onSelect={() => setDialogState("new-policy")}>
                            <FilePlusIcon className="mr-2 size-4" />
                            New Policy
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-md font-medium" onSelect={() => setDialogState("fuel")}>
                            <FuelIcon className="mr-2 size-4" />
                            Fuel Contract
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-md font-medium" onSelect={() => setDialogState("withdraw")}>
                            <BanknoteArrowDown className="mr-2 size-4" />
                            Withdraw Funds
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <NewPolicyDialog
                open={dialogState === "new-policy"}
                onOpenChange={(open) => {
                    if (!open) {
                        setDialogState(null);
                        return
                    }
                    setDialogState("new-policy");
                }}
            />
            <FuelContractDialog
                open={dialogState === "fuel"}
                onOpenChange={(open) => {
                    if (!open) {
                        setDialogState(null);
                        return
                    }
                    setDialogState("fuel");
                }}
            />
            <WithdrawDialog
                open={dialogState === "withdraw"}
                onOpenChange={(open) => {
                    if (!open) {
                        setDialogState(null);
                        return
                    }
                    setDialogState("withdraw");
                }}
            />
        </>
    )
}
