import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FlightArrival", (m) => {
    const router = m.getParameter("router");
    const donID = m.getParameter("donID");
    const flightArrival = m.contract("FlightArrival",[router, donID]);

    return {  flightArrival};
});