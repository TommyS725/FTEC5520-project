import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { explorerLink } from "@/lib/utils";
import { useTransactionTrack } from "@/providers/txTrack"


export default function TransactionDialog() {
    const { dialogOpen, setDialogOpen, txHash } = useTransactionTrack();
    const url = explorerLink(txHash, "transaction");
    return (<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle> Transaction Submitted</DialogTitle>
                <DialogDescription asChild>
                    <div>
                        <p>You can view the details on the explorer:</p>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={txHash}
                            className="break-all text-blue-500 underline"

                        >
                            {txHash}
                        </a>

                    </div>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>);
}