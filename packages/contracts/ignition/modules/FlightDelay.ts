import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const delayModule = buildModule("FlightDelay", (m) => {
    const router = m.getParameter("router");
    const donID = m.getParameter("donID");
    const flightDelay = m.contract("FlightDelay",[router, donID]);
    return {  flightDelay};
});

export default delayModule;