import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LOCATION_MAPPINGS } from '@/lib/constants'
import { Button } from '@/components/ui/button'

interface SearchParams {
    redirectTo: string
}


export const Route = createFileRoute('/connect')({
    validateSearch: (searchParams: Record<string, unknown>): SearchParams => {
        if (typeof searchParams.redirectTo !== 'string' ||
            !Object.keys(LOCATION_MAPPINGS).includes(searchParams.redirectTo)) {
            return {
                redirectTo: '/',
            }
        }
        return {
            redirectTo: searchParams.redirectTo || '/',
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { redirectTo } = Route.useSearch();
    const { open } = useAppKit();
    const { isConnected } = useAppKitAccount();
    if (isConnected) {
        return <Navigate to={redirectTo} replace />;
    }

    return <div>
        < AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Connect Your Wallet to Continue
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="flex flex-col gap-4 mt-4">
                            <p>
                                To access the Flight Insurance DApp, please connect your cryptocurrency wallet.
                            </p>
                        </div>

                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button
                        onClick={() => {
                            open();
                        }}
                        size={'lg'}
                    >
                        Connect to Web3
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
}
