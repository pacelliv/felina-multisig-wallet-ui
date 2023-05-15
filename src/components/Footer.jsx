import Link from "next/link"
import styled from "styled-components"
import { FaGithub } from "react-icons/fa"
import { MdOutlineMail } from "react-icons/md"
import { SiTwitter } from "react-icons/si"

const Container = styled.div`
    padding: 1.5em 0.8em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: auto;
    background-color: #161616;

    .footer-logo {
        font-family: "Permanent Marker", cursive;
        font-weight: 600;
        font-size: 0.9rem;
        letter-spacing: 2px;
        color: #aaaaaa;
        transition: all 0.4s ease;
    }

    .footer-logo:hover {
        color: white;
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
        width: 20px;
        height: 20px;
    }

    .app {
        font-size: 0.75rem;
    }

    @media (min-width: 870px) {
        padding: 1.5em 2em;
        margin-top: auto;

        .footer-logo {
            font-size: 1rem;
        }

        .social-media {
            gap: 30px;
        }

        .icon {
            width: 25px;
            height: 25px;
        }
    }
`

const Footer = () => {
    return (
        <Container className="footer">
            <Link href="/" className="footer-logo">
                By Pacelliv
            </Link>
            <div className="social-media">
                <a
                    href="https://github.com/pacelliv"
                    target="_blank"
                    className="link"
                >
                    <div className="box">
                        <FaGithub className="icon" />
                        <p className="app">Github</p>
                    </div>
                </a>
                <a
                    href="https://twitter.com/pacelliv3"
                    target="_blank"
                    className="link"
                >
                    <div className="box">
                        <SiTwitter className="icon" />
                        <p className="app">Twitter</p>
                    </div>
                </a>
                <a
                    href="/mailto:flores.eugenio03@gmail.com"
                    target="_blank"
                    className="link"
                >
                    <div className="box">
                        <MdOutlineMail className="icon" />
                        <p className="app">Email</p>
                    </div>
                </a>
            </div>
        </Container>
    )
}

export default Footer
