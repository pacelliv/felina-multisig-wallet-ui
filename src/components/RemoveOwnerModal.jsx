import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { useState, useContext } from "react"
import { useWeb3Contract } from "react-moralis"
import { walletAbi } from "../constants"
import { Web3Context } from "@/context/Web3Context"
import { encoder } from "@/utils/utilities"
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
    height: max-content;
    color: rgb(210, 210, 210);

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
        padding: 0 1.5em;
    }

    .modal-instructions {
        line-height: 1.5;
    }

    .code {
        background: #141414;
        padding: 0.2em 0.4em;
        font-weight: 600;
        border-radius: 5px;
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
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
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

const RemoveOwnerModal = ({
    openRemoveOwnerModal,
    setOpenRemoveOwnerModal,
}) => {
    const { contractAddress } = useContext(Web3Context)
    const [enterMouse, setEnterMouse] = useState(false)
    const [formData, setFormData] = useState({ id: "", description: "" })
    const { runContractFunction, isFetching, isLoading } = useWeb3Contract()

    const { runContractFunction: getTransactions } = useWeb3Contract({
        abi: walletAbi,
        contractAddress,
        functionName: "getTransactions",
        params: {},
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleClick = async (event) => {
        event.preventDefault()
        const encodedData = encoder(
            ["function removeOwner(uint256 _index)"],
            "removeOwner",
            [formData.id]
        )

        const transactionsList = await getTransactions()
        await addTransactionDescription(
            transactionsList.length.toString(),
            formData.description
        )
        await submitTransaction(contractAddress, "0", encodedData)
    }

    const submitTransaction = async (walletAddress, amount, data) => {
        const submitTransactionOptions = {
            abi: walletAbi,
            contractAddress: walletAddress,
            functionName: "submit",
            params: { _to: walletAddress, _amount: amount, _data: data },
        }

        try {
            await runContractFunction({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
                params: submitTransactionOptions,
            })
        } catch (error) {
            console.log(error)
        }
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
                <h2 className="modal-title">Remove owner</h2>
                <FaTimes
                    className="close-modal-icon"
                    onClick={() =>
                        setOpenRemoveOwnerModal(!openRemoveOwnerModal)
                    }
                />
            </div>
            <div className="modal-content">
                <p className="modal-instructions">
                    Insert the id of the owner to be removed according to the
                    example. Hit the submit button to add a new transaction to
                    the pending list.
                </p>
                <p className="modal-instructions margin-top">
                    The calldata of the transaction is automatically encoded.
                </p>
            </div>
            <form className="form" id="remove-owner">
                <label htmlFor="id" className="label">
                    Owner ID:
                </label>
                <label htmlFor="id" className="example">
                    Example: <code className="code">0</code>
                </label>
                <input
                    onChange={handleChange}
                    type="text"
                    id="id"
                    name="id"
                    value={formData.id}
                    required
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
                        setOpenRemoveOwnerModal(!openRemoveOwnerModal)
                    }
                    className="submit-button"
                    style={{ backgroundColor: "#3e3e3e" }}
                >
                    Cancel
                </button>
                <button
                    disabled={isFetching || isLoading}
                    onClick={handleClick}
                    form="remove-owner"
                    className="submit-button"
                    style={{ backgroundColor: "#1db954" }}
                >
                    Remove owner{" "}
                </button>
            </div>
        </Container>
    )
}

export default RemoveOwnerModal
