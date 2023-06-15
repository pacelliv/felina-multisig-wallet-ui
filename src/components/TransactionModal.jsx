import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { useState, useContext, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { walletAbi } from "../constants"
import { Web3Context } from "@/context/Web3Context"

const Container = styled.div`
    position: fixed;
    max-width: 530px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    margin: auto;
    box-shadow: 0px 0px 5px 4px #363636;
    border-radius: 10px;
    background-color: #212121;
    height: 578px;
    overflow-y: auto;
    color: rgb(210, 210, 210);

    span {
        font-weight: 500;
        text-decoration: none;
    }

    &::-webkit-scrollbar {
        width: 0px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${({ enterMouse }) => enterMouse && "#d1d1d1"};
        background-color: transparent;
        border-radius: 10px;
    }

    .modal-header {
        padding: 2em 1.5em 0;
    }

    .modal-header-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .close-modal-icon {
        font-size: 2.5rem;
        cursor: pointer;
        padding: 0.2em;
        margin: 0 0 0 auto;
        display: block;
        transform: translateX(0.2em);
    }

    .close-modal-icon:hover {
        opacity: 0.7;
    }

    .modal-title {
        text-decoration: underline;
    }

    .modal-content {
        padding: 0 2em;
    }

    .modal-subtitle {
        margin: 1.2em 0 0.3em 0;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .modal-details-container {
        border-radius: 10px;
        margin: 0 1.5em;
        padding: 1em;
        background-color: #272d36;
        color: rgb(210, 210, 210);
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

    .modal-bottom {
        background-color: #272d36;
        display: flex;
        justify-content: end;
        gap: 10px;
        margin-top: 2em;
        padding: 0.7em 1.5em;
    }

    .submit-button {
        border: none;
        font-family: inherit;
        font-size: 0.95rem;
        color: white;
        letter-spacing: 0.2px;
        border-radius: 5px;
        display: block;
        background-color: transparent;
        padding: 0.5em 1.2em;
        cursor: pointer;
        transition: 200ms all cubic-bezier(0.4, 0, 0.2, 1);
    }

    .submit-button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    .submit-button:hover {
        background-color: #3e3e3e;
    }

    @media (max-width: 550px) {
        margin: auto 0.8em;
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
    openTransactionModal,
    setOpenTransactionModal,
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
            <div className="modal-header">
                <div className="modal-header-top">
                    <h2 className="modal-title">Transaction #{index}</h2>
                    <FaTimes
                        className="close-modal-icon"
                        onClick={() =>
                            setOpenTransactionModal(!openTransactionModal)
                        }
                    />
                </div>
                <h3 className="modal-subtitle">Transaction details:</h3>
            </div>

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

            <div className="modal-bottom">
                <button
                    id="approve-button"
                    onClick={(event) => handleClick(event)}
                    className="submit-button"
                    disabled={
                        approvalCount === "2" ||
                        approveLoading ||
                        approveFetching
                    }
                    style={{ backgroundColor: "#3e3e3e" }}
                >
                    Approve
                </button>
                <button
                    id="revoke-button"
                    onClick={(event) => handleClick(event)}
                    className="submit-button"
                    disabled={
                        approvalCount === "0" || revokeLoading || revokeFetching
                    }
                    style={{ backgroundColor: "#3e3e3e" }}
                >
                    Revoke
                </button>
                <button
                    id="execute-button"
                    onClick={(event) => handleClick(event)}
                    className="submit-button"
                    disabled={
                        approvalCount != "2" ||
                        executeLoading ||
                        executeFetching
                    }
                    style={{ backgroundColor: "#1db954" }}
                >
                    Execute
                </button>
            </div>
        </Container>
    )
}

export default TransactionModal
