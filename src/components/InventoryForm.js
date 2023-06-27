import React, { useEffect, useState } from "react"
import { useDatabase } from "../contexts/DatabaseContext"
import Modal from "react-modal"
import CloseButton from "./CloseButton"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

Modal.setAppElement("#root")

export default function InventoryForm(props) {

    const [isOpen, setIsOpen] = useState(false)
    const { inventory, addInventoryItem, editInventoryItem } = useDatabase()

    const toggleModal = () => { setIsOpen(!isOpen) }

    const editMode = props.data.editMode
    const activeItem = props.data.activeItem

    const [name, setName] = useState(editMode ? activeItem.name : '')
    const [isNameValid, setIsNameValid] = useState(editMode)
    const [hasDuplicate, setHasDuplicate] = useState(false)

    const [type, setType] = useState(editMode ? activeItem.type : 'Medicine')
    const [isTreatmentSelected, setIsTreatmentSelected] = useState(type === 'treatment')

    const [unitPrice, setUnitPrice] = useState(editMode ? activeItem.unitPrice : 1.00)
    const [isUnitPriceValid, setIsUnitPriceValid] = useState(editMode)

    const [stock, setStock] = useState(editMode ? activeItem.stock : 1)
    const [isStockValid, setIsStockValid] = useState(editMode)

    const [threshold, setThreshold] = useState(editMode ? activeItem.threshold : 0)
    const [isThresholdValid, setIsThresholdValid] = useState(editMode)

    const [isValidInput, setIsValidInput] = useState(false)

    const title = editMode ? 'Edit Item' : 'Add Item'

    const handleSubmit = async (event) => {
        event.preventDefault()

        for (let item of inventory) {
            if (item.data().name === name && item.data().type === type) {
                setHasDuplicate(true)
                return
            }
        }

        setHasDuplicate(false)
        document.getElementById("name").disabled = true
        document.getElementById("type").disabled = true
        document.getElementById("unitPrice").disabled = true
        document.getElementById("stock").disabled = true
        document.getElementById("threshold").disabled = true
        document.getElementById("submitbutton").disabled = true

        if (editMode) {
            if (await editInventoryItem(activeItem.id, name, type, unitPrice, stock, threshold)) {
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
            if (await addInventoryItem(name, type, unitPrice, stock, threshold)) {
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
        setThreshold(0)
    }

    useEffect(() => {
        let isNameNonEmpty = (name !== '' && name !== null && name !== undefined)
        setIsNameValid(isNameNonEmpty)

        let isUnitPriceValid = Number.isInteger(unitPrice * 100) && unitPrice >= 0
        setIsUnitPriceValid(isUnitPriceValid)

        let isStockValid = Number.isInteger(stock) && stock >= 0
        setIsStockValid(isStockValid)

        let isThresholdValid = Number.isInteger(threshold) && threshold >= 0
        setIsThresholdValid(isThresholdValid)

        setIsValidInput(!(isNameNonEmpty && isUnitPriceValid && isStockValid && isThresholdValid))
    }, [name, type, unitPrice, stock, threshold])

    useEffect(() => {
        let isTreatmentSelected = type === 'Treatment'
        setIsTreatmentSelected(isTreatmentSelected)
        if (isTreatmentSelected) {
            setStock(1)
            setThreshold(0)
        }
    }, [type])

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
                <button style={{ float: 'right' }}
                    onClick={toggleModal}
                >
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
                            <input id="name" value={name}
                                onChange={(e) => { setName(e.target.value); }}
                                required
                            />
                            <p hidden={isNameValid}
                                style={{ fontSize: '12px' }}
                            >
                                Please fill in this field.
                            </p>

                            <p hidden={!hasDuplicate}
                                style={{ fontSize: '12px' }}
                            >
                                This item already exists.
                            </p>

                            <label style={{ marginTop: '20px' }}>Type</label>
                            <select id="type" value={type}
                                className="select-dropdown"
                                onChange={(e) => { setType(e.target.value); }}
                                required
                                disabled={editMode}
                            >
                                <option value="Medicine">Medicine</option>
                                <option value="Treatment">Treatment</option>
                                <option value="Other Product">Other Product</option>
                            </select>

                            <label style={{ marginTop: '20px' }}>Unit Price (RM)</label>
                            <input id="unitPrice" value={unitPrice}
                                onChange={(e) => { setUnitPrice(Number(e.target.value)); }}
                                required
                                type="number"
                                step="0.01"
                            />
                            <p hidden={isUnitPriceValid}
                                style={{ fontSize: '12px' }}
                            >
                                This field must be a non-negative number with at most two decimal points.
                            </p>

                            <label style={{ marginTop: '20px' }}
                                hidden={isTreatmentSelected}
                            >
                                Stock Left
                            </label>
                            <input id="stock" value={stock}
                                onChange={(e) => { setStock(Number(e.target.value)); }}
                                required
                                type="number"
                                hidden={isTreatmentSelected}
                            />
                            <p hidden={isStockValid}
                                style={{ fontSize: '12px' }}
                            >
                                This field must be a non-negative integer.
                            </p>

                            <label style={{ marginTop: '20px' }}
                                hidden={isTreatmentSelected}
                            >
                                Restock Threshold
                            </label>
                            <input id="threshold" value={threshold}
                                onChange={(e) => { setThreshold(Number(e.target.value)); }}
                                required
                                type="number"
                                hidden={isTreatmentSelected}
                            />
                            <p hidden={isThresholdValid}
                                style={{ fontSize: '12px' }}
                            >
                                This field must be a non-negative integer.
                            </p>

                            <button style={{ marginTop: '20px' }}
                                className="button-green rounded"
                                type="submit"
                                id="submitbutton"
                                disabled={isValidInput}
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