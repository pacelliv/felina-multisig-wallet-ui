export const addTransactionDetail = async (transaction) => {
    try {
        const res = await fetch("/api/transactionsDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transaction),
        })
        const requestResponse = await res.json()
        // console.log(requestResponse)
    } catch (error) {
        console.log(error)
    }
}

export const updateTransactionDetail = async (id) => {
    try {
        const res = await fetch("/api/transactionsDetails", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })
        const requestResponse = await res.json()
        // console.log(requestResponse)
    } catch (error) {
        console.log(error)
    }
}

/* @TODO: remove this API call or find a usecase */
export const updateTokenBalance = async (
    tokenAddress,
    newTokenBalance,
    network
) => {
    try {
        const res = await fetch("/api/tokensDetails", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tokenAddress, newTokenBalance, network }),
        })
        const requestResponse = await res.json()
        // console.log(requestResponse)
    } catch (error) {
        console.log(error)
    }
}

export const addNftDetail = async (nftDetail) => {
    try {
        const res = await fetch("/api/nftsDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(nftDetail),
        })

        const requestResponse = await res.json()
        // console.log(requestResponse)
    } catch (error) {
        console.log(error)
    }
}

export const deleteNftDetail = async (nftAddress, tokenId) => {
    try {
        const res = await fetch(
            `/api/nftsDetails?nftAddress=${nftAddress}&tokenId=${tokenId}`,
            {
                method: "DELETE",
            }
        )
        const requestResponse = await res.json()
        // console.log(requestResponse)
    } catch (error) {
        console.log(error)
    }
}

export const addTransactionDescription = async (id, description) => {
    try {
        const res = await fetch("/api/transactionsDescriptions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, description }),
        })

        const requestResponse = await res.json()
        // console.log(requestResponse)
    } catch (error) {
        console.log(error)
    }
}
