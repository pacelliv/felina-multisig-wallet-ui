import { useWeb3Contract } from "react-moralis"
import { walletAbi } from "@/constants"
import { useContext, useState, useEffect } from "react"
import { Web3Context } from "../context/Web3Context"
import { Context } from "@/context/Context"
import { ethers } from "ethers"
import { MdOutlineContentCopy } from "react-icons/md"
import { AiOutlineCheck } from "react-icons/ai"
import { FaAddressCard, FaEthereum } from "react-icons/fa"
import { TbPigMoney } from "react-icons/tb"
import styled from "styled-components"

const Div = styled.div`
    display: flex;
    gap: 15px;
    padding: 0.5em 0;
    margin-top: 1.5em;

    .data-container {
        display: flex;
        align-items: center;
        gap: 7px;
        font-weight: 500;
        padding: 0.5em 1em;
        color: #4d4d4d;
        background-color: #ffead0;
        border-radius: 5px;
    }

    .button-container {
        position: relative;
    }

    .pop-up-text {
        position: absolute;
        top: -40px;
        left: -30px;
        text-decoration: none;
        color: #ffead0;
        background-color: #161616;
        padding: 0.5em;
        font-size: 0.8rem;
        font-weight: 500;
        border-radius: 5px;
        letter-spacing: 0.2px;
        visibility: hidden;
    }

    .pop-up-text.show {
        opacity: 0;
        visibility: visible;
        -webkit-animation: fadeinout 1.5s;
        animation: fadeinout 1.5s;
    }

    @-webkit-keyframes fadeinout {
        50% {
            opacity: 1;
        }
    }

    @keyframes fadeinout {
        50% {
            opacity: 1;
        }
    }

    .copy-button {
        background-color: transparent;
        border: none;
    }

    .icon {
        font-size: 16px;
    }

    @media (max-width: 450px) {
        flex-direction: column;
        gap: 7px;
    }
`

const Status = () => {
    const { isWeb3Enabled, contractAddress, providerC, multiSigWalletC } =
        useContext(Web3Context)
    const { windowWidth } = useContext(Context)
    const [walletBalance, setWalletBalance] = useState(0)
    const [copy, setCopy] = useState(false)
    const [ethPrice, setEthPrice] = useState(0)

    const { runContractFunction: balance } = useWeb3Contract({
        abi: walletAbi,
        contractAddress,
        functionName: "balance",
        params: {},
    })

    const updateStatusUI = async () => {
        try {
            const walletBalanceFromContractCall = (await balance()).toString()
            setWalletBalance(walletBalanceFromContractCall)

            const res = await fetch(
                "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
                { mode: "cors" }
            )

            const ethData = await res.json()
            setEthPrice(ethData.market_data.current_price.usd)

            await checkDepositsEvents()
        } catch (error) {
            console.log(error)
        }
    }

    const toggleClass = () => {
        document.getElementById("pop-up-text").classList.add("show")
        setTimeout(() => {
            document.getElementById("pop-up-text").classList.remove("show")
        }, 1500)
    }

    const checkDepositsEvents = async () => {
        const startBlockNumber = await providerC.getBlockNumber()

        multiSigWalletC.on("Deposit", async (...args) => {
            const event = args[args.length - 1]
            if (event.blockNumber <= startBlockNumber) return

            await updateStatusUI()
        })

        multiSigWalletC.on("Execute", async (...args) => {
            const event = args[args.length - 1]
            if (event.blockNumber <= startBlockNumber) return

            await updateStatusUI()
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            const fetchEthBalance = async () => {
                await updateStatusUI()
            }
            fetchEthBalance().catch((error) => console.log(error))
        }
    }, [isWeb3Enabled])

    return (
        <Div copy={copy}>
            <div className="data-container">
                <FaAddressCard className="icon" />
                <p>
                    {windowWidth > 580 || windowWidth < 450 ? "Wallet:" : ""}{" "}
                    {contractAddress.slice(0, 6)}...
                    {contractAddress.slice(contractAddress.length - 4)}
                </p>
                <div className="button-container">
                    <span id="pop-up-text" className="pop-up-text">
                        Copied!
                    </span>
                    <button
                        className="copy-button"
                        onClick={() => {
                            toggleClass()
                            navigator.clipboard.writeText(contractAddress)
                            setCopy(true)
                            setTimeout(() => setCopy(false), 1500)
                        }}
                    >
                        {copy ? (
                            <AiOutlineCheck className="icon" />
                        ) : (
                            <MdOutlineContentCopy className="icon" />
                        )}
                    </button>
                </div>
            </div>
            <div className="data-container">
                <FaEthereum className="icon" />
                <p>
                    {windowWidth > 580 || windowWidth < 450 ? "Balance:" : ""}{" "}
                    {walletBalance &&
                        parseInt(
                            ethers.utils.formatEther(walletBalance)
                        ).toLocaleString("en")}{" "}
                    ETH
                </p>
            </div>
            <div className="data-container">
                <TbPigMoney className="icon" />
                <p>
                    ${" "}
                    {walletBalance &&
                        ethPrice &&
                        (
                            parseInt(ethers.utils.formatEther(walletBalance)) *
                            ethPrice
                        ).toLocaleString("en")}
                </p>
            </div>
        </Div>
    )
}

export default Status
