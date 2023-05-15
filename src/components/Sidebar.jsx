import styled from "styled-components"
import Link from "next/link"
import { useRouter } from "next/router"
import { routesItems } from "@/routes/routesItems"
import { MdClose } from "react-icons/md"

const Divider = styled.div`
    height: 1px;
    width: 100%;
    background-color: #b1b1b1;
    margin: 1.5em 0;
    transition: all 0.3s ease;
`

const Container = styled.div`
    background-color: white;
    height: 100vh;
    padding: 1.5em 0.5em;
    overflow-y: auto;

    .sidebar-title {
        font-family: "Permanent Marker", sans-serif;
        letter-spacing: 0.75px;
        font-weight: 600;
        display: none;
        position: absolute;
        top: 20px;
        left: 20px;
    }

    .sibebar-logo-link {
        display: block;
    }

    .sidebar-logo {
        width: 50px;
        margin: 0 auto;
        display: block;
    }

    .x-mark {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 30px;
        font-weight: 900;
        display: none;
        cursor: pointer;
    }

    .sidebar-links {
        padding: 1em 0.5em;
        display: block;
        font-weight: bold;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        letter-spacing: 0.1px;
    }

    .sidebar-links:hover {
        background-color: #dfe1d8;
        padding-left: 1.5em;
    }

    .link-active {
        color: #d62828;
    }

    @media (max-width: 870px) {
        transition: all 0.4s ease;
        z-index: 20;
        width: 100%;
        position: absolute;
        transform: ${({ isOpen }) =>
            isOpen ? "translateX(0%)" : "translateX(-100%)"};

        .sidebar-title {
            display: block;
        }

        .sibebar-logo-link {
            margin-top: 1.5em;
        }

        .x-mark {
            display: block;
        }
    }
`

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const router = useRouter()

    return (
        <Container isOpen={isOpen}>
            <p className="sidebar-title">Felina Wallet &#169;</p>
            <Link
                href="/"
                className="sibebar-logo-link"
                onClick={toggleSidebar}
            >
                <img className="sidebar-logo" src="../../VF01455.png" />
            </Link>
            <MdClose onClick={toggleSidebar} className="x-mark" />
            <Divider />
            <div>
                {routesItems.map(({ title, url, cName }, i) => (
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
                            {title}
                        </Link>
                    </div>
                ))}
            </div>
        </Container>
    )
}

export default Sidebar
