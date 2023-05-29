import { ethers } from "ethers"

export const encoder = (ABI, functionName, data) => {
    const iface = new ethers.utils.Interface(ABI)
    const encodedData = iface.encodeFunctionData(functionName, data)

    return encodedData
}

export const handleClick = (e, id) => {
    if (e.target.id === id) {
        e.target.children[0].className.baseVal = "icon hidden"
        e.target.children[1].className.baseVal = "icon show"
        setTimeout(() => {
            e.target.children[0].className.baseVal = "icon show"
            e.target.children[1].className.baseVal = "icon hidden"
        }, 1000)
    }
}
