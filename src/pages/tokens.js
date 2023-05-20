import Meta from "@/components/Meta"
import DepositErc20Modal from "@/components/DepositErc20Modal"
import SelectTokenModal from "@/components/SelectTokenModal"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react"
import { Context } from "@/context/Context"
import { Web3Context } from "@/context/Web3Context"
import { ethers } from "ethers"
import { tokensDetails } from "../database"
import { AiOutlineCheck } from "react-icons/ai"
import { MdOutlineContentCopy } from "react-icons/md"

const Container = styled.div`
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 20;
    }
`

const Div = styled.div`
    .tokens-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 20px;
    }

    .token-card {
        display: flex;
        align-items: center;
        gap: 15px;
        margin: 0.4em 0;
        border-radius: 10px;
        padding: 1.2em 1em 1.2em 1em;
        background-color: #ffead0;
        color: #4d4d4d;
        transition: all 0.4s ease;
    }

    .token-card:hover {
        background-color: #ffe0b9;
    }

    .token-icon {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background-color: #f7f7f7;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.4s ease;
    }

    .token {
        width: calc(100% - 35px);
    }

    .token-address-container {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: -0.28em;
    }

    .copy-button {
        background-color: transparent;
        border: none;
        padding: 0.3em 0.2em 0;
    }

    .icon {
        font-size: 16px;
        pointer-events: none;
    }

    .show {
        display: block;
    }

    .hidden {
        display: none;
    }

    .token-symbol,
    .token-address,
    .token-balance {
        margin-top: 0.3em;
        font-weight: 600;
        font-size: 0.95rem;
        word-wrap: break-word;
    }

    .value {
        font-weight: 500;
        text-decoration: none;
    }

    @media (max-width: 781px) {
        .token-card {
            margin: 0;
        }
    }
`

const Title = styled.h1`
    margin-top: 1.2em;
    font-size: 1.8rem;
`

const ButtonsContainer = styled.div`
    margin: 0.8em 0;
    display: flex;
    flex-direction: row;
    gap: 15px;

    .button {
        padding: 0.5em 1em;
        border-radius: 5px;
        border: none;
        font-size: 1rem;
        font-weight: 500;
        color: #ffead0;
        transition: 200ms all cubic-bezier(0.4, 0, 0.2, 1);
    }

    .button:disabled {
        cursor: default;
    }

    .red {
        background-color: #d54b4b;
    }

    .red:hover:not([disabled]) {
        background-color: #ba2e2e;
    }

    .green {
        background-color: #115e59;
    }

    .green:hover:not([disabled]) {
        background-color: #0f3b38;
    }
`

