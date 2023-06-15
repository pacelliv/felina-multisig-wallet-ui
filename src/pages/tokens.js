import Meta from "@/components/Meta"
import DepositErc20Modal from "@/components/DepositErc20Modal"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react"
import { Web3Context } from "@/context/Web3Context"
import { tokensDetails } from "../database"
import TokensContainer from "@/components/TokensContainer"

const Container = styled.div`
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(0.1rem);
        z-index: 20;
    }
`

const Title = styled.h1`
    margin-top: 1.2em;
    font-size: 1.8rem;
    color: white;
`

const ButtonsContainer = styled.div`
    margin: 0.8em 0;
    display: flex;
    flex-direction: row;
    gap: 15px;

    .button {
        padding: 0.6em 1em;
        border-radius: 7px;
        border: none;
        font-size: 1rem;
        font-weight: 500;
        color: white;
        transition: 200ms all cubic-bezier(0.4, 0, 0.2, 1);
        letter-spacing: 0.2px;
    }

    .button:disabled {
        cursor: default;
    }

    .blue {
        background-color: #0066ff;
    }

    .blue:hover:not([disabled]) {
        background-color: #0850bb;
    }
`

const Tokens = ({ marketData }) => {
    const { network, isWeb3Enabled, multiSigWalletB, providerB } =
        useContext(Web3Context)
    const [openDepositErc20Modal, setOpenDepositErc20Modal] = useState(false)
    const [tokens, setTokens] = useState([])
    const [tokensBalances, setTokensBalances] = useState([])
    const [loading, setLoading] = useState(false)

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
        //if (isWeb3Enabled) {
        const updateUi = async () => {
            await updatePage()
            await checkEvents()
        }
        updateUi().catch((error) => console.log(error))
        //}
    }, [isWeb3Enabled])

    return (
        <Container>
            <Meta title={"Multisig Wallet | ERC20 Balances"} />
            {openDepositErc20Modal && (
                <DepositErc20Modal
                    openDepositErc20Modal={openDepositErc20Modal}
                    setOpenDepositErc20Modal={setOpenDepositErc20Modal}
                />
            )}
            <div
                className={openDepositErc20Modal ? "modal-backdrop" : ""}
            ></div>
            <div>
                <Title>ERC-20 balances:</Title>
                <ButtonsContainer>
                    <button
                        onClick={() =>
                            setOpenDepositErc20Modal(!openDepositErc20Modal)
                        }
                        className="button blue"
                        disabled={openDepositErc20Modal}
                    >
                        Deposit token
                    </button>
                </ButtonsContainer>
                <TokensContainer
                    marketData={marketData}
                    tokens={tokens}
                    tokensBalances={tokensBalances}
                    loading={loading}
                    network={network}
                />
            </div>
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
