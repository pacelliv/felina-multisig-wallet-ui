import { TbArrowsLeftRight } from "react-icons/tb"
import { MdOutlineToken } from "react-icons/md"
import { BsFillPeopleFill } from "react-icons/bs"
import { BiImages } from "react-icons/bi"

export const routesItems = [
    {
        title: "Transactions",
        icon: <TbArrowsLeftRight />,
        url: "/",
        cName: "sidebar-links",
    },
    {
        title: "Owners",
        icon: <BsFillPeopleFill />,
        url: "/owners",
        cName: "sidebar-links",
    },
    {
        title: "ERC20",
        icon: <MdOutlineToken />,
        url: "/tokens",
        cName: "sidebar-links",
    },
    {
        title: "NFT",
        icon: <BiImages />,
        url: "/nfts",
        cName: "sidebar-links",
    },
]
