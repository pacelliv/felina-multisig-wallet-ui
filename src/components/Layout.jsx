import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import Status from "./Status"
import styled from "styled-components"
import { useState } from "react"

const Container = styled.div`
    display: grid;
    grid-template-columns: 250px auto;
    height: 100vh;
    padding: 1em 0.9em;

    .content-wrapper {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        background-color: #212121;
        border-radius: 10px;

        /* width */
        ::-webkit-scrollbar {
            width: 12px;
            transition: all 0.4s ease;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background: transparent;
            margin-top: 50px;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: #333;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    }

    .content {
        padding: 0 1.35em 1em;
        margin: 0.7em;
    }

    @media (max-width: 870px) {
        .content {
            padding: 0 0.8em 1em;
        }
    }

    @media (max-width: 450px) {
        margin-bottom: 2.5em;
    }

    @media (max-width: 895px) {
        grid-template-columns: min-content auto;
    }
`

const Layout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
        <Container>
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className="content-wrapper">
                <Navbar toggleSidebar={toggleSidebar} />
                <div className="content">
                    <Status />
                    <main>{children}</main>
                </div>
            </div>
        </Container>
    )
}

export default Layout
