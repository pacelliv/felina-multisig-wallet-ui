import Head from "next/head"

const Meta = ({ title, keywords, description }) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="keywords" content={keywords} />
            <meta name="description" content={description} />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <meta charSet="utf-8" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}

Meta.defaultProps = {
    title: "Multisig Wallet",
    keywords: "smart contract, multisig, wallet, transactions, nft",
    description:
        "UI for a multisig wallet that supports ERC20 and ERC721 tokens",
}

export default Meta
