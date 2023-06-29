import React, { useEffect, useState } from "react";
import { useDatabase } from "../contexts/DatabaseContext";
import Modal from "react-modal";
import CloseButton from "./CloseButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

export default function EmployeeDetailForm(props) {
    const [isOpen, setIsOpen] = useState(false);
    const { employee, addEmployee, editEmployee } = useDatabase();

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const editMode = props.data.editMode;
    const activeEmployee = props.data.activeEmployee;

    const [displayName, setDisplayName] = useState(editMode ? activeEmployee.displayName : "");
    const [isDisplayNameValid, setIsDisplayNameValid] = useState(editMode);

    const [email, setEmail] = useState(editMode ? activeEmployee.email : "");
    const [isEmailValid, setIsEmailValid] = useState(editMode);
    const [isEmailEmpty, setIsEmailEmpty] = useState(!editMode);

    const [password, setPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const [position, setPosition] = useState(editMode ? activeEmployee.position : "Doctor");

    const [isValidInput, setIsValidInput] = useState(false);

    const title = editMode ? "Edit Employee" : "Add New Employee";

    const smallModal = {
        content: {
            left: "35%",
            right: "auto",
            bottom: "auto",
            width: "30%",
            padding: "40px",
        },
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        document.getElementById("name").disabled = true;
        document.getElementById("position").disabled = true;
        

        if (editMode) {
            if (await editEmployee(activeEmployee.id, displayName, position)) {
                toggleModal();
                toast.success("Employee edited successfully", {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                toast.clearWaitingQueue();
            } else {
                document.getElementById("name").disabled = false;
                document.getElementById("email").disabled = false;
                toast.error("Failed to edit item. Please try again later.", {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                toast.clearWaitingQueue();
            }
        } else {
            document.getElementById("email").disabled = true;
            document.getElementById("password").disabled = true;
            if (await addEmployee(displayName, email, position, password)) {
                toggleModal();
                toast.success("Employee added successfully", {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                toast.clearWaitingQueue();
                resetForm();
            } else {
                document.getElementById("name").disabled = false;
                document.getElementById("email").disabled = false;
                document.getElementById("position").disabled = false;
                document.getElementById("password").disabled = false;
                toast.error("Failed to add item. Please try again later.", {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                toast.clearWaitingQueue();
            }
        }
    };

    const resetForm = () => {
        setDisplayName("");
        setPosition("Doctor");
        setEmail("");
        setPassword("");
    };

    useEffect(() => {
        let isNameNonEmpty = displayName !== "" && displayName !== null && displayName !== undefined;
        setIsDisplayNameValid(isNameNonEmpty);

        let isEmailNonEmpty = editMode || (email !== "" && email !== null && email !== undefined);
        setIsEmailEmpty(!isEmailNonEmpty);
        let isEmailValid = isEmailNonEmpty && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        setIsEmailValid(isEmailValid);

        // pls change to regex tqvm
        let isPasswordValid = editMode || (password !== "" && password !== null && password !== undefined);
        setIsPasswordValid(isPasswordValid);

        setIsValidInput(!(isNameNonEmpty && isEmailValid && isPasswordValid));
    }, [displayName, email, password, position]);

    return (
        <div className="">
            <div>
                <button onClick={toggleModal}>{title}</button>
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
                            <input
                                id="name"
                                value={displayName}
                                onChange={(e) => {
                                    setDisplayName(e.target.value);
                                }}
                                required
                            />
                            <p hidden={isDisplayNameValid} style={{ fontSize: "12px" }}>
                                Please fill in this field.
                            </p>

                            <label style={{ marginTop: "20px" }}>Type</label>
                            <select
                                id="position"
                                value={position}
                                className="select-dropdown"
                                onChange={(e) => {
                                    setPosition(e.target.value);
                                }}
                                required
                            >
                                <option value="Doctor">Doctor</option>
                                <option value="Locum Doctor">Locum Doctor</option>
                                <option value="Receptionist">Receptionist</option>
                                <option value="Administrator">Administrator</option>
                            </select>

                            <label style={{ marginTop: "20px" }} hidden={editMode}>Email</label>
                            <input
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                required
                                type="email"
                                hidden={editMode}
                            />
                            <p hidden={!isEmailEmpty || editMode} style={{ fontSize: "12px" }}>
                                Please fill in this field.
                            </p>
                            <p hidden={isEmailEmpty || isEmailValid || editMode} style={{ fontSize: "12px" }}>
                                The format of the email is not correct.
                            </p>

                            <label hidden={editMode} style={{ marginTop: "20px" }}>
                                Password
                            </label>
                            <input
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                type="password"
                                hidden={editMode}
                            />
                            <p hidden={isPasswordValid || editMode} style={{ fontSize: "12px" }}>
                                The password must satisfy the following requirements: ...
                            </p>

                            <button
                                style={{ marginTop: "20px" }}
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
    );
}
