import { MoralisProvider } from "react-moralis"
import { Web3ContextProvider } from "@/context/Web3Context"
import Layout from "@/components/Layout"
import "@/styles/globals.css"

const App = ({ Component, pageProps }) => {
    return (
        <MoralisProvider initializeOnMount={false}>
            <Web3ContextProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </Web3ContextProvider>
        </MoralisProvider>
    )
}

export default App
