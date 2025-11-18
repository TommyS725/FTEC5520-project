import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ownedInsuranceTokenQueryOptions } from "@/action/insuranceToken";
import { useAppKitAccount } from "@reown/appkit/react";
import { InsuranceTokenCard } from "@/components/InsuranceTokenCard"

import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty"
import { FolderXIcon } from "lucide-react";



export const Route = createFileRoute("/")({
	component: App,
});


function App() {
	const { address } = useAppKitAccount();
	const tokens = useQuery({
		...ownedInsuranceTokenQueryOptions(address ?? ''),
		select: (data) => {
			data.insuranceTokens.sort((a, b) => Number(b.id) - Number(a.id));
			return {
				insuranceTokens: data.insuranceTokens
			}
		},
	})
	return (
		<div className="p-16">
			{
				!tokens.data || tokens.data.insuranceTokens.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<FolderXIcon className="size-16 text-muted-foreground" />
							</EmptyMedia>
							<EmptyTitle>No Insurance Tokens Owned</EmptyTitle>
							<EmptyDescription>No insurance tokens found in your account.</EmptyDescription>
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
								to={"/marketplace"}
								className="underline"
							>
								Trade at P2P Marketplace
							</Link>
						</EmptyContent>
					</Empty>
				) : <div className="flex flex-wrap gap-6">
					{tokens.data.insuranceTokens.map((token) => <InsuranceTokenCard key={token.id} token={token} />)}
				</div>
			}
		</div>
	);

}

