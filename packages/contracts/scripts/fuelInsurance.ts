import { network } from 'hardhat';
import {parseEther, isAddress} from "viem";

const {viem }= await  network.connect()
const ac = await  viem.getWalletClients();
const client = await viem.getPublicClient();
const fueler = ac[0];
const etherAmount = process.env.FUEL_ETHER_AMOUNT 
const insuranceContract = process.env.INSURANCE_CONTRACT_ADDRESS;
if (!etherAmount) {
    throw new Error("Please set FUEL_ETHER_AMOUNT in your environment variables.");
}
if (!insuranceContract || !isAddress(insuranceContract)) {
    throw new Error("Please set INSURANCE_CONTRACT_ADDRESS in your environment variables.");
}
const amount = parseEther(etherAmount);
console.log("Fund using wallet:", fueler.account.address);
// confirm in cli
console.log(`Funding ${insuranceContract} with ${etherAmount} ETH: (y/N)?`);
process.stdin.setEncoding('utf-8');

for await (const chunk of process.stdin) {
    const input = chunk.trim().toLowerCase();
    if (input === 'y' || input === 'yes') {
        break;
    } 
    console.log('Aborting.');
    process.exit(0);
}
const txHash = await fueler.sendTransaction({
    to: insuranceContract,
    value: amount,
})
console.log('Transaction sent with hash:', txHash);
const txReceipt = await client.waitForTransactionReceipt({ hash: txHash });
console.log(`Funded ${insuranceContract} with ${etherAmount} ETH. Transaction hash: ${txReceipt.transactionHash}`);