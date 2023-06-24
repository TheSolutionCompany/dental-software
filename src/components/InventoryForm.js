import React, { useEffect, useState } from "react"
import { useDatabase } from "../contexts/DatabaseContext"
import Modal from "react-modal"
import CloseButton from "./CloseButton"

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
                alert("Successfully edited item!")
                resetForm()
            } else {
                alert("Failed to edit item. Please try again later.")
            }
        } else {
            if (await addInventoryItem(name, type, unitPrice, stock)) {
                toggleModal()
                alert("Successfully added item!")
                resetForm()
            } else {
                alert("Failed to add item. Please try again later.")
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
                <div style={{ display: 'inline-flex', width: '100%' }}>
                    <div style={{ float: 'left', width: '80%', marginTop: '-10px' }}>
                        <h1 style={{ fontSize: 28, fontWeight: 500 }}>{title}</h1>
                    </div>
                    <div style={{ float: 'right', width: '20%' }}>
                        <CloseButton func={toggleModal} />
                    </div>
                </div>
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
        </div>
    )
}