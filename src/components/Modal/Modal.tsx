import { RefreshCcw } from "lucide-react";
import "./Modal.style.css";

interface ModalProps {
    winOrLose: boolean;
    isOpen: boolean;
    onRestart: () => void;
}

export function Modal({ winOrLose, isOpen, onRestart }: ModalProps) {
    if (!isOpen) return null;
    return (
        <div className="modalOverlay" role="presentation">
            <div className="modalContent" role="dialog" aria-modal="true">
                <h2 className="modalTitle">
                    {winOrLose ? "You Win!" : "Game Over"}
                </h2>
                <button
                    type="button"
                    className="modalResetButton"
                    onClick={onRestart}
                >
                    <RefreshCcw size={18} />
                    Play again
                </button>
            </div>
        </div>
    );
}
