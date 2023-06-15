import Meta from "@/components/Meta"
import DepositNftModal from "@/components/DepositNftModal"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react"
import { Web3Context } from "@/context/Web3Context"
import { BsFillArrowUpRightSquareFill } from "react-icons/bs"
import { FaEthereum } from "react-icons/fa"
import { AiOutlineCheck } from "react-icons/ai"
import { MdOutlineContentCopy } from "react-icons/md"
import { getNfts } from "@/utils/api"
import { handleClick } from "@/utils/utilities"

const Container = styled.div`
    span {
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(0.1rem);
        z-index: 20;
    }
`

const Div = styled.div`
    .nfts-wrapper {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
    }

    .nft-card {
        border-radius: 10px;
        padding: 1.2em 1.2em;
        color: #e4e4e4;
        transition: all 0.4s ease;
        max-width: 250.7px;
        background: linear-gradient(
            to left bottom,
            rgba(99, 99, 125, 0.7),
            rgba(99, 99, 125, 0.3)
        );
        backdrop-filter: blur(1rem);
    }

    .nft-card:hover {
        background: linear-gradient(
            to left bottom,
            rgba(85, 85, 110, 0.7),
            rgba(85, 85, 110, 0.3)
        );
    }

    .width {
        max-width: 100%;
    }

    .nft-card-header {
        margin-bottom: 0.5em;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: white;
    }

    .nft-name {
        font-family: "Permanent Marker", sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    .image-container {
        border-radius: 10px;
        background-color: white;
        position: relative;
    }

    .arrow-icon {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .hidden {
        display: none;
    }

    .nft-image {
        width: 200px;
        height: 210px;
        display: block;
    }

    .nft-data {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5em;
    }

    .nft-metadata {
        margin-top: 0.5em;
        font-size: 0.85rem;
        font-weight: 600;
    }

    .nft-address-container {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 0.2em;
    }

    .copy-button {
        background-color: transparent;
        border: none;
        padding: 0.3em 0.2em 0;
        cursor: pointer;
        margin-left: -0.2em;
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
`

const Title = styled.h1`
    margin-top: 1.2em;
    font-size: 1.8rem;
    color: white;
`

const ButtonsContainer = styled.div`
    margin: 0.8em 0;
    display: flex;
    flex-direction: row;
    gap: 15px;

    .button {
        padding: 0.6em 1em;
        border-radius: 7px;
        border: none;
        font-size: 1rem;
        font-weight: 500;
        color: white;
        transition: 200ms all cubic-bezier(0.4, 0, 0.2, 1);
        letter-spacing: 0.2px;
    }

    .button:disabled {
        cursor: default;
    }

    .blue {
        background-color: #0066ff;
    }

    .blue:hover:not([disabled]) {
        background-color: #0850bb;
    }
`

const Nfts = () => {
    const { isWeb3Enabled, multiSigWalletB, providerB } =
        useContext(Web3Context)
    const [openDepositNftModal, setOpenDepositNftModal] = useState(false)
    const [nfts, setNfts] = useState([])
    const [loading, setLoading] = useState(false)

    const checkNftDepositEvent = async () => {
        const latestBlockNumber = await providerB.getBlockNumber()

        multiSigWalletB.on("NftDeposit", async (...args) => {
            const event = args[args.length - 1]
            if (event.blockNumber <= latestBlockNumber) return

            setLoading(true)
            const ownedNfts = await getNfts()
            setNfts(ownedNfts)
            setLoading(false)
        })
    }

    useEffect(() => {
        // if (isWeb3Enabled) {
        setLoading(true)
        const fetchOwnedNfts = async () => {
            await checkNftDepositEvent()
            return await getNfts()
        }
        fetchOwnedNfts()
            .then((ownedNfts) => {
                setNfts(ownedNfts)
                setLoading(false)
            })
            .catch((error) => console.log(error))
        //}
    }, [isWeb3Enabled])

    return (
        <Container>
            <Meta title={"Multisig Wallet | NFT Balances"} />
            {openDepositNftModal && (
                <DepositNftModal
                    openDepositNftModal={openDepositNftModal}
                    setOpenDepositNftModal={setOpenDepositNftModal}
                />
            )}
            <div className={openDepositNftModal ? "modal-backdrop" : ""}></div>
            <Div>
                <Title>NFT balances:</Title>
                <ButtonsContainer>
                    <button
                        onClick={() =>
                            setOpenDepositNftModal(!openDepositNftModal)
                        }
                        className="button blue"
                        disabled={openDepositNftModal}
                    >
                        Deposit NFT
                    </button>
                </ButtonsContainer>
                {nfts ? (
                    <div className="nfts-wrapper" id="nfts-wrapper">
                        {nfts.map((nft, i) => (
                            <div key={i} className="nft-card">
                                <div className="nft-card-header">
                                    <p className="nft-name">
                                        {nft.collectionName}
                                    </p>
                                    <FaEthereum />
                                </div>
                                <div className="image-container">
                                    <BsFillArrowUpRightSquareFill className="arrow-icon hidden" />
                                    <img
                                        className="nft-image"
                                        src={nft.tokenUri.image}
                                    />
                                </div>

                                <div className="nft-data">
                                    <p className="nft-metadata">
                                        Name: <span>{nft.tokenUri.name}</span>
                                    </p>
                                    <p className="nft-metadata">
                                        Id: <span>{nft.tokenId}</span>
                                    </p>
                                </div>

                                <p className="nft-metadata">
                                    Symbol: <span>{nft.tokenSymbol}</span>
                                </p>

                                <p className="nft-metadata">
                                    Description:{" "}
                                    <span>{nft.tokenUri.description}</span>
                                </p>

                                <div className="nft-address-container">
                                    <p className="nft-metadata">
                                        Address:{" "}
                                        <span>
                                            {nft.nftAddress.slice(0, 5) +
                                                "..." +
                                                nft.nftAddress.slice(
                                                    nft.nftAddress.length - 4
                                                )}
                                        </span>
                                    </p>
                                    <button
                                        id={`${nft.tokenId}`}
                                        className="copy-button"
                                        onClick={(event) => {
                                            navigator.clipboard.writeText(
                                                nft.nftAddress
                                            )
                                            handleClick(event, nft.tokenId)
                                        }}
                                    >
                                        <MdOutlineContentCopy className="icon show" />
                                        <AiOutlineCheck className="icon hidden" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="nft-card width">
                        <p>No NFT balance</p>
                    </div>
                )}

                {loading && (
                    <div className="nft-card width">
                        <p>Loading...</p>
                    </div>
                )}
            </Div>
        </Container>
    )
}

export default Nfts
