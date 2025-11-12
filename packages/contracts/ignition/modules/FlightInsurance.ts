import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FlightInsurance", (m) => {
    const flightArrival = m.getParameter("flightArrival");
    const subscriptionID = m.getParameter("subscriptionID");
    const flightInsurance = m.contract("FlightInsurance",[flightArrival, subscriptionID]);
    return {  flightInsurance};
});