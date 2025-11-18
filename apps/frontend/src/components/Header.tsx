import { AppKitAccountButton } from "@reown/appkit/react";
import { Link } from "@tanstack/react-router";
import { Menu, } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { useLocation, } from '@tanstack/react-router';
import { getLocationItem, LOCATION_MAPPINGS } from "@/lib/constants";
import { useMetadata } from "@/providers/metadata";




export default function Header() {
	const location = useLocation();
	const locationItem = getLocationItem(location.pathname);
	return (
		<>
			<header className="p-4 flex items-center shadow-lg  justify-between">
				<div className="flex gap-6">
					<Nav />
					<p className="text-lg font-semibold flex items-center gap-2">
						Flight Insurance DApp - {locationItem.navTitle}
					</p>

				</div>
				<div className="flex gap-4">
					<AppKitAccountButton />
					<ThemeToggle />
				</div>
			</header>
		</>
	);
}

function Nav() {
	const [isOpen, setIsOpen] = useState(false);
	const {
		isInsuranceAdmin
	} = useMetadata();
	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button variant="outline"
					className="p-2 hover:bg-gray-700 rounded-lg transition-colors dark:text-white"
					aria-label="Open menu"
				>
					<Menu size={24} />
				</Button>
			</SheetTrigger>
			<SheetContent side="left">
				<SheetHeader>
					<SheetTitle
						className="text-3xl font-bold mb-4"
					>
					</SheetTitle>
					<SheetDescription asChild>
						<nav className=" p-4 overflow-y-auto">
							{
								Object.entries(LOCATION_MAPPINGS)
									.filter(([_, item]) => {
										if (item.requiresAdmin) {
											return isInsuranceAdmin;
										}
										return true;

									})
									.map(([path, item]) => {
										return (
											<Link
												to={path}
												key={path}
												onClick={() => setIsOpen(false)}
												className="flex items-center  gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors mb-2"
												activeProps={{
													className:
														"flex items-center gap-3 p-3 rounded-lg  hover:underline transition-colors mb-2",
												}}
											>
												{item.navIcon}
												<span className="text-2xl font-medium">{item.navTitle}</span>
											</Link>
										)
									})
							}
						</nav>
					</SheetDescription>
				</SheetHeader>
				{/* <SheetFooter>
				</SheetFooter> */}
			</SheetContent>
		</Sheet>
	)
}

