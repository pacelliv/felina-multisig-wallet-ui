import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { useState } from "react"
import { ethers } from "ethers"
import { MdOutlineContentCopy } from "react-icons/md"
import { AiOutlineCheck } from "react-icons/ai"

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
        padding: 2em 2em 0;
        margin-bottom: 2em;
    }

    .close-modal-icon {
        font-size: 2.5rem;
        cursor: pointer;
        padding: 0.2em;
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

    .display-container {
        margin-top: 2em;
    }

    .display-title {
        font-weight: 500;
    }

    .modal-display {
        position: relative;
        margin-top: 0.4em;
        padding: 0.7em;
        border-radius: 5px;
        width: 100%;
        background-color: #161616;
    }

    .copy-button {
        margin: 0 0 0 auto;
        background-color: transparent;
        border: none;
        display: block;
    }

    .icon {
        color: white;
        font-size: 1.2rem;
        font-weight: 900;
    }

    .display-code {
        color: white;
        word-wrap: break-word;
        margin-top: 0.5em;
        display: block;
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

    @media (max-width: 550px) {
        margin: auto 0.8em;
    }
`

const EncodeModal = ({ openModal, setOpenModal }) => {
    const [enterMouse, setEnterMouse] = useState(false)
    const [copy, setCopy] = useState(false)
    const [formData, setFormData] = useState({
        abi: "",
        name: "",
        data: "",
    })
    const [encodedData, setEncodedData] = useState("")

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleClick = (event) => {
        event.preventDefault()
        const ABI = new Array(formData.abi)
        const iface = new ethers.utils.Interface(ABI)
        const data = formData.data.split(",")
        const encodedData = iface.encodeFunctionData(formData.name, data)
        setEncodedData(encodedData)
    }

    return (
        <Container
            openModal={openModal}
            onMouseOver={() => setEnterMouse(true)}
            onMouseLeave={() => setEnterMouse(false)}
            enterMouse={enterMouse}
        >
            <div className="modal-header">
                <h2>Encode calldata</h2>
                <FaTimes
                    className="close-modal-icon"
                    onClick={() => setOpenModal(!openModal)}
                />
            </div>

            <div className="modal-content">
                <p className="modal-instructions">
                    The data is encoded with etherjs{" "}
                    <code className="code">5.7.2</code>, fill the input fields
                    according to the examples to correctly encode the data. Once
                    the data is encoded click on the icon to copy it to the
                    clipboard.
                </p>
                <p className="modal-instructions margin-top">
                    To encode the function parameters, type them separated by
                    commas with no space after the commas.
                </p>
            </div>

            <form className="form" id="encode-form">
                <label htmlFor="abi" className="label">
                    Function ABI:
                </label>
                <label htmlFor="abi" className="example">
                    Example:{" "}
                    <code className="code">
                        function transfer(address to, uint256 amount)
                    </code>
                </label>
                <input
                    onChange={handleChange}
                    type="text"
                    id="abi"
                    name="abi"
                    value={formData.abi}
                    required
                />
                <label htmlFor="name" className="label margin-top">
                    Function name:
                </label>
                <label htmlFor="name" className="example">
                    Example: <code className="code">transfer</code>
                </label>
                <input
                    onChange={handleChange}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    required
                />
                <label htmlFor="name" className="label margin-top">
                    Function parameters:
                </label>
                <label htmlFor="data" className="example">
                    Example:{" "}
                    <code className="code">
                        0x1234567890123456789012345678901234567890,1000000000000000000
                    </code>
                </label>
                <input
                    onChange={handleChange}
                    type="text"
                    id="data"
                    name="data"
                    value={formData.data}
                    required
                />
                <div className="display-container">
                    <p className="display-title">Encoded data:</p>
                    <div className="modal-display">
                        <div className="button-container">
                            <button
                                type="button"
                                className="copy-button"
                                onClick={() => {
                                    navigator.clipboard.writeText(encodedData)
                                    setCopy(true)
                                    setTimeout(() => setCopy(false), 1000)
                                }}
                            >
                                {copy ? (
                                    <AiOutlineCheck className="icon" />
                                ) : (
                                    <MdOutlineContentCopy className="icon" />
                                )}
                            </button>
                        </div>
                        <code className="display-code">{encodedData}</code>
                    </div>
                </div>
            </form>
            <div className="modal-bottom">
                <button
                    onClick={() => setOpenModal(!openModal)}
                    className="submit-button"
                    style={{ backgroundColor: "#3e3e3e" }}
                >
                    Cancel
                </button>
                <button
                    onClick={handleClick}
                    form="encode-form"
                    className="submit-button"
                    style={{ backgroundColor: "#1db954" }}
                >
                    Encode
                </button>
            </div>
        </Container>
    )
}

export default EncodeModal
