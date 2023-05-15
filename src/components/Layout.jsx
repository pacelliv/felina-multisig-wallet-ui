import { useContext, useState } from "react"
import { Web3Context } from "../context/Web3Context"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import Status from "./Status"
import Footer from "./Footer"
import Placeholder from "./Placeholder"
import styled from "styled-components"

const Container = styled.div`
    display: grid;
    grid-template-columns: 250px auto;

    .content-wrapper {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow-y: scroll;
    }

    .content {
        padding: 0 2em;
        margin-bottom: 2.5em;
    }

    @media (max-width: 870px) {
        .content {
            padding: 0 0.8em;
        }
    }

    @media (max-width: 870px) {
        grid-template-columns: auto;
    }
`

const Layout = ({ children }) => {
    const { chainId } = useContext(Web3Context)
    const isConnected = chainId === 11155111 || chainId === 31337
    const [isOpen, setIsOpen] = useState(false)
    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
        <Container>
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className="content-wrapper">
                <Navbar toggleSidebar={toggleSidebar} />
                {isConnected ? (
                    <div className="content">
                        <Status />
                        <main>{children}</main>
                    </div>
                ) : (
                    <div className="content">
                        <Placeholder />
                    </div>
                )}
                <Footer />
            </div>
        </Container>
    )
}

export default Layout