const Tokens = ({ marketData }) => {
    const { windowWidth } = useContext(Context)
    const { network, isWeb3Enabled, multiSigWalletB, providerB } =
        useContext(Web3Context)
    const [openDepositErc20Modal, setOpenDepositErc20Modal] = useState(false)
    const [openSelectTokenModal, setOpenSelectTokenModal] = useState(false)
    const [token, setToken] = useState({})
    const [tokens, setTokens] = useState([])
    const [tokensBalances, setTokensBalances] = useState([])
    const [loading, setLoading] = useState(false)

    const index = (id) => marketData.findIndex((data) => data.id === id)

    const usdConversion = (id, balance, decimals) => {
        const formattedBalance = ethers.utils.formatUnits(balance, decimals)
        const mul =
            parseInt(formattedBalance) * marketData[index(id)].current_price
        const roundedMul = (Math.round(mul * 100) / 100).toFixed(2)
        return Number(roundedMul).toLocaleString("en")
    }

    const handleClick = (e, id) => {
        if (e.target.id === id) {
            e.target.children[0].className.baseVal = "icon hidden"
            e.target.children[1].className.baseVal = "icon show"
            setTimeout(() => {
                e.target.children[0].className.baseVal = "icon show"
                e.target.children[1].className.baseVal = "icon hidden"
            }, 1000)
        }
    }

    const updatePage = async () => {
        setTokens(tokensDetails.tokensDetails)
        setLoading(true)

        let balances = []

        try {
            // reference: https://stackoverflow.com/a/49499491/19627240
            await tokensDetails.tokensDetails.reduce(
                async (promise, tokenDetail) => {
                    await promise

                    const walletTokenBalance = (
                        await multiSigWalletB.tokenBalance(
                            tokenDetail.contract_addresses[network]
                        )
                    ).toString()

                    balances.push(walletTokenBalance)
                },
                Promise.resolve()
            )
        } catch (error) {
            console.log(error)
        } finally {
            setTokensBalances(balances)
            setLoading(false)
        }
    }

    const checkEvents = async () => {
        const lastestBlockNumber = await providerB.getBlockNumber()

        multiSigWalletB.on("Erc20Deposit", async (...args) => {
            const lastEvent = args[args.length - 1]
            if (lastEvent.blockNumber <= lastestBlockNumber) return
            await updatePage()
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            const updateUi = async () => {
                await updatePage()
                await checkEvents()
            }
            updateUi().catch((error) => console.log(error))
        }
    }, [isWeb3Enabled])

    return (
        <Container>
            <Meta title={"Multisig Wallet | ERC20 Balances"} />
            {openDepositErc20Modal && (
                <DepositErc20Modal
                    openDepositErc20Modal={openDepositErc20Modal}
                    setOpenDepositErc20Modal={setOpenDepositErc20Modal}
                    token={token}
                />
            )}
            {openSelectTokenModal && (
                <SelectTokenModal
                    openSelectTokenModal={openSelectTokenModal}
                    setOpenSelectTokenModal={setOpenSelectTokenModal}
                    openDepositErc20Modal={openDepositErc20Modal}
                    setOpenDepositErc20Modal={setOpenDepositErc20Modal}
                    setToken={setToken}
                />
            )}
            <div
                className={
                    openDepositErc20Modal || openSelectTokenModal
                        ? "modal-backdrop"
                        : ""
                }
            ></div>
            <Div>
                <Title>ERC-20 balances:</Title>
                <ButtonsContainer>
                    <button
                        onClick={() =>
                            setOpenSelectTokenModal(!openSelectTokenModal)
                        }
                        className="button red"
                        disabled={openDepositErc20Modal || openSelectTokenModal}
                    >
                        Deposit token
                    </button>
                </ButtonsContainer>
                <div className="tokens-wrapper" id="tokens-wrapper">
                    {tokens.map(
                        (
                            {
                                id,
                                symbol,
                                name,
                                image,
                                contract_addresses,
                                decimal_place,
                            },
                            i
                        ) => (
                            <div key={i} className="token-card">
                                <div>
                                    <img
                                        src={`${image.small}`}
                                        className="token-icon"
                                    />
                                </div>
                                <div className="token">
                                    <p className="token-symbol">
                                        Name:{" "}
                                        <span className="value">{name}</span>
                                    </p>
                                    <div className="token-address-container">
                                        <p className="token-address">
                                            Contract address:{" "}
                                            <span className="value">
                                                {windowWidth < 985
                                                    ? contract_addresses[
                                                          network
                                                      ].slice(0, 7) +
                                                      "..." +
                                                      contract_addresses[
                                                          network
                                                      ].slice(
                                                          contract_addresses[
                                                              network
                                                          ].length - 6
                                                      )
                                                    : contract_addresses[
                                                          network
                                                      ]}{" "}
                                            </span>
                                            <button
                                                id={`${id}`}
                                                className="copy-button"
                                                onClick={(event) => {
                                                    navigator.clipboard.writeText(
                                                        contract_addresses[
                                                            network
                                                        ]
                                                    )
                                                    handleClick(event, id)
                                                }}
                                            >
                                                <MdOutlineContentCopy className="icon show" />
                                                <AiOutlineCheck className="icon hidden" />
                                            </button>
                                        </p>
                                    </div>

                                    <p className="token-balance">
                                        Balance:{" "}
                                        {loading ? (
                                            <span className="value">
                                                Loading...
                                            </span>
                                        ) : (
                                            <span className="value">
                                                {parseInt(
                                                    ethers.utils.formatUnits(
                                                        tokensBalances[i],
                                                        decimal_place
                                                    )
                                                ).toLocaleString("en")}{" "}
                                                {symbol.toUpperCase()}
                                            </span>
                                        )}
                                    </p>

                                    <p className="token-balance">
                                        USD:{" "}
                                        {loading ? (
                                            <span className="value">
                                                Loading...
                                            </span>
                                        ) : (
                                            <span className="value">
                                                ${" "}
                                                {usdConversion(
                                                    id,
                                                    tokensBalances[i],
                                                    decimal_place
                                                )}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </Div>
        </Container>
    )
}

export const getStaticProps = async () => {
    let queryString = ""

    tokensDetails.tokensDetails.forEach((tokenDetail, i) => {
        if (i != tokensDetails.length - 1) {
            queryString += `${tokenDetail.id}%2C`
        } else {
            queryString += tokenDetail.id
        }
    })

    const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${queryString}&per_page=100&page=1&sparkline=false&locale=en`
    )
    const marketData = await res.json()

    return {
        props: { marketData },
    }
}

export default Tokens
