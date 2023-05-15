import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { useState, useContext } from "react"
import { useWeb3Contract } from "react-moralis"
import { walletAbi, nftAbi } from "../constants"
import { Web3Context } from "@/context/Web3Context"
import { addNftDetail } from "@/utils/api"

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
    height: 505px;

    span {
        font-weight: 500;
        text-decoration: none;
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

    .code {
        font-size: 1rem;
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
`

const DepositNftModal = ({ openDepositNftModal, setOpenDepositNftModal }) => {
    const { contractAddress } = useContext(Web3Context)
    const [formData, setFormData] = useState({
        nftAddress: "",
        tokenId: "",
    })

    const {
        runContractFunction: approve,
        isLoading: isLoadingApprove,
        isFetching: isFetchingApprove,
    } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: formData.nftAddress,
        functionName: "approve",
        params: { to: contractAddress, tokenId: formData.tokenId },
    })

    const {
        runContractFunction: depositNft,
        isLoading: isLoadingDepositNft,
        isFetching: isFetchingDepositNft,
    } = useWeb3Contract({
        abi: walletAbi,
        contractAddress,
        functionName: "depositNft",
        params: { _nft: formData.nftAddress, _tokenId: formData.tokenId },
    })

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: walletAbi,
        contractAddress,
        functionName: "getTokenURI",
        params: { _nft: formData.nftAddress, _tokenId: formData.tokenId },
    })

    const { runContractFunction: symbol } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: formData.nftAddress,
        functionName: "symbol",
        params: {},
    })

    const { runContractFunction: name } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: formData.nftAddress,
        functionName: "name",
        params: {},
    })

    const fetchTokenUri = async () => {
        const tokenUri = await getTokenURI()
        const tokenUriResponse = await (await fetch(tokenUri)).json()
        const imageUri = tokenUriResponse.image.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
        )
        tokenUriResponse["image"] = imageUri
        return tokenUriResponse
    }

    const getNftDetail = async () => {
        const collectionName = await name()
        const tokenSymbol = await symbol()
        const tokenUri = await fetchTokenUri()

        return {
            nftAddress: formData.nftAddress,
            collectionName,
            tokenId: formData.tokenId,
            tokenSymbol,
            tokenUri,
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleSuccessApprove = async (tx) => {
        try {
            await tx.wait(1)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSuccessDepositNft = async (tx) => {
        try {
            await tx.wait(1)
        } catch (error) {
            console.log(error)
        } finally {
            const nftDetail = await getNftDetail()
            if (nftDetail.tokenUri) {
                await addNftDetail(nftDetail)
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        await approve({
            onSuccess: handleSuccessApprove,
            onError: (error) => console.log(error),
        })
        await depositNft({
            onSuccess: handleSuccessDepositNft,
            onError: (error) => console.log(error),
        })
    }

    return (
        <Container>
            <FaTimes
                className="close-modal-icon"
                onClick={() => setOpenDepositNftModal(!openDepositNftModal)}
            />
            <h1 className="modal-title">Deposit NFT</h1>
            <p className="modal-instructions margin-top">
                Fill the inputs field with contract address and the token ID of
                the NFT to deposit, according to the examples, then hit the
                deposit button to transfer the token.
            </p>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="nftAddress" className="label">
                    NFT address:
                </label>
                <label htmlFor="nftAddress" className="example">
                    Example:{" "}
                    <code className="code-example">
                        0x1234567890123456789012345678901234567890
                    </code>
                </label>
                <input
                    onChange={handleChange}
                    type="text"
                    id="nftAddress"
                    name="nftAddress"
                    value={formData.nftAddress}
                    required
                />
                <label htmlFor="tokenId" className="label margin-top">
                    Token ID:
                </label>
                <label htmlFor="tokenId" className="example">
                    Example: <code className="code-example">0</code>
                </label>
                <input
                    onChange={handleChange}
                    type="text"
                    id="tokenId"
                    name="tokenId"
                    value={formData.tokenId}
                    required
                />
                <button
                    disabled={
                        isFetchingDepositNft ||
                        isLoadingDepositNft ||
                        isFetchingApprove ||
                        isLoadingApprove
                    }
                    className="submit-button"
                >
                    Deposit NFT
                </button>
            </form>
        </Container>
    )
}

export default DepositNftModal
