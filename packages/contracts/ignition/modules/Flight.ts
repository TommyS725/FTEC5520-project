import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const delayModule = buildModule("FlightDelay", (m) => {
	const router = m.getParameter("router");
	const donID = m.getParameter("donID");
	const flightDelay = m.contract("FlightDelay", [router, donID]);

	return { flightDelay };
});

const insuranceModule = buildModule("FlightInsurance", (m) => {
	const flightDelay = m.useModule(delayModule).flightDelay;
	const subscriptionID = m.getParameter("subscriptionID");
	const flightInsurance = m.contract("FlightInsurance", [
		flightDelay,
		subscriptionID,
	]);
	return { flightInsurance };
});

export default buildModule("Flight", (m) => {
	const flightDelay = m.useModule(delayModule).flightDelay;
	const flightInsurance = m.useModule(insuranceModule).flightInsurance;
	m.call(flightDelay, "setCaller", [flightInsurance, true]);
	return { flightDelay, flightInsurance };
});
