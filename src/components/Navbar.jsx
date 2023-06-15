import styled from "styled-components"
import ConnectButton from "./ConnectButton"
import { FaGithub } from "react-icons/fa"
import { MdOutlineMail } from "react-icons/md"
import { SiTwitter } from "react-icons/si"
import { BsArrowUpRightSquare } from "react-icons/bs"
import { Web3Context } from "@/context/Web3Context"
import { useContext } from "react"

const Divider = styled.div`
    height: 100%;
    width: 2px;
    margin: 0 4em;
    background-color: white;

    @media (max-width: 1025px) {
        margin: 0 1.5em;
    }
`

const Nav = styled.nav`
    padding: 1.67em 2em;
    display: flex;
    align-items: center;
    justify-content: end;
    background: hsla(0, 0%, 13%, 1);

    background: linear-gradient(
        90deg,
        hsla(0, 0%, 13%, 1) 0%,
        hsla(243, 85%, 22%, 1) 77%
    );

    background: -moz-linear-gradient(
        90deg,
        hsla(0, 0%, 13%, 1) 0%,
        hsla(243, 85%, 22%, 1) 77%
    );

    background: -webkit-linear-gradient(
        90deg,
        hsla(0, 0%, 13%, 1) 0%,
        hsla(243, 85%, 22%, 1) 77%
    );

    .navbar-title {
        font-family: "Permanent Marker", sans-serif;
        letter-spacing: 0.75px;
        font-weight: 600;
    }

    .navbar-link {
        font-weight: 600;
        font-size: 1rem;
        padding: 0.5em 0.9em;
        border-radius: 10px;
        color: #4d4d4d;
        transition: all 0.4s ease;
    }

    .navbar-link:hover {
        background-color: #d6d6d1;
        color: black;
    }

    .link-contract {
        color: #aaaaaa;
        letter-spacing: 0.8px;
        margin: 0 auto 0 0;
        display: flex;
        gap: 7px;
        border-bottom: 1px solid transparent;
    }

    .link-contract:hover {
        transform: scale(1.03);
        border-bottom: 1px solid white;
        color: white;
    }

    .link-contract-icon {
        width: 15px;
        height: 15px;
        margin-top: 2px;
    }

    .social-media {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
    }

    .link {
        cursor: pointer;
    }

    .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        transition: all 0.4s ease;
        color: #aaaaaa;
    }

    .box:hover {
        color: white;
    }

    .icon {
        width: 23px;
        height: 23px;
    }

    .app {
        font-size: 0.75rem;
    }

    @media (max-width: 639px) {
        justify-content: space-between;
    }

    @media (max-width: 500px) {
        .navbar-link {
            font-size: 0.9rem;
        }
    }

    @media (max-width: 1025px) {
        .social-media {
            gap: 12px;
        }
    }
`

const Navbar = () => {
    const { windowWidth } = useContext(Web3Context)

    return (
        <Nav>
            <a
                href="https://github.com/pacelliv/multisig-wallet"
                target="_blank"
                className="link link-contract"
                style={{ display: windowWidth < 640 && "none" }}
            >
                {windowWidth > 1025 ? (
                    <p>Check the smart contract</p>
                ) : (
                    <p>Smart contract</p>
                )}
                <BsArrowUpRightSquare className="link-contract-icon" />
            </a>
            <div className="social-media">
                <a
                    href="https://github.com/pacelliv"
                    target="_blank"
                    className="link"
                    style={{ display: windowWidth < 640 ? "block" : "none" }}
                >
                    <div className="box">
                        <FaGithub className="icon" />
                    </div>
                </a>
                <a
                    href="https://twitter.com/pacelliv3"
                    target="_blank"
                    className="link"
                >
                    <div className="box">
                        <SiTwitter className="icon" />
                    </div>
                </a>
                <a
                    href="/mailto:flores.eugenio03@gmail.com"
                    target="_blank"
                    className="link"
                >
                    <div className="box">
                        <MdOutlineMail className="icon" />
                    </div>
                </a>
            </div>
            <Divider style={{ display: windowWidth < 640 && "none" }} />
            <ConnectButton />
        </Nav>
    )
}

export default Navbar
