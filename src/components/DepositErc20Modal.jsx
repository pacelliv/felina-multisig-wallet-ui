import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { useState, useContext } from "react"
import { useWeb3Contract } from "react-moralis"
import { walletAbi, erc20Abi } from "../constants"
import { Web3Context } from "@/context/Web3Context"
import { ethers } from "ethers"

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
        margin: 0 0 0.6em 0;
        font-size: 1.75rem;
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

    .margin-bottom {
        margin-bottom: 0;
    }

    .modal-detail-logo-container {
        display: flex;
        align-items: center;
        gap: 10px;
        line-height: 1.4;
        margin-bottom: 1em;
    }

    .modal-detail-logo {
        width: 35px;
        height: 35px;
    }

    .code {
        font-size: 1rem;
    }

    .uppercase {
        text-transform: uppercase;
    }

    .modal-instructions {
        line-height: 1.5;
    }

    .code-example {
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

const DepositErc20Modal = ({
    openDepositErc20Modal,
    setOpenDepositErc20Modal,
    token,
}) => {
    const { contractAddress } = useContext(Web3Context)
    const [enterMouse, setEnterMouse] = useState(false)
    const [formData, setFormData] = useState({
        amount: "",
    })

    const {
        runContractFunction: approve,
        isLoading: isLoadingApprove,
        isFetching: isFetchingApprove,
    } = useWeb3Contract({
        abi: erc20Abi,
        contractAddress: token.contractAddress,
        functionName: "approve",
        params: {
            spender: contractAddress,
            amount: ethers.utils.parseUnits(
                formData.amount ? formData.amount : "0",
                token.decimals
            ),
        },
    })

    const {
        runContractFunction: depositErc20,
        isLoading: isLoadingDepositErc20,
        isFetching: isFetchingDepositErc20,
    } = useWeb3Contract({
        abi: walletAbi,
        contractAddress,
        functionName: "depositErc20",
        params: {
            _token: token.contractAddress,
            _amount: ethers.utils.parseUnits(
                formData.amount ? formData.amount : "0",
                token.decimals
            ),
        },
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        await approve({
            onSuccess: handleSuccessApprove,
            onError: (error) => console.log(error),
        })
    }

    const handleSuccessApprove = async (tx) => {
        try {
            await tx.wait(1)
            await depositErc20({
                onSuccess: handleSuccessDepositErc20,
                onError: (error) => console.log(error),
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleSuccessDepositErc20 = async (tx) => {
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
            <FaTimes
                className="close-modal-icon"
                onClick={() => setOpenDepositErc20Modal(!openDepositErc20Modal)}
            />
            <h1 className="modal-title">Deposit ERC20 token</h1>
            <h3 className="modal-subtitle">Selected token:</h3>
            <div className="modal-details-container">
                <div className="modal-detail-logo-container">
                    <p className="modal-detail margin-bottom">
                        <span>Logo:</span>{" "}
                    </p>
                    <img src={`${token.image}`} className="modal-detail-logo" />
                </div>
                <p className="modal-detail">
                    <span>Contract address:</span>{" "}
                    <code className="code">{token.contractAddress}</code>
                </p>
                <p className="modal-detail">
                    <span>Token name:</span>{" "}
                    <code className="code">{token.name}</code>{" "}
                </p>
                <p className="modal-detail">
                    <span>Token symbol:</span>{" "}
                    <code className="code uppercase">{token.symbol}</code>
                </p>
                <p className="modal-detail">
                    <span>Decimal places:</span>{" "}
                    <code className="code">{token.decimals}</code>
                </p>
            </div>
            <p className="modal-instructions margin-top">
                Input the amount of tokens to deposit according to the examples
                and then click the deposit button.
            </p>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="amount" className="label">
                    Amount:
                </label>
                <label htmlFor="amount" className="example">
                    Examples: <code className="code-example">1</code>,{" "}
                    <code className="code-example">1.5</code> or{" "}
                    <code className="code-example">1000</code>
                </label>
                <input
                    onChange={handleChange}
                    type="text"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    required
                />
                <button
                    disabled={
                        isFetchingDepositErc20 ||
                        isLoadingDepositErc20 ||
                        isFetchingApprove ||
                        isLoadingApprove
                    }
                    className="submit-button"
                >
                    Deposit tokens
                </button>
            </form>
        </Container>
    )
}

export default DepositErc20Modal
