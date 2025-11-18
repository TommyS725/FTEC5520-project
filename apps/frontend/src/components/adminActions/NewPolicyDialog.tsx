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
import { useNewPolicyMutation } from "@/action/policy";
import { useReducer } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { parseEther } from "viem";

interface InputState {
    flightNumber: string;
    flightDate: string;
    delayThreshold: string;
    expirationTs: Date;
    payout: string;
    inventory: string;
    price: string;
    open: boolean;
}

type InputAction =
    | { type: "SET_FLIGHT_NUMBER"; payload: string }
    | { type: "SET_FLIGHT_DATE"; payload: string }
    | { type: "SET_DELAY_THRESHOLD"; payload: string }
    | { type: "SET_EXPIRATION_TS"; payload: Date }
    | { type: "SET_PAYOUT"; payload: string }
    | { type: "SET_INVENTORY"; payload: string }
    | { type: "SET_PRICE"; payload: string }
    | { type: "SET_OPEN"; payload: boolean };

const initialInputState: InputState = {
    flightNumber: "",
    flightDate: "",
    delayThreshold: "",
    expirationTs:
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 30),// default to 30 days from now
    payout: "",
    inventory: '',
    price: '',
    open: true,
};

const inputReducer = (state: InputState, action: InputAction): InputState => {
    switch (action.type) {
        case "SET_FLIGHT_NUMBER":
            return { ...state, flightNumber: action.payload };
        case "SET_FLIGHT_DATE":
            return { ...state, flightDate: action.payload };
        case "SET_DELAY_THRESHOLD":
            return { ...state, delayThreshold: action.payload };
        case "SET_EXPIRATION_TS":
            return { ...state, expirationTs: action.payload };
        case "SET_PAYOUT":
            return { ...state, payout: action.payload };
        case "SET_INVENTORY":
            return { ...state, inventory: action.payload };
        case "SET_PRICE":
            return { ...state, price: action.payload };
        case "SET_OPEN":
            return { ...state, open: action.payload };
        default:
            return state;
    }
};

