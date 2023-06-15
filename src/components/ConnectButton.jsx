import styled from "styled-components"
import { Web3Context } from "../context/Web3Context"
import { useContext, useEffect } from "react"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { FaWallet } from "react-icons/fa"

const Button = styled.button`
    padding: 0.8em 1.4em;
    font-family: inherit;
    background-color: #6610f2;
    font-weight: 500;
    border: none;
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 0.95rem;
    color: white;
    border-radius: 16px;

    &:hover:not([disabled]) {
        transform: scale(1.04);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    @media (max-width: 870px) {
        padding: 0.8em 1.1em;
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
        windowWidth,
    } = useContext(Web3Context)

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
        <Button
            onClick={connectWallet}
            disabled={isWeb3EnableLoading}
            windowWidth={windowWidth}
        >
            {isWeb3Enabled ? (
                <Jazzicon
                    diameter={20}
                    seed={jsNumberForAddress(account)}
                    className="connect-button-icon"
                />
            ) : (
                <FaWallet className="connect-button-icon" />
            )}
            {isWeb3Enabled
                ? `${account.slice(0, 5)}...${account.slice(
                      account.length - 4
                  )}`
                : `${windowWidth < 580 ? "Connect" : "Connect Wallet"}`}
        </Button>
    )
}

export default ConnectButton
