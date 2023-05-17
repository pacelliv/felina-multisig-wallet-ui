import { promises as fs } from "fs"
// import path from "path"
// import { cwd } from "process"

const handler = async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests allowed" })
        return
    }

    let transactionsDescriptions
    // const transactionsDescriptionsDirectory = path.join(
    //     cwd(),
    //     "./src/database/transactionsDescriptions.json"
    // )

    try {
        transactionsDescriptions = JSON.parse(
            await fs.readFile("./src/database/transactionsDescriptions.json", {
                encoding: "utf8",
            })
        )
    } catch (error) {
        const e = error.toString()
        res.status(400).send({ e })
    }

    if (req.method === "POST") {
        try {
            const { id, description } = req.body
            transactionsDescriptions[id] = description
            await fs.writeFile(
                "./src/database/transactionsDescriptions.json",
                JSON.stringify(transactionsDescriptions)
            )
            res.status(201).send({ success: true })
        } catch (error) {
            const e = error.toString()
            res.status(400).send({ e })
        }
    }
}

export default handler
