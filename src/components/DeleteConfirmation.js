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

    const docName = props.docName
    const activeItemId = props.activeItemId
    const activeItemName = props.activeItemName

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const handleOk = async (event) => {
        event.preventDefault()
        if (await deleteObject(docName, activeItemId)) {
            toast.success(`Item deleted successfully`, {
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
            toast.error(`Failed to delete item. Please try again later.`, {
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

    const title = `Delete Item`

    return (
        <div className="">
            <div>
                <button onClick={toggleModal} className="hover:text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
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

                <div style={{ marginTop: "20px" }}>
                    Are you sure you want to delete <strong>{activeItemName}</strong>?
                </div>

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
