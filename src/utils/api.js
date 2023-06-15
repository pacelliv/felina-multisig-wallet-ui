const url =
    process.env.NEXT_PUBLIC_DEV === "server"
        ? "http://localhost:3333"
        : "https://felina-multisig-wallet-api.p.rapidapi.com"

export const getPendingTransactions = async () => {
    try {
        const res = await fetch(`${url}/api/transactions`, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.NEXT_PUBLIC_X_RAPID_API_HOST,
            },
            credentials: "omit",
        })

        const { transactionsDetails } = await res.json()

        if (transactionsDetails) {
            const filteredTransactions = transactionsDetails.filter(
                (detail) => !detail.executed
            )
            return filteredTransactions
        }
    } catch (error) {
        console.log(error)
    }
}

export const addTransactionDetail = async (transaction) => {
    try {
        await fetch(`${url}/api/transactions`, {
            method: "POST",
            headers: {
                "X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.NEXT_PUBLIC_X_RAPID_API_HOST,
                "Content-Type": "application/json",
            },
            mode: "cors",
            credentials: "omit",
            body: JSON.stringify(transaction),
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateTransactionDetail = async (id) => {
    try {
        await fetch(`${url}/api/transactions`, {
            method: "PUT",
            headers: {
                "X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.NEXT_PUBLIC_X_RAPID_API_HOST,
                "Content-Type": "application/json",
            },
            mode: "cors",
            credentials: "omit",
            body: JSON.stringify({ id }),
        })
    } catch (error) {
        console.log(error)
    }
}

export const getNfts = async () => {
    try {
        const res = await fetch(`${url}/api/nfts`, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.NEXT_PUBLIC_X_RAPID_API_HOST,
            },
            credentials: "omit",
        })
        const { nfts } = await res.json()
        return nfts
    } catch (error) {
        console.log(error)
    }
}

export const addNftDetail = async (nftDetail) => {
    try {
        await fetch(`${url}/api/nfts`, {
            method: "POST",
            headers: {
                "X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.NEXT_PUBLIC_X_RAPID_API_HOST,
                "Content-Type": "application/json",
            },
            mode: "cors",
            credentials: "omit",
            body: JSON.stringify(nftDetail),
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteNftDetail = async (nftAddress, tokenId) => {
    try {
        await fetch(`${url}/?nftAddress=${nftAddress}&tokenId=${tokenId}`, {
            method: "DELETE",
            headers: {
                "X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.NEXT_PUBLIC_X_RAPID_API_HOST,
            },
            mode: "cors",
            credentials: "omit",
        })
    } catch (error) {
        console.log(error)
    }
}

export const addTransactionDescription = async (id, description) => {
    try {
        await fetch(`${url}/api/descriptions`, {
            method: "POST",
            headers: {
                "X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.NEXT_PUBLIC_X_RAPID_API_HOST,
                "Content-Type": "application/json",
            },
            mode: "cors",
            credentials: "omit",
            body: JSON.stringify({ id, description }),
        })
    } catch (error) {
        console.log(error)
    }
}
