import React, { useState } from "react"
import { useDatabase } from "../contexts/DatabaseContext"
import Modal from "react-modal"
import CloseButton from "./CloseButton"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

Modal.setAppElement("#root")

export default function DeleteConfirmation(props) {
    const [isOpen, setIsOpen] = useState(false)
    const { deleteObject } = useDatabase()

    const activeItem = props.activeItem
    const docName = props.docName

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const handleOk = async (event) => {
        event.preventDefault()
        if (await deleteObject(docName, activeItem.id)) {
            toast.success(`${activeItem.name} deleted successfully`, {
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
            toggleModal()
        } else {
            toast.error(`Failed to delete ${activeItem.name}. Please try again later.`, {
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

    const smallModal = {
        content: {
            left: "35%",
            right: "auto",
            bottom: "auto",
            width: "30%",
            padding: "40px",
        },
    }

    const title = `Delete ${activeItem.name}`

    return (
        <div className="">
            <div>
                <button style={{ float: "right" }} onClick={toggleModal}>
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
                <CloseButton name={title} func={toggleModal} />

                <div style={{ marginTop: "20px" }}>Are you sure you want to delete {activeItem.name}?</div>

                <button style={{ marginTop: "20px" }} className="button-green rounded" onClick={handleOk}>
                    OK
                </button>

                <button
                    style={{ marginTop: "20px", marginLeft: "10px" }}
                    className="button-grey rounded"
                    onClick={toggleModal}
                >
                    Cancel
                </button>
            </Modal>
            <ToastContainer limit={1} />
        </div>
    )
}
