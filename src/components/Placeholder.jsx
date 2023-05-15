import styled from "styled-components"
import { FiWifiOff } from "react-icons/fi"
import { MdSignalWifiConnectedNoInternet4 } from "react-icons/md"
import { TbPlugConnectedX, TbWalletOff } from "react-icons/tb"
import { ImBlocked } from "react-icons/im"

const Div = styled.div`
    margin: 6em auto 0;
    max-width: 650px;
    border: medium dashed #e8e8e8;
    border-radius: 30px;
    padding: 3em 2em 3em 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    line-height: 1.4;

    .icons-container {
        display: flex;
        gap: 10px;
    }

    .icons {
        font-size: 18px;
    }

    p {
        font-weight: 500;
        font-size: 0.9rem;
    }

    @media (min-width: 530px) {
        p {
            font-size: 1.2rem;
        }

        .icons {
            font-size: 22px;
        }
    }
`

const Placeholder = () => {
    return (
        <Div>
            <div className="icons-container">
                <FiWifiOff className="icons" />
                <MdSignalWifiConnectedNoInternet4 className="icons" />
                <TbPlugConnectedX className="icons" />
                <TbWalletOff className="icons" />
                <ImBlocked className="icons" />
            </div>
            <p>
                Please, <span>connect your wallet</span> to Ethereum Sepolia
                (11155111) to launch the app.
            </p>
        </Div>
    )
}

export default Placeholder
