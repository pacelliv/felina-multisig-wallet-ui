import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { useState } from "react"
import { ethers } from "ethers"
import { MdOutlineContentCopy } from "react-icons/md"
import { AiOutlineCheck } from "react-icons/ai"

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

    .modal-instructions {
        line-height: 1.5;
    }

    .code {
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

    .submit-button {
        padding: 0.9em 1em;
        margin-top: 2em;
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

    .submit-button:hover {
        background-color: #005f73;
    }

    @media (max-width: 550px) {
        margin: auto 0.8em;
    }
`

const EncodeModal = ({ openModal, toggleModal }) => {
    const [enterMouse, setEnterMouse] = useState(false)
    const [copy, setCopy] = useState(false)
    const [formData, setFormData] = useState({
        abi: "",
        name: "",
        data: "",
    })
    const [encodedData, setEncodedData] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleSubmit = (event) => {
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
            <FaTimes className="close-modal-icon" onClick={toggleModal} />
            <h1 className="modal-title">Encode calldata</h1>
            <p className="modal-instructions">
                The data is encoded with etherjs{" "}
                <code className="code">5.7.2</code>, fill the input fields
                according to the examples to correctly encode the data. Once the
                data is encoded click on the icon to copy it to the clipboard.
            </p>
            <p className="modal-instructions margin-top">
                To encode the function parameters, type them separated by commas
                with no space after the commas.
            </p>
            <form className="form" onSubmit={handleSubmit}>
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
                <button className="submit-button">Encode</button>
            </form>
        </Container>
    )
}

export default EncodeModal
