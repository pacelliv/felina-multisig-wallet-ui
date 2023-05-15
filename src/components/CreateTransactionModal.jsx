import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { useState, useContext } from "react"
import { useWeb3Contract } from "react-moralis"
import { walletAbi } from "../constants"
import { Web3Context } from "@/context/Web3Context"
import { ethers } from "ethers"
import { transactionsDetails } from "@/database"
import { addTransactionDetail } from "@/utils/api"

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
        margin: 0 0 0.6em 0;
        font-size: 1.75rem;
    }

    .modal-instructions {
        line-height: 1.5;
    }

    .code {
        background: white;
        padding: 0.2em 0.4em;
        font-weight: 600;
        border-radius: 5px;
    }

    .form {
        margin-top: 1em;
    }

    label {
        display: block;
    }

    .label {
        font-weight: 500;
    }

    .example {
        margin-top: 0.5em;
        font-size: 0.8rem;
        line-height: 1.5;
        word-wrap: break-word;
    }

    .margin-top {
        margin-top: 1em;
    }

    input[type="text"] {
        width: 100%;
        margin-top: 0.5em;
        text-indent: 6px;
        padding: 0.7em 0.5em;
        border-radius: 5px;
        border: 1px solid #b1b1b1;
        font-family: inherit;
    }

    .icon {
        color: white;
        font-size: 1.2rem;
        font-weight: 900;
    }

    textarea {
        display: block;
        border: 1px solid #b1b1b1;
        width: 100%;
        height: 100px;
        border-radius: 5px;
        padding: 0.7em 1em;
        margin-top: 0.5em;
        font-family: inherit;
        letter-spacing: 0.2px;
        line-height: 1.4;
        resize: none;
    }

    .submit-button {
        padding: 0.9em 1em;
        margin-top: 1.7em;
        width: 100%;
        border-radius: 5px;
        border: none;
        font-family: inherit;
        font-size: 1.05rem;
        font-weight: 600;
        background-color: #457b9d;
        color: #ffead0;
        letter-spacing: 0.3px;
        transition: all 0.4s ease;
    }

    .submit-button:disabled {
        cursor: default;
    }

    .submit-button:hover:not([disabled]) {
        background-color: #005f73;
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

const CreateTransactionModal = ({ toggleCreateTransactionModal }) => {
    const { contractAddress } = useContext(Web3Context)
    const [enterMouse, setEnterMouse] = useState(false)
    const [formData, setFormData] = useState({
        to: "",
        amount: "",
        data: "",
        description: "",
    })

    const {
        runContractFunction: submit,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: walletAbi,
        contractAddress,
        functionName: "submit",
        params: {
            _to: formData.to,
            _amount: formData.amount,
            _data: formData.data ? formData.data : ethers.utils.toUtf8Bytes(""),
        },
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleSuccess = async (tx) => {
        let transactionReceipt
        try {
            transactionReceipt = await tx.wait(1)
        } catch (error) {
            console.log(error)
        } finally {
            await addTransactionDetail({
                sender: transactionReceipt.from,
                id: transactionsDetails.transactionsDetails.length,
                to: formData.to,
                amount: formData.amount,
                data: formData.data ? formData.data : "0x",
                executed: false,
                hash: transactionReceipt.transactionHash,
                description: formData.description,
            })
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        await submit({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error),
        })
    }

    return (
        <Container
            onMouseOver={() => setEnterMouse(true)}
            onMouseLeave={() => setEnterMouse(false)}
            enterMouse={enterMouse}
        >
            <FaTimes
                className="close-modal-icon"
                onClick={toggleCreateTransactionModal}
            />
            <h1 className="modal-title">Propose a transaction</h1>
            <p className="modal-instructions">
                Fill the fields according to the examples and hit the submit
                button to add a new transaction to the list of pending
                transactions.
            </p>
            <p className="modal-instructions margin-top">
                Leave the data field empty if you intent on submitting a simple
                transaction to transfer ETH, otherwise insert the encoded data
                to submit a transaction to call a function in a contract.
            </p>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="to" className="label">
                    To:
                </label>
                <label htmlFor="to" className="example">
                    Example:{" "}
                    <code className="code">
                        0x1234567890123456789012345678901234567890
                    </code>
                </label>
                <input
                    onChange={handleChange}
                    type="text"
                    id="to"
                    name="to"
                    value={formData.to}
                    required
                />
                <label htmlFor="amount" className="label margin-top">
                    Amount:
                </label>
                <label htmlFor="amount" className="example">
                    Example: <code className="code">1000000000000000000</code>
                </label>
                <input
                    onChange={handleChange}
                    type="text"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    required
                />
                <label htmlFor="data" className="label margin-top">
                    Data:
                </label>
                <label htmlFor="data" className="example">
                    Example:{" "}
                    <code className="code">
                        0xa9059cbb00000000000000000000000012345678901234567890123456789012345678900000000000000000000000000000000000000000000000000de0b6b3a7640000
                    </code>
                </label>
                <textarea
                    onChange={handleChange}
                    type="text"
                    id="data"
                    name="data"
                    placeholder="Insert encoded data..."
                    value={formData.data}
                />
                <label htmlFor="description" className="label margin-top">
                    Transaction description:
                </label>
                <textarea
                    onChange={handleChange}
                    id="description"
                    name="description"
                    placeholder="Insert description..."
                    value={formData.description}
                    required
                />
                <button
                    disabled={isFetching || isLoading}
                    className="submit-button"
                >
                    Submit Transaction
                </button>
            </form>
        </Container>
    )
}

export default CreateTransactionModal
