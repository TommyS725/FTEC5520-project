import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import delayModule from "./FlightDelay.js";

const insuranceModule = buildModule("FlightInsurance", (m) => {
	const flightDelay = m.useModule(delayModule).flightDelay;
	const subscriptionID = m.getParameter("subscriptionID");
	const flightInsurance = m.contract("FlightInsurance", [
		flightDelay,
		subscriptionID,
	]);
	m.call(flightDelay, "setCaller", [flightInsurance, true]);
	return { flightInsurance };
});

export default insuranceModule;
