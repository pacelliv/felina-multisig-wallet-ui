import Meta from "@/components/Meta"
import EncodeModal from "@/components/EncodeModal"
import CreateTransactionModal from "@/components/CreateTransactionModal"
import TransactionModal from "@/components/TransactionModal"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react"
import { Context } from "@/context/Context"
import { Web3Context } from "@/context/Web3Context"
import { ethers } from "ethers"
import { FaTimes } from "react-icons/fa"
import { BsFillArrowUpRightSquareFill } from "react-icons/bs"
import { transactionsDetails, nftsDetails } from "../database"
import { updateTransactionDetail, deleteNftDetail } from "@/utils/api"
import { nftAbi } from "@/constants"
import { useWeb3Contract } from "react-moralis"

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
    .transactions-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 20px;
    }

    .transaction-card {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0.4em 0;
        border-radius: 10px;
        padding: 1.2em 1em 1.2em 0.9em;
        background-color: #ffead0;
        color: #4d4d4d;
        cursor: pointer;
        transition: all 0.4s ease;
        position: relative;
    }

    .arrow-icon {
        position: absolute;
        top: 10px;
        left: 15px;
    }

    .hide-transaction-button {
        position: absolute;
        top: 8px;
        right: 10px;
        border: none;
        padding: 0.15em 0.2em;
        font-size: 1rem;
        background-color: transparent;
    }

    .hide-transaction-button-icon {
        pointer-events: none;
    }

    .transaction-card:hover {
        background-color: #ffe0b9;
    }

    .transaction-icon {
        height: 60px;
        width: 60px;
        border-radius: 50%;
        background-color: #f7f7f7;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.4s ease;
        margin-top: 1.2em;
    }

    .transaction-icon-text {
        text-decoration: none;
        color: black;
        font-family: "Permanent Marker", sans-serif;
        font-size: 1.3rem;
        width: 60px;
        text-align: center;
    }

    .transaction {
        width: calc(100% - 60px);
        margin-top: 1.1em;
    }

    .transaction-id {
        font-size: 0.91rem;
        font-weight: 500;
        position: absolute;
        top: 10px;
        right: 41px;
    }

    .transaction-sender,
    .transaction-description {
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
        .transaction-card {
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

    .orange {
        background-color: #e17654;
    }

    .orange:hover:not([disabled]) {
        background-color: #904832;
    }

    .green {
        background-color: #115e59;
    }

    .green:hover:not([disabled]) {
        background-color: #0f3b38;
    }
`

const Home = () => {
    const {
        openModal,
        toggleModal,
        openCreateTransactionModal,
        toggleCreateTransactionModal,
    } = useContext(Context)
    const {
        isWeb3Enabled,
        account,
        provider,
        multiSigWallet,
        contractAddress,
    } = useContext(Web3Context)
    const { runContractFunction } = useWeb3Contract()
    const [openTransactionModal, setOpenTransactionModal] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [transaction, setTransaction] = useState({
        index: "",
        to: "",
        amount: "",
        data: "",
        executed: "",
        sender: "",
        hash: "",
        description: "",
    })

    const hasPendingTransactions = (transaction) => transaction.executed

    const toggleTransactionModal = () =>
        setOpenTransactionModal(!openTransactionModal)

    const hideTransaction = async (e, sender, txId) => {
        e.stopPropagation()
        if (sender.toLowerCase() === account) {
            await updateTransactionDetail(txId)
        }
    }

    const getNftOwner = async (nftAddress, tokenId) => {
        const ownerOfOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "ownerOf",
            params: { tokenId },
        }

        try {
            const ownerOf = await runContractFunction({
                params: ownerOfOptions,
            })

            return ownerOf
        } catch (error) {
            console.log(error)
        }
    }

    const checkEvents = async () => {
        const latestBlockNumber = await provider.getBlockNumber()

        multiSigWallet.on("Execute", async (...args) => {
            const event = args[args.length - 1]
            if (event.blockNumber <= latestBlockNumber) return // old event, ignore it

            // rest of code for latest block

            const txId = event.args[1].toNumber()
            const to = event.args[2]
            const data = event.args[3]

            await updateTransactionDetail(txId)

            const index = nftsDetails.nftsDetails.findIndex(
                (nftDetail) => nftDetail.nftAddress === to
            )

            if (index != -1) {
                const iface = new ethers.utils.Interface(nftAbi)
                const decodedData = iface.parseTransaction({ data })
                const nftOwner = await getNftOwner(
                    to,
                    decodedData.args.tokenId.toString()
                )

                if (nftOwner != contractAddress) {
                    await deleteNftDetail(
                        to,
                        decodedData.args.tokenId.toString()
                    )
                }
            }
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            setTransactions(transactionsDetails.transactionsDetails)

            const setUpUi = async () => {
                await checkEvents()
            }

            setUpUi().catch((error) => console.log(error))
        }
    }, [isWeb3Enabled])

    return (
        <Container>
            <Meta title={"Multisig Wallet | Transactions"} />
            {openModal && (
                <EncodeModal openModal={openModal} toggleModal={toggleModal} />
            )}
            {openCreateTransactionModal && (
                <CreateTransactionModal
                    openCreateTransactionModal={openCreateTransactionModal}
                    toggleCreateTransactionModal={toggleCreateTransactionModal}
                />
            )}
            {openTransactionModal && (
                <TransactionModal
                    index={transaction.index}
                    to={transaction.to}
                    amount={transaction.amount}
                    data={transaction.data}
                    executed={transaction.executed}
                    sender={transaction.sender}
                    hash={transaction.hash}
                    description={transaction.description}
                    toggleTransactionModal={toggleTransactionModal}
                />
            )}
            <div
                className={
                    openModal ||
                    openCreateTransactionModal ||
                    openTransactionModal
                        ? "modal-backdrop"
                        : ""
                }
            ></div>
            <Div>
                <Title>Pending transactions:</Title>
                <ButtonsContainer>
                    <button
                        onClick={toggleCreateTransactionModal}
                        className="button orange"
                        disabled={openModal}
                    >
                        Create transaction
                    </button>
                    <button
                        onClick={toggleModal}
                        className="button green"
                        disabled={openModal}
                    >
                        Encode data
                    </button>
                </ButtonsContainer>
                <div className="transactions-wrapper" id="transactions-wrapper">
                    {transactions.length > 0 &&
                        transactions
                            .filter((transaction) => !transaction.executed)
                            .map((transaction, i) => (
                                <div
                                    key={i}
                                    className="transaction-card"
                                    onClick={() => {
                                        setTransaction({
                                            index: transaction.id,
                                            to: transaction.to,
                                            amount: ethers.utils.formatEther(
                                                transaction.amount
                                            ),
                                            data: transaction.data,
                                            executed: String(
                                                transaction.executed
                                            ),
                                            sender: transaction.sender,
                                            hash: transaction.hash,
                                            description:
                                                transaction.description,
                                        })
                                        toggleTransactionModal()
                                    }}
                                >
                                    <BsFillArrowUpRightSquareFill className="arrow-icon" />
                                    <button
                                        className="hide-transaction-button"
                                        onClick={async (event) =>
                                            await hideTransaction(
                                                event,
                                                transaction.sender,
                                                transaction.id
                                            )
                                        }
                                    >
                                        <FaTimes className="hide-transaction-button-icon" />
                                    </button>

                                    <div className="transaction-icon">
                                        <span className="transaction-icon-text">
                                            Tx
                                        </span>
                                    </div>
                                    <div className="transaction">
                                        <p className="transaction-id">
                                            Tx #{transaction.id}
                                        </p>
                                        <p className="transaction-sender">
                                            Proposer:{" "}
                                            <span className="value">
                                                {transaction.sender.slice(
                                                    0,
                                                    5
                                                ) +
                                                    "..." +
                                                    transaction.sender.slice(
                                                        transaction.sender
                                                            .length - 4
                                                    )}{" "}
                                            </span>
                                        </p>
                                        <p className="transaction-description">
                                            Description:{" "}
                                            <span className="value">
                                                {transaction.description}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}

                    {transactionsDetails.transactionsDetails.every(
                        hasPendingTransactions
                    ) && (
                        <div className="transaction-card">
                            <p>No pending transactions</p>
                        </div>
                    )}
                </div>
            </Div>
        </Container>
    )
}

export default Home
