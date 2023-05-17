import { promises as fs } from "fs"
// import path from "path"
// import { cwd } from "process"
import { nftsDetails } from "@/database"

const getIndex = (nftsDetails, nftAddress, tokenId) => {
    return nftsDetails.nftsDetails.findIndex(
        (nftDetail) =>
            nftDetail.nftAddress === nftAddress && nftDetail.tokenId === tokenId
    )
}

const handler = async (req, res) => {
    if (req.method !== "POST" && req.method !== "DELETE") {
        res.status(405).send({
            message: "Only POST and DELETE requests allowed",
        })
        return
    }

    // let nftsDetails
    // const nftsDetailsDirectory = path.join(
    //     cwd(),
    //     "src/database/nftsDetails.json"
    // )

    // try {
    //     nftsDetails = JSON.parse(
    //         await fs.readFile("./src/database/nftsDetails.json", {
    //             encoding: "utf8",
    //         })
    //     )
    // } catch (e) {
    //     const error = e.toString()
    //     res.status(400).send({ error })
    // }

    if (req.method === "POST") {
        try {
            const {
                nftAddress,
                collectionName,
                tokenUri,
                tokenId,
                tokenSymbol,
            } = req.body
            const index = getIndex(nftsDetails, nftAddress, tokenId)

            if (index === -1) {
                nftsDetails.nftsDetails.push({
                    nftAddress,
                    collectionName,
                    tokenId,
                    tokenSymbol,
                    tokenUri,
                })

                await fs.writeFile(
                    "./src/database/nftsDetails.json",
                    JSON.stringify(nftsDetails)
                )

                res.status(201).send({
                    message: "token stored",
                    success: true,
                })
            } else {
                res.status(400).send({
                    message: "this token is already stored",
                    success: false,
                })
            }
        } catch (e) {
            const error = e.toString()
            res.status(400).send({ error, success: false })
        }
    } else {
        try {
            const { nftAddress, tokenId } = req.query
            const index = getIndex(nftsDetails, nftAddress, tokenId)

            if (index != -1) {
                nftsDetails.nftsDetails.splice(index, 1)

                await fs.writeFile(
                    "./src/database/nftsDetails.json",
                    JSON.stringify(nftsDetails)
                )

                res.status(201).json({
                    message: "token deleted",
                    success: true,
                })
            } else {
                res.status(201).json({
                    message:
                        "token not owned by the wallet, no operation performed",
                    success: true,
                })
            }
        } catch (e) {
            const error = e.toString()
            res.status(400).json({ error, success: false })
        }
    }
}

export default handler
