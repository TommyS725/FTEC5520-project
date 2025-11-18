import { createFileRoute } from '@tanstack/react-router'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useMetadata } from '@/providers/metadata'
import { explorerLink } from '@/lib/utils';
import { FlightDelay, FlightInsurance } from '@/lib/contracts';

export const Route = createFileRoute('/metadata')({
    component: RouteComponent,
})

//show the token contract, owner ...

function RouteComponent() {
    const { flightDelayAdmin, flightInsuranceAdmin } = useMetadata();
    return (
        <div className="py-16 px-48 grid justify-items-center">
            <Card className="w-full p-16 shadow-xl ">
                <CardHeader>
                    <CardTitle
                        className='text-3xl font-extrabold'
                    >
                        Flight Insurance Contract

                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription
                        className='mb-4'
                    >
                        <p>
                            This decentralized insurance application leverages smart contracts to provide transparent and automated flight insurance services.
                        </p>
                        <p>
                            Each insurance policy is represented by a unique insurance token, which can be bought, sold, and claimed through the platform.
                        </p>
                    </CardDescription>
                    <p className="font-extrabold text-2xl">
                        Contract Owner
                    </p>
                    <p className="mb-6 mt-4">
                        {
                            flightInsuranceAdmin ?
                                <a
                                    href={explorerLink(flightInsuranceAdmin, "address")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600"
                                >
                                    {flightInsuranceAdmin}
                                </a>
                                : "..."
                        }
                    </p>
                    <p className="font-extrabold text-2xl">
                        Contract Address
                    </p>

                    <p className="mb-6 mt-4">
                        <a
                            href={explorerLink(FlightInsurance.address, "address")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600"
                        >
                            {FlightInsurance.address}
                        </a>
                    </p>
                </CardContent>
            </Card>
            <Card className="w-full p-16 mt-10 shadow-xl">
                <CardHeader>
                    <CardTitle
                        className='text-3xl font-extrabold'
                    >
                        Flight Delay Consumer Contract

                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription
                        className='mb-4'
                    >
                        <p>
                            This contract interacts with an external oracle to fetch real-time flight delay data, enabling automated claims processing for insured flights.
                        </p>
                    </CardDescription>
                    <p className="font-extrabold text-2xl">
                        Contract Owner
                    </p>
                    <p className="mb-6 mt-4">
                        {
                            flightDelayAdmin ?
                                <a
                                    href={explorerLink(flightDelayAdmin, "address")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600"
                                >
                                    {flightDelayAdmin}
                                </a>
                                : "..."
                        }
                    </p>
                    <p className="font-extrabold text-2xl">
                        Contract Address
                    </p>

                    <p className="mb-6 mt-4">
                        <a
                            href={explorerLink(FlightDelay.address, "address")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600"
                        >
                            {FlightDelay.address}
                        </a>
                    </p>
                </CardContent>
            </Card>
            <Card className="w-full p-16 mt-10 shadow-xl">
                <CardHeader>
                    <CardTitle
                        className='text-3xl font-extrabold'
                    >
                        Other

                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-extrabold text-2xl">
                        Mock Flight Data Provider API Docs & Playground
                    </p>
                    <p className="mb-6 mt-4">
                        <a
                            href={import.meta.env.VITE_MOCK_DATA_PROVIDER_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600"
                        >
                            {import.meta.env.VITE_MOCK_DATA_PROVIDER_URL}
                        </a>
                    </p>
                    <p className="font-extrabold text-2xl">
                        GitHub Repository
                    </p>
                    <p className="mb-6 mt-4">
                        <a
                            href={import.meta.env.VITE_GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600"
                        >
                            {import.meta.env.VITE_GITHUB_URL}
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
