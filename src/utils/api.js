export const addTransactionDetail = async (transaction) => {
    try {
        await fetch(
            "https://felina-multisig-wallet-ui.vercel.app/api/transactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transaction),
            }
        )
    } catch (error) {
        console.log(error)
    }
}

export const updateTransactionDetail = async (id) => {
    try {
        await fetch(
            "https://felina-multisig-wallet-ui.vercel.app/api/transactions",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            }
        )
    } catch (error) {
        console.log(error)
    }
}

export const addNftDetail = async (nftDetail) => {
    try {
        await fetch("https://felina-multisig-wallet-ui.vercel.app/api/nfts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(nftDetail),
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteNftDetail = async (nftAddress, tokenId) => {
    try {
        await fetch(
            `https://felina-multisig-wallet-ui.vercel.app/api/nfts?nftAddress=${nftAddress}&tokenId=${tokenId}`,
            {
                method: "DELETE",
            }
        )
    } catch (error) {
        console.log(error)
    }
}

export const addTransactionDescription = async (id, description) => {
    try {
        await fetch(
            "https://felina-multisig-wallet-ui.vercel.app/api/descriptions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, description }),
            }
        )
    } catch (error) {
        console.log(error)
    }
}
