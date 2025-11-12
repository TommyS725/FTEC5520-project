import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const arrivalModule = buildModule("FlightArrival", (m) => {
    const router = m.getParameter("router");
    const donID = m.getParameter("donID");
    const flightArrival = m.contract("FlightArrival",[router, donID]);

    return {  flightArrival};
});

const insuranceModule = buildModule("FlightInsurance", (m) => {
    const flightArrival = m.useModule(arrivalModule).flightArrival;
    const subscriptionID = m.getParameter("subscriptionID");
    const flightInsurance = m.contract("FlightInsurance",[flightArrival, subscriptionID]);
    return {  flightInsurance};
});

export default  buildModule("Flight", (m) => {
    const flightArrival = m.useModule(arrivalModule).flightArrival;
    const flightInsurance = m.useModule(insuranceModule).flightInsurance;
    m.call(flightArrival, "setCaller", [flightInsurance,true]);
    return { flightArrival, flightInsurance };
});