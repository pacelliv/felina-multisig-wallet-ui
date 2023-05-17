import { promises as fs } from "fs"
// import path from "path"
// import { cwd } from "process"
import { transactionsDescriptions } from "@/database"

const handler = async (req, res) => {
    if (req.method !== "POST" && req.method !== "GET") {
        res.status(405).send({ message: "Only GET and POST requests allowed" })
        return
    }

    //let transactionsDescriptions
    // const transactionsDescriptionsDirectory = path.join(
    //     cwd(),
    //     "./src/database/transactionsDescriptions.json"
    // )

    // try {
    //     transactionsDescriptions = JSON.parse(
    //         await fs.readFile("./src/database/transactionsDescriptions.json", {
    //             encoding: "utf-8",
    //         })
    //     )
    // } catch (error) {
    //     const e = error.toString()
    //     res.status(400).send({ e })
    // }

    if (req.method === "POST") {
        try {
            const { id, description } = req.body
            transactionsDescriptions[id] = description
            await fs.writeFile(
                "./src/database/transactionsDescriptions.json",
                JSON.stringify(transactionsDescriptions)
            )
            res.status(201).send({ success: true })
        } catch (e) {
            const error = e.toString()
            res.status(400).send({ error })
        }
    } else if (req.method === "GET") {
        try {
            res.status(200).json(transactionsDescriptions)
        } catch (e) {
            const error = e.toString()
            res.status(400).send({ error })
        }
    }
}

export default handler
