import { ethers } from "ethers"

export const encoder = (ABI, functionName, data) => {
    const iface = new ethers.utils.Interface(ABI)
    const encodedData = iface.encodeFunctionData(functionName, data)

    return encodedData
}
