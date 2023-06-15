import styled from "styled-components"
import Link from "next/link"
import { useRouter } from "next/router"
import { routesItems } from "@/routes/routesItems"
import { AiFillThunderbolt, AiFillHeart } from "react-icons/ai"
import { Web3Context } from "@/context/Web3Context"
import { useContext } from "react"

const Container = styled.div`
    background-color: #212121;
    padding: 1.5em 1em;
    overflow-y: auto;
    border-radius: 10px;
    margin-right: 0.9em;
    display: flex;
    flex-direction: column;

    .sibebar-logo-link {
        display: flex;
        margin: 0 auto 1em;
        align-items: center;
        gap: 7px;
        color: white;
    }

    .sidebar-logo {
        width: 65px;
        display: block;
    }

    .sidebar-title {
        font-family: "Permanent Marker", sans-serif;
        font-size: 1.2rem;
        font-weight: 600;
        letter-spacing: 1px;
    }

    .sidebar-links {
        padding: 1em 0.5em;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: bold;
        font-size: 1.1rem;
        color: #b3b3b3;
        transition: all 0.3s ease;
        letter-spacing: 0.5px;
        border-radius: 10px;
    }

    .sidebar-links:hover {
        color: white;
    }

    .link-active {
        color: white;
    }

    .link-icon {
        font-size: 1.7rem;
    }

    .link-title {
        font-size: 1rem;
        margin-top: -5px;
    }

    .sidebar-message {
        margin: auto 0 0 0;
        text-align: center;
        color: #b3b3b3;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        line-height: 1.4;
        letter-spacing: 0.1px;
    }

    @media (max-width: 895px) {
        .sidebar-logo {
            width: 50px;
        }

        .sidebar-links {
            justify-content: center;
        }

        .sidebar-message {
            font-size: 0.5rem;
        }
    }
`

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const router = useRouter()
    const { windowWidth } = useContext(Web3Context)

    return (
        <Container isOpen={isOpen}>
            <Link
                href="/"
                className="sibebar-logo-link"
                onClick={toggleSidebar}
            >
                <img className="sidebar-logo" src="../../VF01455.png" />
                {windowWidth > 895 && (
                    <div className="sidebar-title">
                        <p className="sidebar-title">Felina</p>
                        <p className="sidebar-title">Wallet &#169;</p>
                    </div>
                )}
            </Link>
            <div>
                {routesItems.map(({ title, icon, url, cName }, i) => (
                    <div key={i} className="link-container">
                        <Link
                            href={url}
                            className={`${
                                router.pathname === url
                                    ? `${cName} link-active`
                                    : cName
                            }`}
                            onClick={toggleSidebar}
                        >
                            <div className="link-icon">{icon}</div>
                            {windowWidth > 895 && (
                                <div className="link-title">{title}</div>
                            )}
                        </Link>
                    </div>
                ))}
            </div>
            <div className="sidebar-message">
                {windowWidth > 895 && (
                    <>
                        <p>
                            Made with {<AiFillHeart style={{ color: "red" }} />}{" "}
                            and{" "}
                            {<AiFillThunderbolt style={{ color: "yellow" }} />}
                        </p>
                        <p>by pacelliv</p>
                    </>
                )}
            </div>
        </Container>
    )
}

export default Sidebar
