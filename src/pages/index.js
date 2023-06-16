import Meta from "@/components/Meta"
import EncodeModal from "@/components/EncodeModal"
import CreateTransactionModal from "@/components/CreateTransactionModal"
import TransactionModal from "@/components/TransactionModal"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react"
import { Web3Context } from "@/context/Web3Context"
import { ethers } from "ethers"
import {
    getPendingTransactions,
    updateTransactionDetail,
    deleteNftDetail,
    addTransactionDetail,
    getNfts,
} from "@/utils/api"
import { nftAbi } from "@/constants"
import TransactionsContainer from "@/components/TransactionsContainer"

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

    .transaction-card {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0.4em 0;
        border-radius: 10px;
        padding: 1.2em 1em 1.2em 0.9em;
        color: #e4e4e4;
        cursor: pointer;
        transition: all 0.4s ease;
        position: relative;
        background: linear-gradient(
            to left bottom,
            rgba(99, 99, 125, 0.7),
            rgba(99, 99, 125, 0.3)
        );
        backdrop-filter: blur(1rem);
    }

    .transaction-card:hover {
        background: linear-gradient(
            to left bottom,
            rgba(85, 85, 110, 0.7),
            rgba(85, 85, 110, 0.3)
        );
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

    .transparent {
        background-color: transparent;
        border: 1px solid #474747;
    }

    .transparent:hover:not([disabled]) {
        border: 1px solid #d3d3d3;
    }
`

const Home = () => {
    const {
        isWeb3Enabled,
        account,
        providerA,
        multiSigWalletA,
        contractAddress,
    } = useContext(Web3Context)
    const [openModal, setOpenModal] = useState(false)
    const [openCreateTransactionModal, setOpenCreateTransactionModal] =
        useState(false)
    const [loading, setLoading] = useState(false)
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

    const hideTransaction = async (e, sender, txId) => {
        e.stopPropagation()
        if (sender.toLowerCase() === account) {
            await updateTransactionDetail(txId)
            const pendingTransactions = await getPendingTransactions()
            setTransactions(pendingTransactions)
        }
    }

    const listenForEvents = async () => {
        const latestBlockNumber = await providerA.getBlockNumber()

        multiSigWalletA.on("Submit", async (...args) => {
            const event = args[args.length - 1]
            if (event.blockNumber <= latestBlockNumber) return

            await addTransactionDetail({
                sender: event.args[0],
                id: event.args[1].toString(),
                to: event.args[2],
                amount: event.args[3].toString(),
                data: event.args[4],
                executed: false,
                hash: event.transactionHash,
            })

            setLoading(true)
            const pendingTransactions = await getPendingTransactions()
            setTransactions(pendingTransactions)
            setLoading(false)
        })

        multiSigWalletA.on("Execute", async (...args) => {
            const event = args[args.length - 1]
            if (event.blockNumber <= latestBlockNumber) return // old event, ignore it

            // rest of code for latest block

            const txId = event.args[1].toString()
            const to = event.args[2]
            const data = event.args[3]

            // update `transactions` after a execution
            await updateTransactionDetail(txId)
            const pendingTransactions = await getPendingTransactions()
            setTransactions(pendingTransactions)

            // verify if we made a call to a NFT contract
            const ownedNfts = await getNfts()
            const nft = ownedNfts.find((nft) => nft.nftAddress === to)

            if (nft) {
                const iface = new ethers.utils.Interface(nftAbi)
                const { name, args } = iface.parseTransaction({ data })
                // update the owned NFT if we transferred a token
                if (
                    (name === "safeTransferFrom" || name === "transferFrom") &&
                    args[0] === contractAddress
                ) {
                    await deleteNftDetail(event.args[2], args[2].toString())
                }
            }
        })
    }

    useEffect(() => {
        //if (isWeb3Enabled) {
        setLoading(true)
        const setUpUi = async () => {
            await listenForEvents()
            return await getPendingTransactions()
        }
        setUpUi()
            .then((pendingTransactions) => {
                setTransactions(pendingTransactions)
                setLoading(false)
            })
            .catch((error) => console.log(error))
        //}
    }, [isWeb3Enabled])

    return (
        <Container>
            <Meta title={"Multisig Wallet | Transactions"} />
            {openModal && (
                <EncodeModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                />
            )}
            {openCreateTransactionModal && (
                <CreateTransactionModal
                    openCreateTransactionModal={openCreateTransactionModal}
                    setOpenCreateTransactionModal={
                        setOpenCreateTransactionModal
                    }
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
                    openTransactionModal={openTransactionModal}
                    setOpenTransactionModal={setOpenTransactionModal}
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
            <div>
                <Title>Pending transactions:</Title>
                <ButtonsContainer>
                    <button
                        onClick={() => setOpenModal(!openModal)}
                        className="button transparent"
                        disabled={openModal}
                    >
                        Encode data
                    </button>
                    <button
                        onClick={() =>
                            setOpenCreateTransactionModal(
                                !openCreateTransactionModal
                            )
                        }
                        className="button blue"
                        disabled={openModal}
                    >
                        Create transaction
                    </button>
                </ButtonsContainer>

                {transactions ? (
                    <TransactionsContainer
                        transactions={transactions}
                        setTransaction={setTransaction}
                        hideTransaction={hideTransaction}
                        openTransactionModal={openTransactionModal}
                        setOpenTransactionModal={setOpenTransactionModal}
                    />
                ) : (
                    <div className="transaction-card">
                        <p>No pending transactions</p>
                    </div>
                )}

                {loading && (
                    <div className="transaction-card">
                        <p>Loading...</p>
                    </div>
                )}
            </div>
        </Container>
    )
}

export default Home
