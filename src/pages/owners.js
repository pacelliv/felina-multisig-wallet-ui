import Meta from "@/components/Meta"
import { walletAbi } from "../constants/index"
import { useState, useContext, useEffect } from "react"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { useWeb3Contract } from "react-moralis"
import { Web3Context } from "@/context/Web3Context"
import styled from "styled-components"
import RemoveOwnerModal from "../components/RemoveOwnerModal"
import AddOwnerModal from "../components/AddOwnerModal"

const Container = styled.div`
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 20;
    }
`

const Div = styled.div`
    .owners-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 20px;
    }

    .owner-card {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0.4em 0;
        border-radius: 10px;
        padding: 1.2em 1em 1.2em 0.9em;
        background-color: #ffead0;
        color: #4d4d4d;
    }

    .owner-jazzicon {
        width: 35px;
    }

    .owner {
        width: calc(100% - 35px);
    }

    .owner-title {
        font-size: 0.91rem;
        font-weight: 500;
    }

    .owner-address {
        margin-top: 0.3em;
        font-weight: 600;
        font-size: 0.95rem;
        word-wrap: break-word;
    }

    @media (max-width: 781px) {
        .owner-card {
            margin: 0;
        }
    }
`

const Title = styled.h1`
    margin-top: 1.2em;
    font-size: 1.8rem;
`

const ButtonsContainer = styled.div`
    margin: 0.8em 0;
    display: flex;
    flex-direction: row;
    gap: 15px;

    .button {
        padding: 0.5em 1em;
        border-radius: 5px;
        border: none;
        font-size: 1rem;
        font-weight: 500;
        color: #ffead0;
        transition: 200ms all cubic-bezier(0.4, 0, 0.2, 1);
    }

    .button:disabled {
        cursor: default;
    }

    .celurean {
        background-color: #4c7a93;
    }

    .celurean:hover:not([disabled]) {
        background-color: #2d4856;
    }

    .purple {
        background-color: #782859;
    }

    .purple:hover:not([disabled]) {
        background-color: #421832;
    }
`

const Owners = () => {
    const { contractAddress, isWeb3Enabled } = useContext(Web3Context)
    const [openRemoveOwnerModal, setOpenRemoveOwnerModal] = useState(false)
    const [openAddOwnerModal, setOpenAddOwnerModal] = useState(false)

    const [owners, setOwners] = useState([])
    const [loading, setLoading] = useState(false)

    const { runContractFunction: getOwners } = useWeb3Contract({
        abi: walletAbi,
        contractAddress,
        functionName: "getOwners",
        params: {},
    })

    const updateOwnersUI = async () => {
        let ownersFromContractCall
        try {
            setLoading(true)
            ownersFromContractCall = await getOwners()
        } catch (error) {
            console.log(error)
        } finally {
            setOwners(ownersFromContractCall)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            const fetchOwners = async () => {
                await updateOwnersUI()
            }
            fetchOwners().catch((error) => console.log(error))
        }
    }, [isWeb3Enabled])

    return (
        <Container>
            <Meta title={"Multisig Wallet | Owners"} />
            {openRemoveOwnerModal && (
                <RemoveOwnerModal
                    openRemoveOwnerModal={openRemoveOwnerModal}
                    setOpenRemoveOwnerModal={setOpenRemoveOwnerModal}
                />
            )}
            {openAddOwnerModal && (
                <AddOwnerModal
                    openAddOwnerModal={openAddOwnerModal}
                    setOpenAddOwnerModal={setOpenAddOwnerModal}
                />
            )}
            <div
                className={
                    openRemoveOwnerModal || openAddOwnerModal
                        ? "modal-backdrop"
                        : ""
                }
            ></div>
            <Div>
                <Title>Current list of owners:</Title>
                <ButtonsContainer>
                    <button
                        onClick={() => setOpenAddOwnerModal(!openAddOwnerModal)}
                        className="button celurean"
                        disabled={openRemoveOwnerModal || openAddOwnerModal}
                    >
                        Add owner
                    </button>
                    <button
                        onClick={() =>
                            setOpenRemoveOwnerModal(!openRemoveOwnerModal)
                        }
                        className="button purple"
                        disabled={openRemoveOwnerModal || openAddOwnerModal}
                    >
                        Remove Owner
                    </button>
                </ButtonsContainer>
                {owners && (
                    <div className="owners-wrapper">
                        {owners.map((owner, i) => (
                            <div className="owner-card" key={i}>
                                <div className="owner-jazzicon">
                                    <Jazzicon
                                        diameter={35}
                                        seed={jsNumberForAddress(owner)}
                                    />
                                </div>
                                <div className="owner">
                                    <p className="owner-title">Owner ID: {i}</p>
                                    <p className="owner-address">{owner}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {loading && (
                    <div className="owner-card">
                        <p>Loading...</p>
                    </div>
                )}
            </Div>
        </Container>
    )
}

export default Owners
