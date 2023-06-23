import React from 'react'

const CloseButton = ({name, func}) => {
    return (
        <div className="flex justify-between items-start">
            <p className="pb-10 text-3xl font-bold underline decoration-blue-500">{name}</p>
            <button onClick={func}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}

export default CloseButton