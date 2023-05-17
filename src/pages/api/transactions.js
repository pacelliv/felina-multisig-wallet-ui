import { promises as fs } from "fs"
// import path from "path"
// import { cwd } from "process"
import { transactionsDetails } from "@/database"

const handler = async (req, res) => {
    if (req.method !== "POST" && req.method !== "PUT" && req.method !== "GET") {
        res.status(405).send({
            message: "Only GET, POST and PUT requests allowed",
        })
        return
    }

    // let transactionsDetails
    // const transactionsDetailsDirectory = path.join(
    //     cwd(),
    //     "src/database/transactionsDetails.json"
    // )

    // try {
    //     transactionsDetails = JSON.parse(
    //         await fs.readFile("./src/database/transactionsDetails.json", {
    //             encoding: "utf8",
    //         })
    //     )
    // } catch (e) {
    //     const error = e.toString()
    //     res.status(400).send({ error })
    // }

    if (req.method === "POST") {
        try {
            const transaction = req.body
            const index = transactionsDetails.transactionsDetails.findIndex(
                (transactionDetail) => transactionDetail.id === transaction.id
            )

            if (index === -1) {
                transactionsDetails.transactionsDetails.push(transaction)
                await fs.writeFile(
                    "./src/database/transactionsDetails.json",
                    JSON.stringify(transactionsDetails)
                )
            }

            res.status(201).send({ success: true })
        } catch (e) {
            const error = e.toString()
            res.status(400).send({ error })
        }
    } else if (req.method === "PUT") {
        try {
            const { id } = req.body

            const index = transactionsDetails.transactionsDetails.findIndex(
                (transactionDetail) => transactionDetail.id === id
            )

            transactionsDetails.transactionsDetails[index].executed = true
            await fs.writeFile(
                "./src/database/transactionsDetails.json",
                JSON.stringify(transactionsDetails)
            )
            res.status(201).send({ success: true })
        } catch (e) {
            const error = e.toString()
            res.status(400).send({ error })
        }
    } else if (req.method === "GET") {
        try {
            res.status(200).json(transactionsDetails.transactionsDetails)
        } catch (e) {
            const error = e.toString()
            res.status(400).send({ error })
        }
    }
}

export default handler
