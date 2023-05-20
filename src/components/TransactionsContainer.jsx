import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { BsFillArrowUpRightSquareFill } from "react-icons/bs"
import { ethers } from "ethers"

const TransactionsWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 20px;

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
        font-size: 0.95rem;
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
        margin-top: 0.7em;
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

const TransactionsContainer = ({
    transactions,
    setTransaction,
    hideTransaction,
}) => {
    const hasPendingTransactions = (transaction) => transaction.executed

    return (
        <TransactionsWrapper id="transactions-wrapper">
            {transactions &&
                transactions.map(
                    (
                        {
                            id,
                            to,
                            amount,
                            data,
                            executed,
                            sender,
                            hash,
                            description,
                        },
                        i
                    ) => (
                        <div
                            key={i}
                            className="transaction-card"
                            onClick={() => {
                                setTransaction({
                                    index: id,
                                    to,
                                    amount: ethers.utils.formatEther(amount),
                                    data,
                                    executed: String(executed),
                                    sender,
                                    hash,
                                    description,
                                })
                                toggleTransactionModal()
                            }}
                        >
                            <BsFillArrowUpRightSquareFill className="arrow-icon" />
                            <button
                                className="hide-transaction-button"
                                onClick={async (event) =>
                                    await hideTransaction(event, sender, id)
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
                                <p className="transaction-id">Tx #{id}</p>
                                <p className="transaction-sender">
                                    Proposer:{" "}
                                    <span className="value">
                                        {sender.slice(0, 5) +
                                            "..." +
                                            sender.slice(
                                                sender.length - 4
                                            )}{" "}
                                    </span>
                                </p>
                                <p className="transaction-description">
                                    Description:{" "}
                                    <span className="value">
                                        {description
                                            ? description
                                            : "Transaction description not avaliable"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )
                )}

            {(transactions !== "undefined" || transactions !== "null") &&
                transactions.every(hasPendingTransactions) && (
                    <div className="transaction-card">
                        <p>No pending transactions</p>
                    </div>
                )}
        </TransactionsWrapper>
    )
}

export default TransactionsContainer
