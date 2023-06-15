import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { tokensDetails } from "@/database"
import { Web3Context } from "@/context/Web3Context"
import { useContext, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { walletAbi, erc20Abi } from "../constants"
import { ethers } from "ethers"

const Container = styled.div`
    position: fixed;
    max-width: 500px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    margin: auto;
    box-shadow: 0px 0px 5px 4px #363636;
    border-radius: 10px;
    height: ${({ depositTokens }) => (depositTokens ? "578px" : "min-content")};
    overflow-y: auto;
    background-color: #212121;
    color: rgb(210, 210, 210);

    &::-webkit-scrollbar {
        width: 0px;
        z-index: 20;
    }

    &::-webkit-scrollbar-track {
        background: #e5e5e5;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${({ enterMouse }) => enterMouse && "#a1a1a1"};
        background-color: transparent;
        border-radius: 10px;
    }

    .header {
        display: flex;
        padding: 2em 2.2em 0;
        margin-bottom: 1em;
        align-items: center;
        justify-content: space-between;
    }

    .close-modal-icon {
        font-size: 2.2rem;
        cursor: pointer;
        padding: 0.2em;
        transform: translateX(0.2em);
    }

    .close-modal-icon:hover {
        opacity: 0.7;
    }

    .modal-title {
        font-weight: 600;
        font-size: 1.2rem;
    }

    .sub-header {
        margin-bottom: 1em;
        padding-bottom: 0.8em;
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        border-bottom: 1px #2d2d2d solid;
    }

    .modal-subtitle {
        margin-left: 2.2em;
        font-size: 0.95rem;
        font-weight: 400;
        position: relative;
        opacity: 0.8;
    }

    .modal-subtitle:last-child {
        margin-left: 0.5em;
    }

    .active {
        color: white;
        opacity: 1;
    }

    .active::before {
        content: "";
        position: absolute;
        height: 5px;
        background-color: #12ba4d;
        width: 100%;
        top: 27px;
        left: 0;
    }

    .token-content {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 0px;
        justify-content: space-evenly;
        padding: 0 1.5em;
    }

    .token-container {
        padding: 2em;
        width: 100px;
        height: 100px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: rgb(210, 210, 210);
        border: 1px solid #2d2d2d;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        opacity: 0.8;
    }

    .token-container:hover {
        opacity: 1;
        border: 1px solid #dddddd;
    }

    .token-logo {
        width: 32px;
    }

    .token-name {
        font-weight: 500;
        letter-spacing: 0.2px;
        font-size: 1.03rem;
    }

    .modal-inner {
        display: flex;
        flex-direction: column;
        padding: 0 0.6em;
    }

    .modal-details-container {
        border-radius: 10px;
        padding: 1em;
        background-color: #272d36;
        letter-spacing: 0.2px;
    }

    .modal-detail {
        line-height: 1.4;
        margin-bottom: 0.7em;
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
        width: 32px;
        height: 32px;
    }

    .code {
        font-size: 1rem;
    }

    .uppercase {
        text-transform: uppercase;
    }

    .code-example {
        background: #141414;
        padding: 0.2em 0.4em;
        font-weight: 600;
        border-radius: 5px;
        color: whitesmoke;
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
        padding: 0.8em;
        border-radius: 5px;
        border: none;
        font-family: inherit;
        color: whitesmoke;
        background-color: #272d36;
    }

    .modal-bottom {
        background-color: #272d36;
        display: flex;
        justify-content: end;
        gap: 10px;
        margin: 1.8em 0 0 0;
        padding: 0.7em 2.2em;
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
    }

    .submit-button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`

const DepositErc20Modal = ({
    openDepositErc20Modal,
    setOpenDepositErc20Modal,
}) => {
    const { network } = useContext(Web3Context)
    const [depositTokens, setDepositTokens] = useState(false)
    const [token, setToken] = useState({})
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

    const handleClick = async (event) => {
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
            depositTokens={depositTokens}
        >
            <div className="header">
                <h2 className="modal-title">Deposit tokens</h2>
                <FaTimes
                    className="close-modal-icon"
                    onClick={() =>
                        setOpenDepositErc20Modal(!openDepositErc20Modal)
                    }
                />
            </div>
            <div className="sub-header">
                <h3
                    className={`${
                        !depositTokens
                            ? "modal-subtitle active"
                            : "modal-subtitle"
                    }`}
                >
                    Select
                </h3>
                <h3
                    className={`${
                        depositTokens
                            ? "modal-subtitle active"
                            : "modal-subtitle"
                    }`}
                >
                    Transfer
                </h3>
            </div>
            <div className="token-content">
                {!depositTokens ? (
                    tokensDetails.tokensDetails.map(
                        (
                            {
                                symbol,
                                name,
                                image,
                                decimal_place,
                                contract_addresses,
                            },
                            i
                        ) => (
                            <div
                                key={i}
                                className="token-container"
                                onClick={() => {
                                    setDepositTokens(!depositTokens)
                                    setToken({
                                        symbol: symbol,
                                        name: name,
                                        image: image.small,
                                        decimals: decimal_place,
                                        contractAddress:
                                            contract_addresses[network],
                                    })
                                }}
                            >
                                <img
                                    src={`${image.small}`}
                                    className="token-logo"
                                />
                                <p className="token-name">
                                    {symbol.toUpperCase()}
                                </p>
                            </div>
                        )
                    )
                ) : (
                    <div className="modal-inner">
                        <div className="modal-details-container">
                            <div className="modal-detail-logo-container">
                                <p className="modal-detail margin-bottom">
                                    <span>Logo:</span>{" "}
                                </p>
                                <img
                                    src={`${token.image}`}
                                    className="modal-detail-logo"
                                />
                            </div>
                            <p className="modal-detail">
                                <span>Contract address:</span>{" "}
                                <code className="code">
                                    {token.contractAddress}
                                </code>
                            </p>
                            <p className="modal-detail">
                                <span>Token name:</span>{" "}
                                <code className="code">{token.name}</code>{" "}
                            </p>
                            <p className="modal-detail">
                                <span>Token symbol:</span>{" "}
                                <code className="code uppercase">
                                    {token.symbol}
                                </code>
                            </p>
                            <p className="modal-detail">
                                <span>Decimal places:</span>{" "}
                                <code className="code">{token.decimals}</code>
                            </p>
                        </div>
                        <p className="modal-instructions margin-top">
                            Input the amount of tokens to deposit according to
                            the examples and then click the deposit button.
                        </p>
                        <form className="form" id="deposit-form">
                            <label htmlFor="amount" className="label">
                                Amount:
                            </label>
                            <label htmlFor="amount" className="example">
                                Examples:{" "}
                                <code className="code-example">1</code>,{" "}
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
                        </form>
                    </div>
                )}
            </div>
            <div className="modal-bottom">
                <button
                    onClick={() => setDepositTokens(!depositTokens)}
                    className="submit-button"
                    style={{
                        backgroundColor: "#3e3e3e",
                        display: depositTokens ? "block" : "none",
                        margin: "0 auto 0 0",
                    }}
                >
                    Back
                </button>
                <button
                    onClick={() =>
                        setOpenDepositErc20Modal(!openDepositErc20Modal)
                    }
                    className="submit-button"
                    style={{ backgroundColor: "#3e3e3e" }}
                >
                    Cancel
                </button>
                <button
                    onClick={handleClick}
                    className="submit-button"
                    style={{
                        backgroundColor: "#1db954",
                        display: depositTokens ? "block" : "none",
                    }}
                    disabled={
                        isFetchingDepositErc20 ||
                        isLoadingDepositErc20 ||
                        isFetchingApprove ||
                        isLoadingApprove
                    }
                    form="deposit-form"
                >
                    Deposit
                </button>
            </div>
        </Container>
    )
}

export default DepositErc20Modal
