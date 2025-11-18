import { listedInsuranceTokenQueryOptions } from '@/action/insuranceToken';
import { InsuranceTokenCard } from '@/components/InsuranceTokenCard';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { FolderXIcon } from 'lucide-react';

export const Route = createFileRoute('/marketplace')({
    component: RouteComponent,
})

function RouteComponent() {
    const tokenQuery = useQuery({
        ...listedInsuranceTokenQueryOptions(),
        select: (data) => {
            data.insuranceTokens.sort((a, b) => Number(b.id) - Number(a.id));
            return {
                insuranceTokens: data.insuranceTokens
            }
        }
    });
    return (
        <div className="p-16">
            {
                !tokenQuery.data || tokenQuery.data.insuranceTokens.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FolderXIcon className="size-16 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyTitle>No Insurance Tokens Listed</EmptyTitle>
                            <EmptyDescription>No insurance tokens found in the marketplace.</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent
                        >
                            <Link
                                to="/purchase"
                                className="underline"
                            >
                                Purchase Insurance Token from Issuer
                            </Link>
                            <Link
                                to={"/"}
                                className="underline"
                            >
                                List your Insurance Tokens for Sale
                            </Link>
                        </EmptyContent>
                    </Empty>
                ) : <div className="flex flex-wrap gap-6">
                    {tokenQuery.data.insuranceTokens.map((token) => <InsuranceTokenCard key={token.id} token={token} showOwner />)}
                </div>
            }
        </div>
    )
}
