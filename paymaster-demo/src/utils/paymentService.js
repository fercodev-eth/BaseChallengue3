import { baseSepolia } from "viem/chains";

import { createPublicClient, http, numberToHex, encodeFunctionData } from "viem";

const REWARDS_ABI = [
	{
		inputs: [],
		name: "claimReward",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	}
]

export const createClient = (rpcUrl) => {
    return createPublicClient({
        chain: baseSepolia,
        transport: http(rpcUrl),
    });
}   

export const sendTransaction = async (provider, fromAddress, contractAddress, paymasterUrl) => {
    const data = encodeFunctionData({
        abi: REWARDS_ABI,
        functionName: "claimReward",
    });

    try {
        if(!provider || !provider.request) {
            throw new Error("No provider available to send transaction.");
        }

        if(!paymasterUrl){
            throw new Error("No paymaster URL provided is required.");
        }

        const calls = [{
            to: contractAddress,
            value: `0x0`,
            data: data,
        }];

        const result = await provider.request({
            method: "wallet_sendCalls",
            params: [{
                version: "1.0.0",
                chainId: numberToHex(baseSepolia.id),
                from: fromAddress,
                calls: calls,
                capabilities:{
                    paymasterService: {
                        url: paymasterUrl
                    }
                }
            }],
        });
        return result;
    }catch (error) {
        console.log(`Error sending transaction: ${error}`);
    }
}

export const getCallStatus = async (provider, batchId) => {
    const status = await provider.request({
        method: "wallet_getCallStatus",
        params: [batchId],
    });
    return status;
}

export const waitForBatchConfirmation = async (provider, batchId, maxAttemps = 60, intervalsMs=2000) => {
    for (let attempt = 0; attempt < maxAttemps; attempt++) {
        const status = await getCallStatus(provider, batchId);

        if (status.status === "CONFIRMED") {
            return status;
        }

        if (status.status === "FAILED") {
            throw new Error(`Batch failed; ${status.error}`);
        }
        await new Promise(resolve => setTimeout(resolve, intervalsMs));

    }
    throw new Error("Batch confirmation timed out.");
}