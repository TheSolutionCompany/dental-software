import React, { useEffect, useState } from "react"
import { useDatabase } from "../contexts/DatabaseContext"
import Modal from "react-modal"
import CloseButton from "./CloseButton"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

Modal.setAppElement("#root")

export default function AddStockForm(props) {

    const [isOpen, setIsOpen] = useState(false)
    const { editInventoryItem } = useDatabase()

    const toggleModal = () => { setIsOpen(!isOpen) }

    const activeItem = props.activeItem

    const [stockToAdd, setStockToAdd] = useState(0)
    const [isStockToAddValid, setIsStockToAddValid] = useState(false)

    const smallModal = {
        content: {
            left: '35%',
            right: 'auto',
            bottom: 'auto',
            width: '30%',
            padding: '40px'
        },
    };

    const title = `Add new stock for ${activeItem.name}`

    useEffect(() => {
        let isStockToAddValid = Number.isInteger(stockToAdd) && stockToAdd >= 0
        setIsStockToAddValid(isStockToAddValid)
    }, [stockToAdd])

    const handleSubmit = async (event) => {
        event.preventDefault()
        let newStock = Number(activeItem.stock) + Number(stockToAdd)
        document.getElementById("stockToAdd").disabled = true
        document.getElementById("submitButton").disabled = true
        if (await editInventoryItem(activeItem.id, activeItem.name, activeItem.type, activeItem.unitPrice, newStock, activeItem.threshold)) {
            toggleModal()
            toast.success("Stock updated successfully", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            toast.clearWaitingQueue()
        } else {
            document.getElementById("stockToAdd").disabled = false
            document.getElementById("submitButton").disabled = false
            toast.error("Failed to update stock. Please try again later.", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            toast.clearWaitingQueue()
        }
    }

    return (
        <div className="">
            <div>
                <button style={{ float: 'right' }}
                    onClick={toggleModal}
                >
                    Add Stock
                </button>
            </div>

            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel={title}
                shouldCloseOnOverlayClick={false}
                style={smallModal}
            >
                <CloseButton name={title} func={toggleModal} />
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-1">
                        <div className="flex flex-col">
                            <input id="stockToAdd" value={stockToAdd}
                                onChange={(e) => { setStockToAdd(Number(e.target.value)); }}
                                required
                                type="number"
                            />
                            <p hidden={isStockToAddValid}
                                style={{ fontSize: '12px' }}
                            >
                                This field must be a non-negative integer.
                            </p>

                            <p style={{ fontSize: '12px' }}>Current stock: {activeItem.stock}</p>
                            <p style={{ fontSize: '12px' }}> Updated stock: {isStockToAddValid ? Number(activeItem.stock) + Number(stockToAdd) : "---"}</p>

                            <button style={{ marginTop: '20px' }}
                                className="button-green rounded"
                                type="submit"
                                id="submitButton"
                                disabled={!isStockToAddValid}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
            <ToastContainer limit={1} />
        </div>
    )
}