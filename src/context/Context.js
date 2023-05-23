import { createContext, useState, useEffect } from "react"

const Context = createContext()

const ContextProvider = ({ children }) => {
    const [openModal, setOpenModal] = useState(false)
    const [openRemoveOwnerModal, setOpenRemoveOwnerModal] = useState(false)
    const [openAddOwnerModal, setOpenAddOwnerModal] = useState(false)
    const [openCreateTransactionModal, setOpenCreateTransactionModal] =
        useState(false)
    const [windowWidth, setWindowWidth] = useState(0)
    const toggleModal = () => setOpenModal(!openModal)
    const toggleRemoveOwnerModal = () =>
        setOpenRemoveOwnerModal(!openRemoveOwnerModal)
    const toggleAddOwnerModal = () => setOpenAddOwnerModal(!openAddOwnerModal)
    const toggleCreateTransactionModal = () =>
        setOpenCreateTransactionModal(!openCreateTransactionModal)

    const handleClick = (e, id) => {
        if (e.target.id === id) {
            e.target.children[0].className.baseVal = "icon hidden"
            e.target.children[1].className.baseVal = "icon show"
            setTimeout(() => {
                e.target.children[0].className.baseVal = "icon show"
                e.target.children[1].className.baseVal = "icon hidden"
            }, 1000)
        }
    }

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth)
        }

        handleResize()
        window.addEventListener("resize", handleResize)

        return function () {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <Context.Provider
            value={{
                openModal,
                toggleModal,
                windowWidth,
                openRemoveOwnerModal,
                toggleRemoveOwnerModal,
                openAddOwnerModal,
                toggleAddOwnerModal,
                openCreateTransactionModal,
                toggleCreateTransactionModal,
                handleClick,
            }}
        >
            {children}
        </Context.Provider>
    )
}

export { Context, ContextProvider }
