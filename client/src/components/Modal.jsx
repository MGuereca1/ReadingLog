import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal(props){
    const { isOpen, onClose, title, children, size = 'medium'} = props

    if(!isOpen) return null

    // handle clicking outside of modal to close
    const handleBackdropClick = (e) =>{
        if (e.target === e.currentTarget){
            onClose()
        }
    }

    // handle escape key to close
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [onClose])

    return(
        <div className='modal-backdrop' onClick={handleBackdropClick}>
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                {/* modal header */}
                <div className='modal-header'>
                    <h2 className='modal-tile'>{title}</h2>
                    <button onClick={onClose} className='modal-close-btn' aria-label='Close Modal'>
                    <X className='close-icon'/>
                    </button>
                </div>
            {/* modal body */}
            {children}
            </div>

        </div>
    )
}