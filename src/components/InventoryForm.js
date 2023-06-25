import React, { useEffect, useState } from "react"
import { useDatabase } from "../contexts/DatabaseContext"
import Modal from "react-modal"
import CloseButton from "./CloseButton"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

Modal.setAppElement("#root")

export default function InventoryForm(props) {

    const [isOpen, setIsOpen] = useState(false)
    const { addInventoryItem, editInventoryItem } = useDatabase()

    const toggleModal = () => { setIsOpen(!isOpen) }

    const editMode = props.data.editMode
    const activeItem = props.data.activeItem

    const [name, setName] = useState(editMode ? activeItem.name : '')
    const [type, setType] = useState(editMode ? activeItem.type : 'Medicine')
    const [unitPrice, setUnitPrice] = useState(editMode ? activeItem.unitPrice : 1.0)
    const [stock, setStock] = useState(editMode ? activeItem.stock : 1)

    const title = editMode ? 'Edit Item' : 'Add Item'

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (editMode) {
            if (await editInventoryItem(activeItem.id, name, type, unitPrice, stock)) {
                toggleModal()
                toast.success("Item edited successfully", {
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
                toast.error("Failed to edit item. Please try again later.", {
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
        } else {
            if (await addInventoryItem(name, type, unitPrice, stock)) {
                toggleModal()
                toast.success("Item added successfully", {
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
                resetForm()
            } else {
                toast.error("Failed to add item. Please try again later.", {
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
    }

    const resetForm = () => {
        setName('')
        setType('Medicine')
        setUnitPrice(1.0)
        setStock(1)
    }

    const smallModal = {
        content: {
            left: '35%',
            right: 'auto',
            bottom: 'auto',
            width: '30%',
            padding: '40px'
        },
    };

    return (
        <div className="">
            <div>
                <button style={{ float: 'right' }} onClick={toggleModal}>
                    {title}
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
                            <label>Name</label>
                            <input value={name}
                                onChange={(e) => { setName(e.target.value) }}
                                required
                            />

                            <label style={{ marginTop: '20px' }}>Type</label>
                            <select value={type}
                                className="select-dropdown"
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value="Medicine">Medicine</option>
                                <option value="Treatment">Treatment</option>
                                <option value="Other Product">Other Product</option>
                            </select>

                            <label style={{ marginTop: '20px' }}>Unit Price (RM)</label>
                            <input value={unitPrice}
                                onChange={(e) => { setUnitPrice(e.target.value) }}
                                required
                                type="number"
                                step="0.01"
                            />

                            <label style={{ marginTop: '20px' }}>Stock Left</label>
                            <input value={stock}
                                onChange={(e) => { setStock(e.target.value) }}
                                required
                                type="number"
                            />

                            <button style={{ marginTop: '20px' }} className="button-green rounded m-2" type="submit">
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