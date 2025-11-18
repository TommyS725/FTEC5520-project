import { openPolicyQueryOptions } from '@/action/policy';
import { PolicyCard } from '@/components/PolicyCard';
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { FolderXIcon } from "lucide-react";
import { useConfig, usePublicClient } from 'wagmi';
import { insuranceContractBalanceQueryOptions, requiredReserveQueryOption } from '@/action/admin';
import { Badge } from '@/components/ui/badge';
import { formatEther } from 'viem';

export const Route = createFileRoute('/purchase')({
    component: RouteComponent,
})

function RouteComponent() {
    const config = useConfig();
    const publicClient = usePublicClient();
    const contractBalanceQuery = useQuery({
        ...insuranceContractBalanceQueryOptions(publicClient),
    });
    const requiredReserveQuery = useQuery(requiredReserveQueryOption(config));
    const policyQuery = useQuery({
        ...openPolicyQueryOptions(),
        select: (data) => {
            data.policies.sort((a, b) => Number(b.id) - Number(a.id));
            return {
                policies: data.policies
            }
        }
    });
    const remainReserve = contractBalanceQuery.isSuccess && requiredReserveQuery.isSuccess ?
        contractBalanceQuery.data - requiredReserveQuery.data : null;
    return (
        <div className="px-16">
            <div className="space-x-4 my-8" >
                {remainReserve !== null && <Badge className="text-sm font-semibold" variant={'default'}>
                    Available Reserve: {formatEther(BigInt(remainReserve))} ETH
                </Badge>}
            </div>
            {
                !policyQuery.data || policyQuery.data.policies.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FolderXIcon className="size-16 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyTitle>No Insurance Policies for Sale</EmptyTitle>
                            <EmptyDescription>No available insurance policies found for purchase.</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent
                        >
                            <Link
                                to={"/marketplace"}
                                className="underline"
                            >
                                Trade Insurance Tokens at P2P Marketplace
                            </Link>
                        </EmptyContent>
                    </Empty>
                ) : <div className="flex flex-wrap gap-6">
                    {policyQuery.data.policies.map((policy) => (
                        <PolicyCard key={policy.id} policy={policy} availableReserve={remainReserve ?? undefined} />
                    ))}
                </div>
            }
        </div>
    )
}
