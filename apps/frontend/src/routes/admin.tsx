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
import { policyQueryOptions } from '@/action/policy';
import { PolicyCard } from '@/components/PolicyCard';
import { useMetadata } from '@/providers/metadata';
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useReducer, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { FilterIcon } from "lucide-react";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { insuranceContractBalanceQueryOptions, requiredReserveQueryOption } from "@/action/admin";
import { formatEther } from "viem";
import { useConfig, usePublicClient } from "wagmi";
import AdminActionsDropdown from "@/components/adminActions";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { FolderXIcon } from "lucide-react";
import type { DialogState } from "@/lib/types";


export const Route = createFileRoute('/admin')({
    component: RouteComponent,
})
type FilterType = "all" | "true" | "false";
interface FilterState {
    activated: FilterType;
    dataFilter: FilterType;
    settled: FilterType;
    expired: FilterType;
    inStock: FilterType;
}

type FilterAction =
    | { type: "SET_ACTIVATED"; payload: FilterType }
    | { type: "SET_DATA"; payload: FilterType }
    | { type: "SET_SETTLED"; payload: FilterType }
    | { type: "SET_EXPIRED"; payload: FilterType }
    | { type: "SET_INSTOCK"; payload: FilterType };

const initialState: FilterState = {
    activated: "all",
    dataFilter: "all",
    settled: "all",
    expired: "all",
    inStock: "all",
};

const FILTER_MAPPING: {
    [key in keyof FilterState]: {
        action: FilterAction['type'];
        label: string;
        trueValue: string;
        falseValue: string;
    }
} = {
    activated: {
        action: "SET_ACTIVATED",
        label: "Activated Status",
        trueValue: "Activated",
        falseValue: "Deactivated",
    },
    settled: {
        action: "SET_SETTLED",
        label: "Flight Settled Status",
        trueValue: "Settled",
        falseValue: "Not Settled",
    },
    dataFilter: {
        action: "SET_DATA",
        label: "Flight Delay Data Available",
        trueValue: "Has Delay Data",
        falseValue: "No Delay Data",
    },

    expired: {
        action: "SET_EXPIRED",
        label: "Policy Expiration Status",
        trueValue: "Expired",
        falseValue: "Not Expired",
    },
    inStock: {
        action: "SET_INSTOCK",
        label: "Policy Inventory Status",
        trueValue: "In Stock",
        falseValue: "Out of Stock",
    },
}