interface NewPolicyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function NewPolicyDialog({ open: dialogOpen, onOpenChange }: NewPolicyDialogProps) {
    const [state, dispatch] = useReducer(inputReducer, initialInputState);
    const {
        flightNumber,
        flightDate,
        delayThreshold,
        expirationTs,
        payout,
        inventory,
        price,
        open
    } = state
    const createPolicyMutation = useNewPolicyMutation();
    const fnError = flightNumber ? "" : "Flight number is required";
    const fdError = flightDate ? "" : "Flight date is required";
    const dtError = delayThreshold && Number(delayThreshold) > 0 ? "" : "Delay threshold must be a number greater than 0";
    const etGtNowError = expirationTs > new Date() ? "" : "Expiration date must be in the future";
    const etGtFdError = flightDate === '' || (new Date(flightDate) < expirationTs) ? "" : "Expiration date must be after flight date";
    const etError = etGtNowError || etGtFdError;
    const poError = payout && Number(payout) > 0 ? "" : "Payout must be a number greater than 0";
    const inError = inventory && Number(inventory) > 0 ? "" : "Inventory must be a number greater than 0";
    const prError = price && Number(price) > 0 ? "" : "Price must be a number greater than 0";
    const hasError = fnError || fdError || dtError || etError || poError || inError || prError;
    const reset = () => {
        dispatch({ type: "SET_FLIGHT_NUMBER", payload: "" });
        dispatch({ type: "SET_FLIGHT_DATE", payload: "" });
        dispatch({ type: "SET_DELAY_THRESHOLD", payload: "" });
        dispatch({ type: "SET_EXPIRATION_TS", payload: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 30) });
        dispatch({ type: "SET_PAYOUT", payload: "" });
        dispatch({ type: "SET_INVENTORY", payload: "" });
        dispatch({ type: "SET_PRICE", payload: "" });
        dispatch({ type: "SET_OPEN", payload: true });
    }
    return (<Dialog
        open={dialogOpen}
        onOpenChange={onOpenChange}
    >
        <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
                <DialogTitle>
                    Create New Policy
                </DialogTitle>
                <DialogDescription>
                    Fill in the details below to create a new flight insurance policy.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 grid-cols-2">
                <div className="grid gap-3">
                    <Label htmlFor="flightNumber">Flight Number</Label>
                    <Input
                        id="flightNumber"
                        name="flightNumber"
                        value={state.flightNumber}
                        placeholder="AA123"
                        onChange={(e) =>
                            dispatch({ type: "SET_FLIGHT_NUMBER", payload: e.target.value })
                        }
                    />
                    {fnError && flightNumber !== '' && <p className="text-sm text-red-600">{fnError}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="flightDate">Flight Date (YYYY-MM-DD)</Label>
                    <Input
                        id="flightDate"
                        name="flightDate"
                        value={state.flightDate}
                        placeholder="2023-12-31"
                        onChange={(e) =>
                            dispatch({ type: "SET_FLIGHT_DATE", payload: e.target.value })
                        }
                    />
                    {fdError && flightDate !== '' && <p className="text-sm text-red-600">{fdError}</p>}
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="payout">Payout (ETH)</Label>
                    <Input
                        id="payout"
                        name="payout"
                        type="number"
                        value={state.payout}
                        placeholder="0.5"
                        onChange={(e) =>
                            dispatch({ type: "SET_PAYOUT", payload: e.target.value })
                        }
                    />
                    {poError && payout !== '' && <p className="text-sm text-red-600">{poError}</p>}
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="price">Price (ETH)</Label>
                    <Input
                        id="price"
                        name="price"
                        type="number"
                        value={state.price}
                        placeholder="0.05"
                        onChange={(e) =>
                            dispatch({ type: "SET_PRICE", payload: e.target.value })
                        }
                    />
                    {prError && price !== '' && <p className="text-sm text-red-600">{prError}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="delayThreshold">Delay Threshold (minutes)</Label>
                    <Input
                        id="delayThreshold"
                        name="delayThreshold"
                        type="number"
                        value={state.delayThreshold}
                        placeholder="30"
                        onChange={(e) =>
                            dispatch({ type: "SET_DELAY_THRESHOLD", payload: e.target.value })
                        }
                    />
                    {dtError && delayThreshold !== '' && <p className="text-sm text-red-600">{dtError}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="inventory">Inventory (number of tokens)</Label>
                    <Input
                        id="inventory"
                        name="inventory"
                        type="number"
                        value={state.inventory}
                        placeholder="100"
                        onChange={(e) =>
                            dispatch({ type: "SET_INVENTORY", payload: e.target.value })
                        }
                    />
                    {inError && inventory !== '' && <p className="text-sm text-red-600">{inError}</p>}
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="expirationTs">Expiration Date</Label>
                    <Input
                        id="expirationTs"
                        name="expirationTs"
                        type="date"
                        value={state.expirationTs.toISOString().split('T')[0]}
                        onChange={(e) =>
                            dispatch({ type: "SET_EXPIRATION_TS", payload: new Date(e.target.value) })
                        }
                    />
                    {etError && expirationTs.toString() !== '' && <p className="text-sm text-red-600">{etError}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="activated">
                        Open for Purchase
                    </Label>
                    <RadioGroup
                        value={open ? "true" : "false"} onValueChange={(value) => {
                            dispatch({ type: "SET_OPEN", payload: value === "true" });
                        }}
                        className="flex  gap-2"
                    >
                        <div className="flex items-center space-x-2"
                        >
                            <RadioGroupItem value={"true"}
                                id={"activated-true"}
                            />
                            <Label
                                htmlFor={"activated-true"}
                            >
                                Yes
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2"
                        >
                            <RadioGroupItem value={"false"}
                                id={"activated-false"}
                            />
                            <Label
                                htmlFor={"activated-false"}
                            >
                                No
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                    disabled={!!hasError || createPolicyMutation.isPending}
                    onClick={async (e) => {
                        e.preventDefault();
                        onOpenChange(false);
                        await createPolicyMutation.mutateAsync({
                            flightNumber,
                            flightDate,
                            delayThreshold: BigInt(delayThreshold),
                            expirationTs: BigInt(Math.floor(expirationTs.getTime() / 1000)),
                            payout: parseEther(payout),
                            inventory: Number(inventory),
                            price: parseEther(price),
                            open,
                        });
                        reset();
                    }}
                >Confirm</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>)
}