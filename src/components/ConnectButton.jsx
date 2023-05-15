import styled from "styled-components"
import { Web3Context } from "../context/Web3Context"
import { Context } from "@/context/Context"
import { useContext, useEffect } from "react"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { FaWallet } from "react-icons/fa"

const Button = styled.button`
    padding: 0.6em 1em;
    font-family: inherit;
    background-color: white;
    font-weight: 600;
    border: 1px #bbbbbb solid;
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 1rem;
    border-radius: 10px;
    transition: all 0.4s ease;

    &:hover:not([disabled]) {
        background-color: #f3f3f3;
    }

    @media (max-width: 500px) {
        font-size: 0.8rem;
    }
`

const ConnectButton = () => {
    const {
        enableWeb3,
        isWeb3Enabled,
        isWeb3EnableLoading,
        account,
        Moralis,
        deactivateWeb3,
    } = useContext(Web3Context)

    const { windowWith } = useContext(Context)

    const connectWallet = async () => {
        const wallet = await enableWeb3()
        if (typeof wallet !== "undefined") {
            if (typeof window !== "undefined") {
                window.localStorage.setItem("connected", "injected")
            }
        }
    }

    useEffect(() => {
        if (
            !isWeb3Enabled &&
            typeof window !== "undefined" &&
            window.localStorage.getItem("connected")
        ) {
            enableWeb3()
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            if (account === null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
            }
        })
    }, [])

    return (
        <Button onClick={connectWallet} disabled={isWeb3EnableLoading}>
            {isWeb3Enabled ? (
                <Jazzicon diameter={20} seed={jsNumberForAddress(account)} />
            ) : (
                <FaWallet />
            )}
            {isWeb3Enabled
                ? `${account.slice(0, 5)}...${account.slice(
                      account.length - 4
                  )}`
                : `${windowWith < 580 ? "Connect" : "Connect Wallet"}`}
        </Button>
    )
}

export default ConnectButton
