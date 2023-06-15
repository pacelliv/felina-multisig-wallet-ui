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

    span {
        font-weight: 500;
        text-decoration: none;
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
        padding: 0 1.5em;
    }

    .modal-subtitle {
        margin: 0 0 0.3em 0;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .code {
        background: #141414;
    }

    .modal-instructions {
        line-height: 1.5;
    }

    .code-example {
        background: #141414;
        padding: 0.2em 0.4em;
        font-weight: 600;
        border-radius: 5px;
    }

    .form {
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
            await depositNft({
                onSuccess: handleSuccessDepositNft,
                onError: (error) => console.log(error),
            })
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

    return (
        <Container>
            <div className="modal-header">
                <h2 className="modal-title">Deposit NFT</h2>
                <FaTimes
                    className="close-modal-icon"
                    onClick={() => setOpenDepositNftModal(!openDepositNftModal)}
                />
            </div>
            <div className="modal-content">
                <p className="modal-instructions margin-top">
                    Fill the inputs field with contract address and the token ID
                    of the NFT to deposit, according to the examples, then hit
                    the deposit button to transfer the token.
                </p>
            </div>

            <form className="form" id="nft-form">
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
            </form>
            <div className="modal-bottom">
                <button
                    onClick={() => setOpenDepositNftModal(!openDepositNftModal)}
                    className="submit-button"
                    style={{ backgroundColor: "#3e3e3e" }}
                >
                    Cancel
                </button>
                <button
                    disabled={
                        isFetchingDepositNft ||
                        isLoadingDepositNft ||
                        isFetchingApprove ||
                        isLoadingApprove
                    }
                    onClick={handleClick}
                    form="nft-form"
                    className="submit-button"
                    style={{ backgroundColor: "#1db954" }}
                >
                    Deposit NFT
                </button>
            </div>
        </Container>
    )
}

export default DepositNftModal
