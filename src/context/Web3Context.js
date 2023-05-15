import { createContext } from "react"
import { useMoralis } from "react-moralis"
import { walletContractAddresses, walletAbi } from "@/constants"
import { ethers } from "ethers"

const Web3Context = createContext()

const Web3ContextProvider = ({ children }) => {
    const {
        enableWeb3,
        isWeb3EnableLoading,
        isWeb3Enabled,
        Moralis,
        deactivateWeb3,
        account,
        chainId: chainIdHex,
    } = useMoralis()

    const chainId = parseInt(chainIdHex)

    const network = chainId === 31337 ? "localhost" : "sepolia"

    const contractAddress =
        chainId in walletContractAddresses
            ? walletContractAddresses[chainId][0]
            : ""

    const provider = new ethers.providers.JsonRpcProvider(
        chainId === 31337
            ? process.env.NEXT_PUBLIC_RPC_URL_HARDHAT
            : process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA
    )

    const wallet = new ethers.Wallet(
        chainId === 31337
            ? process.env.NEXT_PUBLIC_PRIVATE_KEY_HARDHAT
            : process.env.NEXT_PUBLIC_PRIVATE_KEY_SEPOLIA,
        provider
    )

    const multiSigWallet = new ethers.Contract(
        contractAddress,
        walletAbi,
        wallet
    )

    return (
        <Web3Context.Provider
            value={{
                enableWeb3,
                isWeb3EnableLoading,
                isWeb3Enabled,
                Moralis,
                deactivateWeb3,
                account,
                chainId,
                chainIdHex,
                network,
                contractAddress,
                provider,
                wallet,
                multiSigWallet,
            }}
        >
            {children}
        </Web3Context.Provider>
    )
}

export { Web3Context, Web3ContextProvider }
