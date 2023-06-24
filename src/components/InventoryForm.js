import React, { useEffect, useState } from "react"
import { useDatabase } from "../contexts/DatabaseContext"
import Modal from "react-modal"
import CloseButton from "./CloseButton"

Modal.setAppElement("#root")

export default function InventoryForm (props) {

    const [isOpen, setIsOpen] = useState(false)
    const {addInventoryItem} = useDatabase()

    const toggleModal = () => {setIsOpen(!isOpen)}

    return (
        <div className="">
            <div>
                <button style={{float: 'right'}} onClick={toggleModal}>
                    {props.data.editMode ? 'Edit' : 'Add Item'}
                </button>
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel={props.data.editMode ? 'Edit Item' : 'Add Item'}
                shouldCloseOnOverlayClick={false}
            >
                <CloseButton func={toggleModal} />
            </Modal>
        </div>
    )
}