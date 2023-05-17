import { promises as fs } from "fs"
import path from "path"
import { cwd } from "process"

const handler = async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests allowed" })
        return
    }

    let transactionsDescriptions
    const transactionsDescriptionsDirectory = path.join(
        cwd(),
        "src/database/transactionsDescriptions.json"
    )

    try {
        transactionsDescriptions = JSON.parse(
            await fs.readFile(transactionsDescriptionsDirectory, {
                encoding: "utf8",
            })
        )
    } catch (error) {
        const e = error.toString()
        res.status(400).json({ e })
    }

    if (req.method === "POST") {
        try {
            const { id, description } = req.body
            console.log(transactionsDescriptions)
            transactionsDescriptions[id] = description
            await fs.writeFile(
                transactionsDescriptionsDirectory,
                JSON.stringify(transactionsDescriptions)
            )
            res.status(201).json({ success: true })
        } catch (error) {
            const e = error.toString()
            res.status(400).json({ e })
        }
    }
}

export default handler
