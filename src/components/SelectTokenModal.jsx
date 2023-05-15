import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { tokensDetails } from "@/database"
import { Web3Context } from "@/context/Web3Context"
import { useContext, useState } from "react"

const Container = styled.div`
    position: fixed;
    max-width: 250px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    margin: auto;
    box-shadow: 0px 0px 5px 2px #d0d0d0;
    border-radius: 5px;
    background-color: white;
    height: 545px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 7px;
        z-index: 20;
    }

    &::-webkit-scrollbar-track {
        background: #e5e5e5;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${({ enterMouse }) => enterMouse && "#a1a1a1"};
        border-radius: 10px;
    }

    .header {
        display: flex;
        padding: 0.5em 0.7em 0.5em 1.1em;
        align-items: center;
        justify-content: space-between;
        background-color: #161616;
        color: #ffead0;
        border-top-left-radius: 5px;
    }

    .close-modal-icon {
        font-size: 2.2rem;
        cursor: pointer;
        padding: 0.2em 0em 0.2em 0.2em;
    }

    .close-modal-icon:hover {
        opacity: 0.7;
    }

    .modal-title {
        font-size: 1.1rem;
        font-weight: 500;
    }

    .token-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 20px;
        padding: 1.2em 1.1em;
        cursor: pointer;
        transition: all 0.4s ease;
    }

    .token-container:last-child {
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    .token-container:hover {
        background-color: #dddddd;
    }

    .token-logo {
        width: 32px;
    }

    .token-name {
        font-weight: 500;
        color: #2d2d2d;
        letter-spacing: 0.2px;
        font-size: 1.03rem;
    }
`

const SelectTokenModal = ({
    openSelectTokenModal,
    setOpenSelectTokenModal,
    openDepositErc20Modal,
    setOpenDepositErc20Modal,
    setToken,
}) => {
    const { network } = useContext(Web3Context)
    const [enterMouse, setEnterMouse] = useState(false)

    return (
        <Container
            onMouseOver={() => setEnterMouse(true)}
            onMouseLeave={() => setEnterMouse(false)}
            enterMouse={enterMouse}
        >
            <div className="header">
                <h3 className="modal-title">Select token</h3>
                <FaTimes
                    className="close-modal-icon"
                    onClick={() =>
                        setOpenSelectTokenModal(!openSelectTokenModal)
                    }
                />
            </div>
            {tokensDetails.tokensDetails.map((tokenDetail, i) => (
                <div
                    key={i}
                    className="token-container"
                    onClick={() => {
                        setOpenSelectTokenModal(!openSelectTokenModal)
                        setOpenDepositErc20Modal(!openDepositErc20Modal)
                        setToken({
                            symbol: tokenDetail.symbol,
                            name: tokenDetail.name,
                            image: tokenDetail.image.small,
                            decimals: tokenDetail.decimal_place,
                            contractAddress:
                                tokenDetail.contract_addresses[network],
                        })
                    }}
                >
                    <img
                        src={`${tokenDetail.image.small}`}
                        className="token-logo"
                    />
                    <p className="token-name">{tokenDetail.name}</p>
                </div>
            ))}
        </Container>
    )
}

export default SelectTokenModal
