import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { useState, useContext } from "react"
import { useWeb3Contract } from "react-moralis"
import { walletAbi } from "../constants"
import { Web3Context } from "@/context/Web3Context"
import { ethers } from "ethers"
import { addTransactionDescription } from "@/utils/api"

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
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2em 1.5em 0;
        margin-bottom: 2em;
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

    .modal-content {
        padding: 0 2em;
    }

    .modal-instructions {
        line-height: 1.5;
    }

    .code {
        background: #141414;
        padding: 0.2em 0.4em;
        font-weight: 600;
        border-radius: 5px;
        color: whitesmoke;
    }

    .form {
        margin-top: 1em;
        padding: 0 1.5em;
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
        padding: 0.8em;
        border-radius: 5px;
        border: none;
        font-family: inherit;
        color: whitesmoke;
        background-color: #272d36;
    }

    .icon {
        color: white;
        font-size: 1.2rem;
        font-weight: 900;
    }

    textarea {
        display: block;
        border: none;
        width: 100%;
        height: 100px;
        border-radius: 5px;
        padding: 0.7em 1em;
        margin-top: 0.5em;
        font-family: inherit;
        letter-spacing: 0.2px;
        line-height: 1.4;
        resize: none;
        color: whitesmoke;
        background-color: #272d36;
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
        padding: 0.5em 1.5em;
        cursor: pointer;
    }

    .submit-button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    @media (max-width: 550px) {
        margin: auto 0.8em;
    }
`

const CreateTransactionModal = ({
    openCreateTransactionModal,
    setOpenCreateTransactionModal,
}) => {
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

    const { runContractFunction: getTransactions } = useWeb3Contract({
        abi: walletAbi,
        contractAddress,
        functionName: "getTransactions",
        params: {},
    })

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleClick = async (event) => {
        event.preventDefault()
        const transactionsList = await getTransactions()
        await addTransactionDescription(
            transactionsList.length.toString(),
            formData.description
        )
        await submit({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error),
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Container
            onMouseOver={() => setEnterMouse(true)}
            onMouseLeave={() => setEnterMouse(false)}
            enterMouse={enterMouse}
        >
            <div className="modal-header">
                <h2 className="modal-title">Create a transaction</h2>
                <FaTimes
                    className="close-modal-icon"
                    onClick={() =>
                        setOpenCreateTransactionModal(
                            !openCreateTransactionModal
                        )
                    }
                />
            </div>

            <div className="modal-content">
                <p className="modal-instructions">
                    Fill the fields according to the examples and hit the submit
                    button to add a new transaction to the list of pending
                    transactions.
                </p>
                <p className="modal-instructions margin-top">
                    Leave the data field empty if you intent on submitting a
                    simple transaction to transfer ETH, otherwise insert the
                    encoded data to submit a transaction to call a function in a
                    contract.
                </p>
            </div>

            <form className="form" id="create-form">
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
            </form>
            <div className="modal-bottom">
                <button
                    onClick={() =>
                        setOpenCreateTransactionModal(
                            !openCreateTransactionModal
                        )
                    }
                    className="submit-button"
                    style={{ backgroundColor: "#3e3e3e" }}
                >
                    Cancel
                </button>
                <button
                    disabled={isFetching || isLoading}
                    onClick={handleClick}
                    form="create-form"
                    className="submit-button"
                    style={{ backgroundColor: "#1db954" }}
                >
                    Create Tx{" "}
                </button>
            </div>
        </Container>
    )
}

export default CreateTransactionModal
