import { promises as fs } from "fs"
// import path from "path"
// import { cwd } from "process"

const handler = async (req, res) => {
    if (req.method !== "PUT") {
        res.status(405).send({
            message: "Only PUT requests allowed",
        })
        return
    }

    let tokensDetails
    // const tokensDetailsDirectory = path.join(
    //     cwd(),
    //     "src/database/tokensDetails.json"
    // )

    try {
        tokensDetails = JSON.parse(
            await fs.readFile("./src/database/tokensDetails.json", {
                encoding: "utf8",
            })
        )
    } catch (e) {
        const error = e.toString()
        res.status(400).json({ error })
    }

    try {
        const { tokenAddress, newTokenBalance, network } = req.body

        const index = tokensDetails.tokensDetails.findIndex(
            (tokenDetail) =>
                tokenDetail.contract_addresses[network] === tokenAddress
        )

        if (newTokenBalance && tokenAddress && network) {
            tokensDetails.tokensDetails[index].tokenBalance = newTokenBalance

            await fs.writeFile(
                "./src/database/tokensDetails.json",
                JSON.stringify(tokensDetails)
            )
        }

        res.status(201).json({ success: true })
    } catch (e) {
        const error = e.toString()
        res.status(400).json({ error })
    }
}

export default handler