function filterReducer(state: FilterState, action: FilterAction): FilterState {
    switch (action.type) {
        case "SET_ACTIVATED":
            return { ...state, activated: action.payload };
        case "SET_DATA":
            return { ...state, dataFilter: action.payload };
        case "SET_SETTLED":
            return { ...state, settled: action.payload };
        case "SET_EXPIRED":
            return { ...state, expired: action.payload };
        case "SET_INSTOCK":
            return { ...state, inStock: action.payload };
        default:
            return state;
    }
}
function RouteComponent() {
    const [dialogState, setDialogState] = useState<DialogState>(null);
    const [filterState, dispatch] = useReducer(filterReducer, initialState);
    const { isInsuranceAdmin } = useMetadata();
    const config = useConfig();
    const publicClient = usePublicClient();
    const contractBalanceQuery = useQuery({
        ...insuranceContractBalanceQueryOptions(publicClient),
    });
    const requiredReserveQuery = useQuery(requiredReserveQueryOption(config));
    const {
        activated: _activated,
        dataFilter: _dataFilter,
        settled: _settled,
        expired: _expired,
        inStock: _inStock
    } = filterState;
    const activated = _activated === "all" ? "all" : _activated === "true";
    const settled = _settled === "all" ? "all" : _settled === "true";
    const dataFilter = settled || _dataFilter === "all" ? "all" : _dataFilter === "true";
    const expired = _expired === "all" ? "all" : _expired === "true";
    const inStock = _inStock === "all" ? "all" : _inStock === "true";
    const policyQuery = useQuery({
        ...policyQueryOptions(),
        enabled: isInsuranceAdmin,
        select: (data) => {
            const fil = data.policies.filter((policy) => {
                if (activated !== "all" && policy.open !== activated) {
                    return false;
                }
                if (dataFilter !== "all" && !!policy.flight.delay !== dataFilter) {
                    return false;
                }
                if (settled !== "all" && policy.flight.settled !== settled) {
                    return false;
                }
                if (expired !== "all" && (Number(policy.expiration) * 1000 < Date.now()) !== expired) {
                    return false;
                }
                if (inStock !== "all" && (Number(policy.inventory) > 0) !== inStock) {
                    return false;
                }
                return true;
            });
            fil.sort((a, b) => Number(b.id) - Number(a.id));
            return {
                policies: fil
            };
        }

    });
    if (!isInsuranceAdmin) {
        return <Navigate to="/" replace />
    }

    const resetFilter = () => {
        dispatch({ type: "SET_ACTIVATED", payload: "all" });
        dispatch({ type: "SET_DATA", payload: "all" });
        dispatch({ type: "SET_SETTLED", payload: "all" });
        dispatch({ type: "SET_EXPIRED", payload: "all" });
        dispatch({ type: "SET_INSTOCK", payload: "all" });
    }
    const remainReserve = contractBalanceQuery.isSuccess && requiredReserveQuery.isSuccess ?
        contractBalanceQuery.data - requiredReserveQuery.data : null;
    return (
        <div className="px-16">
            <div className="my-8 flex justify-between gap-6">
                <div className="space-x-4" >
                    {contractBalanceQuery.isSuccess && <Badge
                        className="text-sm font-semibold" variant={'default'}
                    >
                        Contract Balance: {formatEther(BigInt(contractBalanceQuery.data))} ETH
                    </Badge>}
                    {
                        requiredReserveQuery.isSuccess && <Badge className="text-sm font-semibold" variant={'secondary'}>
                            Required Reserve: {formatEther(BigInt(requiredReserveQuery.data))} ETH
                        </Badge>
                    }
                    {remainReserve !== null && <Badge className="text-sm font-semibold" variant={'outline'}>
                        Remaining Reserve: {formatEther(BigInt(remainReserve))} ETH
                    </Badge>}
                </div>
                <div
                    className="flex items-center gap-6"
                >

                    <AdminActionsDropdown
                        dialogState={dialogState}
                        setDialogState={setDialogState}
                    />
                    <PolicyFilters
                        filterState={filterState}
                        dispatch={dispatch}
                        resetFilter={resetFilter}
                        dialogState={dialogState}
                        setDialogState={setDialogState}
                    />
                </div>
            </div>
            {
                !policyQuery.data || policyQuery.data.policies.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FolderXIcon className="size-16 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyTitle>No Insurance Policy Records Found</EmptyTitle>
                            <EmptyDescription>No insurance policy records match the current filters.</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent
                        >
                            <Button
                                variant={"link"}
                                onClick={() => {
                                    setDialogState("filter");
                                }}
                            >
                                Edit Policy Filters
                            </Button>
                            <Button
                                variant={"link"}
                                onClick={() => {
                                    setDialogState("new-policy");
                                }}
                            >
                                Create New Policy
                            </Button>
                        </EmptyContent>
                    </Empty>
                ) : <div className="flex flex-wrap gap-6">
                    {policyQuery.data.policies.map((policy) => (
                        <PolicyCard key={policy.id} policy={policy} isAdmin />
                    ))}
                </div>
            }
        </div>
    )
}

function PolicyFilters({
    filterState,
    dispatch,
    resetFilter,
    dialogState,
    setDialogState
}: {
    filterState: FilterState;
    dispatch: React.Dispatch<FilterAction>;
    resetFilter: () => void;
    dialogState: DialogState
    setDialogState: (state: DialogState) => void
}) {

    return <Dialog
        open={dialogState === "filter"}
        onOpenChange={(open) => {
            if (!open) {
                setDialogState(null);
                return
            }
            setDialogState("filter");
        }}
    >
        <DialogTrigger asChild>
            <Button
                className="text-lg p-6 font-semibold"
                variant="outline"
            >
                <FilterIcon className="mr-2 size-6" />
                Edit Filters
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    Edit Policy Filters
                </DialogTitle>
                <DialogDescription asChild>
                    <div className="space-y-4 mt-4">
                        {
                            Object.entries(FILTER_MAPPING).map(([fkey, { action, label, trueValue, falseValue }]) =>
                                <div
                                    key={fkey}
                                >
                                    <p className="font-medium"> {label}</p>
                                    <RadioGroup value={
                                        fkey === 'dataFilter' && filterState.settled !== 'false' ? "true" : filterState[fkey as keyof typeof FILTER_MAPPING]
                                    } onValueChange={(value) => {
                                        dispatch({ type: action, payload: value as FilterType });
                                    }}
                                        disabled={fkey === 'dataFilter' && filterState.settled !== 'false'}
                                        className="flex  gap-2"
                                    >
                                        {
                                            ["all", "true", "false"].map((value) => (
                                                <div className="flex items-center space-x-2"
                                                    key={`${fkey}-${value}`}
                                                >
                                                    <RadioGroupItem value={value}
                                                        id={`${fkey}-${value}`}
                                                    />
                                                    <Label
                                                        htmlFor={`${fkey}-${value}`}
                                                    >
                                                        {value === "all" ? "All" : value === "true" ? trueValue : falseValue}
                                                    </Label>
                                                </div>
                                            ))
                                        }
                                    </RadioGroup>
                                </div>
                            )
                        }
                    </div>
                </DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <Button
                    variant={'secondary'}
                    onClick={(e) => {
                        e.preventDefault();
                        resetFilter();
                    }}
                >
                    Reset Filters
                </Button>
                <DialogClose asChild>
                    <Button variant="outline">CLose</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}