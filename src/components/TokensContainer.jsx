import styled from "styled-components"
import { AiOutlineCheck } from "react-icons/ai"
import { MdOutlineContentCopy } from "react-icons/md"
import { ethers } from "ethers"
import { handleClick } from "@/utils/utilities"

const Div = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 20px;

    .token-card {
        display: flex;
        align-items: center;
        gap: 15px;
        margin: 0.4em 0;
        border-radius: 10px;
        padding: 1.2em 1em 1.2em 1em;
        color: #e4e4e4;
        transition: all 0.4s ease;
        background: linear-gradient(
            to left bottom,
            rgba(99, 99, 125, 0.7),
            rgba(99, 99, 125, 0.3)
        );
        backdrop-filter: blur(1rem);
    }

    .token-card:hover {
        background: linear-gradient(
            to left bottom,
            rgba(85, 85, 110, 0.7),
            rgba(85, 85, 110, 0.3)
        );
    }

    .token-icon {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.4s ease;
    }

    .token {
        width: calc(100% - 35px);
    }

    .token-address-container {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: -0.28em;
    }

    .copy-button {
        background-color: transparent;
        border: none;
        padding: 0.3em 0.2em 0;
    }

    .icon {
        font-size: 16px;
        pointer-events: none;
        color: #e4e4e4;
    }

    .show {
        display: block;
    }

    .hidden {
        display: none;
    }

    .token-symbol,
    .token-address,
    .token-balance {
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
        .token-card {
            margin: 0;
        }
    }
`

const TokensContainer = ({
    marketData,
    tokens,
    tokensBalances,
    loading,
    network,
}) => {
    const index = (id) => marketData.findIndex((data) => data.id === id)

    const usdConversion = (id, balance, decimals) => {
        const formattedBalance = ethers.utils.formatUnits(balance, decimals)
        const mul =
            parseInt(formattedBalance) * marketData[index(id)].current_price
        const roundedMul = (Math.round(mul * 100) / 100).toFixed(2)
        return Number(roundedMul).toLocaleString("en")
    }

    return (
        <Div>
            {tokens.map(
                (
                    {
                        id,
                        symbol,
                        name,
                        image,
                        contract_addresses,
                        decimal_place,
                    },
                    i
                ) => (
                    <div key={i} className="token-card">
                        <div>
                            <img
                                src={`${image.small}`}
                                className="token-icon"
                            />
                        </div>
                        <div className="token">
                            <p className="token-symbol">
                                Name: <span className="value">{name}</span>
                            </p>
                            <div className="token-address-container">
                                <p className="token-address">
                                    Contract address:{" "}
                                    <span className="value">
                                        {contract_addresses[network].slice(
                                            0,
                                            6
                                        ) +
                                            "..." +
                                            contract_addresses[network].slice(
                                                contract_addresses[network]
                                                    .length - 5
                                            )}{" "}
                                    </span>
                                    <button
                                        id={`${id}`}
                                        className="copy-button"
                                        onClick={(event) => {
                                            navigator.clipboard.writeText(
                                                contract_addresses[network]
                                            )
                                            handleClick(event, id)
                                        }}
                                    >
                                        <MdOutlineContentCopy className="icon show" />
                                        <AiOutlineCheck className="icon hidden" />
                                    </button>
                                </p>
                            </div>

                            <p className="token-balance">
                                Balance:{" "}
                                {loading ? (
                                    <span className="value">Loading...</span>
                                ) : (
                                    <span className="value">
                                        {parseInt(
                                            ethers.utils.formatUnits(
                                                tokensBalances[i],
                                                decimal_place
                                            )
                                        ).toLocaleString("en")}{" "}
                                        {symbol.toUpperCase()}
                                    </span>
                                )}
                            </p>

                            <p className="token-balance">
                                USD:{" "}
                                {loading ? (
                                    <span className="value">Loading...</span>
                                ) : (
                                    <span className="value">
                                        ${" "}
                                        {usdConversion(
                                            id,
                                            tokensBalances[i],
                                            decimal_place
                                        )}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                )
            )}
        </Div>
    )
}

export default TokensContainer
