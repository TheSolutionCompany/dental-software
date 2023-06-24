import React, { useEffect, useState } from "react"
import { useDatabase } from "../contexts/DatabaseContext"
import Modal from "react-modal"
import CloseButton from "./CloseButton"

Modal.setAppElement("#root")

export default function DeleteConfirmation(props) {

    const [isOpen, setIsOpen] = useState(false)
    const {deleteObject} = useDatabase()
    
    const activeItem = props.activeItem
    const docName = props.docName

    const toggleModal = () => {setIsOpen(!isOpen)}

    const handleOk = async (event) => {
        event.preventDefault()
        if(await deleteObject(docName, activeItem.id)) {
            alert(`Successfully deleted ${activeItem.name}!`)
            toggleModal()
        }else{
            alert(`Failed to delete ${activeItem.name}. Please try again later.`)
        }
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

    const title = `Delete ${activeItem.name}`

    return (
        <div className="">
            <div>
                <button style={{ float: 'right' }} onClick={toggleModal}>
                    Delete
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

                <div style={{marginTop: '20px'}}>
                Are you sure you want to delete {activeItem.name}?
                </div>

                <button style={{ marginTop: '20px' }} className="button-green rounded" onClick={handleOk}>
                    OK
                </button>

                <button style={{ marginTop: '20px', marginLeft: '10px' }} className="button-grey rounded" onClick={toggleModal}>
                    Cancel
                </button>
            </Modal>
        </div>
    )
}