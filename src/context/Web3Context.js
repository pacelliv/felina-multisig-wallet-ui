import { createContext, useState, useEffect } from "react"
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

    const [windowWidth, setWindowWidth] = useState(0)

    const contractAddress =
        chainId in walletContractAddresses
            ? walletContractAddresses[chainId][0]
            : ""

    const providerA = new ethers.providers.JsonRpcProvider(
        chainId === 31337
            ? process.env.NEXT_PUBLIC_RPC_URL_HARDHAT
            : process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA_A
    )

    const providerB = new ethers.providers.JsonRpcProvider(
        chainId === 31337
            ? process.env.NEXT_PUBLIC_RPC_URL_HARDHAT
            : process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA_B
    )

    const providerC = new ethers.providers.JsonRpcProvider(
        chainId === 31337
            ? process.env.NEXT_PUBLIC_RPC_URL_HARDHAT
            : process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA_C
    )

    const walletA = new ethers.Wallet(
        chainId === 31337
            ? process.env.NEXT_PUBLIC_PRIVATE_KEY_HARDHAT
            : process.env.NEXT_PUBLIC_PRIVATE_KEY_SEPOLIA,
        providerA
    )

    const walletB = new ethers.Wallet(
        chainId === 31337
            ? process.env.NEXT_PUBLIC_PRIVATE_KEY_HARDHAT
            : process.env.NEXT_PUBLIC_PRIVATE_KEY_SEPOLIA,
        providerB
    )

    const walletC = new ethers.Wallet(
        chainId === 31337
            ? process.env.NEXT_PUBLIC_PRIVATE_KEY_HARDHAT
            : process.env.NEXT_PUBLIC_PRIVATE_KEY_SEPOLIA,
        providerC
    )

    const multiSigWalletA = new ethers.Contract(
        contractAddress,
        walletAbi,
        walletA
    )

    const multiSigWalletB = new ethers.Contract(
        contractAddress,
        walletAbi,
        walletB
    )

    const multiSigWalletC = new ethers.Contract(
        contractAddress,
        walletAbi,
        walletC
    )

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth)
        }

        handleResize()
        window.addEventListener("resize", handleResize)

        return function () {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

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
                providerA,
                providerB,
                providerC,
                walletA,
                walletB,
                walletC,
                multiSigWalletA,
                multiSigWalletB,
                multiSigWalletC,
                windowWidth,
            }}
        >
            {children}
        </Web3Context.Provider>
    )
}

export { Web3Context, Web3ContextProvider }
