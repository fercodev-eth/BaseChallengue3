import { useEffect, useState } from "react";
import { createClient, sendTransaction, waitForBatchConfirmation } from "../utils/paymentService";
import { connectWallet, disconnectWallet, switchToBaseSepolia } from "../utils/walletService";
import { checkPaymasterService } from "../utils/walletProvider";

const ClaimReward = () => {
    const [provider, setProvider] = useState(null);
    const [sdk, setSdk] = useState(null);
    const [status, setStatus] = useState('idle');
    const [batchId, setBatchId] = useState('');
    const [batchStatus, setBatchStatus] = useState(null);
    const [error, setError] = useState(null);
    const [walletConnected, setWalletConnected] = useState(false);
    const [userAddress, setUserAddress] = useState('');

    // Prefer prop `getContractAddress`, fallback to env var
    const contractAddress = import.meta.env.VITE_REWARDS_CONTRACT_ADDRESS;
    const paymasterUrl = import.meta.env.VITE_PAYMASTER_SERVICE_URL;

    const handleConnectWallet = async () => {
        try {
            setStatus('connecting_wallet');
            setError(null);

            const result = await connectWallet();

            if(!result || !result.address){
                throw new Error("No address returned from wallet connection.");
            }

            const {address, provider: walletProvider, sdk: accountSdk} = result;
            setProvider(walletProvider);
            setSdk(accountSdk);
            setUserAddress(address);
            await switchToBaseSepolia(walletProvider);
            setWalletConnected(true);
            setStatus('wallet_connected');
        } catch (error) {
            setError(`Error connecting wallet: ${error}`);
            setStatus('error');
        }
    }

    const handleDisconnectWallet = async () => {
        await disconnectWallet();
        setWalletConnected(false);
        setUserAddress('');
        setProvider(null);
        setSdk(null);
        setBatchId('');
        setBatchStatus(null);
        setStatus('idle');
    }

    const claimReward = async () => {
        try {
            if(!contractAddress || !paymasterUrl){
                throw new Error("Contract address or paymaster URL is missing.");
            }

            if(!walletConnected || !userAddress){
                throw new Error("Wallet is not connected.");
            }
            
            setStatus(`claiming`);
            setError(null);
            setBatchId('');
            setBatchStatus(null);
            const isPaymasterConfigured = await checkPaymasterService(paymasterUrl, provider);

            if (!isPaymasterConfigured) {
                throw new Error("Paymaster service not configured properly.");
            }
            const result = await sendTransaction(provider, userAddress, contractAddress, paymasterUrl);

            setBatchId(result);
            setStatus('claimed');

            if (result) {
                setStatus('confirming');
                const finalStatus = await waitForBatchConfirmation(provider, result);
                setBatchStatus(finalStatus);
                setStatus('confirmed');
            }
        } catch (error) {
            setError(`Error claiming reward: ${error.message}`);
            setStatus('error');
        }
    }

    return(
        <div className="claim-reward-container">
            <h2>Claim Reward</h2>
            <p className="subtitle">Gasless transactions powered by Coinbase Paymaster</p>
            <div className="buttons">
                {!walletConnected ? (
                    <button 
                    onClick={handleConnectWallet} 
                    disabled={status === `connecting_wallet`}
                    className="connect-button coinbase-button">
                        {status === `connecting_wallet` ? `Connecting...` : `Connect Wallet`}
                    </button>
                ) : (
                    <div className="wallet-info">
                        <span>
                            Connected to Base Account: {userAddress.substring(0,6)}...{userAddress.substring(userAddress.length - 4)}
                        </span>
                        <div className="action-buttons">
                            <button
                            onClick={claimReward}
                            disabled = {status === 'claiming' || status === 'confirming'}
                            className="claim-button">
                                {status === 'claiming' ? 'Claiming...' :
                                status === 'confirming' ? 'Processing...' : 'Claim Reward (Gasless)'}
                            </button>
                            <button
                            onClick={handleDisconnectWallet}
                            className="disconnect-button">
                                Disconnect
                            </button>

                        </div>

                    </div>
                )}

            </div>
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            {batchId && batchStatus && (
                <div className="transaction-info">
                    <h3>Transactio Status</h3>
                    <p><strong>Status</strong> {
                        batchStatus === `CONFIRMED` 
                        ? `Success 🎉 Reward Claimed!` 
                        : batchStatus === `PENDING`
                        ? `Pending... ⏳`
                        : `Failed ❌`
                    }
                    </p>
                    {batchStatus.receipts && batchStatus.receipts.length > 0 && (
                        <>
                            <p>
                                <strong>Transaction Hash:</strong>{" "}
                                <span style={{ fontSize: '0.85em', wordBreak: 'break-all' }}>
                                    {batchStatus.receipts[0].transactionHash}
                                </span>
                            </p>
                            {batchStatus.receipts[0].blockNumber && (
                                <p><strong>Block:</strong> {batchStatus.receipts[0].blockNumber}</p>
                            )}
                        </>
                    )}
                    
                </div>
            )}
        </div>
    )
}

export default ClaimReward