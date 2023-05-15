import styled from "styled-components"
import ConnectButton from "./ConnectButton"
import Link from "next/link"
import { FiMenu } from "react-icons/fi"
import { Context } from "../context/Context"
import { useContext } from "react"

const Nav = styled.nav`
    padding: 1.67em 2em;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .hamburger {
        display: none;
        font-size: 30px;
        cursor: pointer;
        pointer-events: ${({ openModal }) => openModal && "none"};
    }

    .navbar-title {
        font-family: "Permanent Marker", sans-serif;
        letter-spacing: 0.75px;
        font-weight: 600;
    }

    .navbar-link {
        font-weight: 600;
        font-size: 1.1rem;
        padding: 0.5em 0.9em;
        border-radius: 10px;
        color: #4d4d4d;
        transition: all 0.4s ease;
    }

    .navbar-link:hover {
        background-color: #d6d6d1;
        color: black;
    }

    @media (max-width: 500px) {
        .navbar-link {
            font-size: 0.9rem;
        }
    }

    @media (max-width: 870px) {
        padding: 1.67em 0.8em;
    }

    @media (max-width: 850px) {
        .hamburger {
            display: block;
        }

        .navbar-title {
            display: none;
        }
    }
`

const Navbar = ({ toggleSidebar }) => {
    const { openModal } = useContext(Context)

    return (
        <Nav openModal={openModal}>
            <FiMenu className="hamburger" onClick={toggleSidebar} />
            <Link href="/" className="navbar-title">
                Felina Wallet &#169;
            </Link>
            <a href="/" className="navbar-link">
                Documentation
            </a>
            <ConnectButton />
        </Nav>
    )
}

export default Navbar
