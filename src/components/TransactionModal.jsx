import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { useState, useContext, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { walletAbi } from "../constants"
import { Web3Context } from "@/context/Web3Context"

const Container = styled.div`
    position: fixed;
    max-width: 530px;
    padding: 1.5em;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    margin: auto;
    box-shadow: 0px 0px 5px 2px #d0d0d0;
    border-radius: 10px;
    background-color: #f1faee;
    height: 578px;
    overflow-y: auto;

    span {
        font-weight: 500;
        text-decoration: none;
    }

    &::-webkit-scrollbar {
        width: 7px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${({ enterMouse }) => enterMouse && "#d1d1d1"};
        border-radius: 10px;
    }

    .close-modal-icon {
        font-size: 2.5rem;
        cursor: pointer;
        padding: 0.2em;
        margin: 0 0 0 auto;
        display: block;
    }

    .close-modal-icon:hover {
        opacity: 0.7;
    }

    .modal-title {
        margin: 0 0 0.8em 0;
        font-size: 1.75rem;
        text-decoration: underline;
    }

    .modal-subtitle {
        margin: 0 0 0.3em 0;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .modal-details-container {
        border-radius: 10px;
        padding: 1em;
        background-color: white;
        color: #3d3d3d;
    }

    .modal-detail {
        line-height: 1.4;
        margin-bottom: 1em;
        word-wrap: break-word;
    }

    .modal-detail:last-child {
        margin-bottom: 0;
    }

    .code {
        font-size: 1rem;
    }

    .buttons-container {
        margin: 0.8em 0 0;
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

        .blue {
            background-color: #457b9d;
        }

        .blue:hover:not([disabled]) {
            background-color: #005f73;
        }

        .green {
            background-color: #115e59;
        }

        .green:hover:not([disabled]) {
            background-color: #0f3b38;
        }

        .red {
            background-color: #d54b4b;
        }

        .red:hover:not([disabled]) {
            background-color: #ba2e2e;
        }
    }

    @media (max-width: 550px) {
        margin: auto 0.8em;
    }

    @media (max-width: 492px) {
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 7px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: ${({ enterMouse }) => enterMouse && "#d1d1d1"};
            border-radius: 10px;
        }
    }
`

const TransactionModal = ({
    index,
    to,
    amount,
    data,
    executed,
    sender,
    hash,
    description,
    toggleTransactionModal,
}) => {
    const { contractAddress } = useContext(Web3Context)
    const [enterMouse, setEnterMouse] = useState(false)
    const [approvalCount, setApprovalCount] = useState("")

    const { runContractFunction: getApprovalCount } = useWeb3Contract({
        abi: walletAbi,
        contractAddress,
        functionName: "getApprovalCount",
        params: {
            _txId: index,
        },
    })

    const {
        runContractFunction: approve,
        isLoading: approveLoading,
        isFetching: approveFetching,
    } = useWeb3Contract({
        abi: walletAbi,
        contractAddress,
        functionName: "approve",
        params: {
            _txId: index,
        },
    })

    const {
        runContractFunction: revoke,
        isLoading: revokeLoading,
        isFetching: revokeFetching,
    } = useWeb3Contract({
        abi: walletAbi,
        contractAddress,
        functionName: "revoke",
        params: {
            _txId: index,
        },
    })

    const {
        runContractFunction: execute,
        isLoading: executeLoading,
        isFetching: executeFetching,
    } = useWeb3Contract({
        abi: walletAbi,
        contractAddress,
        functionName: "execute",
        params: {
            _txId: index,
        },
    })

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            await updateUI()
        } catch (error) {
            console.log(error)
        }
    }

    const handleClick = async (e) => {
        if (e.target.id === "approve-button") {
            await approve({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
            })
        } else if (e.target.id === "revoke-button") {
            await revoke({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
            })
        } else {
            await execute({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
            })
        }
    }

    const updateUI = async () => {
        let approvalCountFromContractCall
        try {
            approvalCountFromContractCall = (
                await getApprovalCount()
            ).toString()
        } catch (error) {
            console.log(error)
        } finally {
            setApprovalCount(approvalCountFromContractCall)
        }
    }

    useEffect(() => {
        updateUI()
    }, [])

    return (
        <Container
            onMouseOver={() => setEnterMouse(true)}
            onMouseLeave={() => setEnterMouse(false)}
            enterMouse={enterMouse}
        >
            <FaTimes
                className="close-modal-icon"
                onClick={toggleTransactionModal}
            />
            <h1 className="modal-title">Transaction #{index}</h1>
            <h3 className="modal-subtitle">Transaction details:</h3>
            <div className="modal-details-container">
                <p className="modal-detail">
                    <span>Type:</span>{" "}
                    <code className="code">
                        {data === "0x"
                            ? "Simple ETH transfer"
                            : "Contract call"}
                    </code>{" "}
                </p>
                <p className="modal-detail">
                    <span>To:</span> <code className="code">{to}</code>
                </p>
                <p className="modal-detail">
                    <span>Amount:</span>{" "}
                    <code className="code">{amount} ETH</code>{" "}
                </p>
                <p className="modal-detail">
                    <span>Data:</span> <code className="code">{data} </code>
                </p>
                <p className="modal-detail">
                    <span>Executed:</span>{" "}
                    <code className="code">{executed}</code>
                </p>
                <p className="modal-detail">
                    <span>Sender:</span> <code className="code">{sender}</code>
                </p>
                <p className="modal-detail">
                    <span>Hash:</span> <code className="code">{hash}</code>
                </p>
                <p className="modal-detail">
                    <span>Description:</span>{" "}
                    <code className="code">{description}</code>
                </p>
                <p className="modal-detail">
                    <span>Approval count:</span>{" "}
                    <code className="code">{approvalCount}/2</code>
                </p>
            </div>
            <div className="buttons-container">
                <button
                    id="approve-button"
                    onClick={(event) => handleClick(event)}
                    className="button blue"
                    disabled={
                        approvalCount === "2" ||
                        approveLoading ||
                        approveFetching
                    }
                >
                    Approve
                </button>
                <button
                    id="revoke-button"
                    onClick={(event) => handleClick(event)}
                    className="button red"
                    disabled={
                        approvalCount === "0" || revokeLoading || revokeFetching
                    }
                >
                    Revoke
                </button>
                <button
                    id="execute-button"
                    onClick={(event) => handleClick(event)}
                    className="button green"
                    disabled={
                        approvalCount != "2" ||
                        executeLoading ||
                        executeFetching
                    }
                >
                    Execute
                </button>
            </div>
        </Container>
    )
}

export default TransactionModal
