import { RefreshCcw } from "lucide-react";
import "./Modal.style.css";

interface ModalProps {
    winOrLose: boolean;
    isOpen: boolean;
    playerName: string;
    onRestart: () => void;
    onSubmitScore: (name: string) => void;
    onNameChange: (name: string) => void;
}

export function Modal({
    winOrLose,
    isOpen,
    onRestart,
    playerName,
    onSubmitScore,
    onNameChange,
}: ModalProps) {
    if (!isOpen) return null;
    return (
        <div className="modalOverlay" role="presentation">
            <div className="modalContent" role="dialog" aria-modal="true">
                <h2 className="modalTitle">
                    {winOrLose ? "You Win!" : "Game Over"}
                </h2>
                {winOrLose && (
                    <form
                        className="modalForm"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmitScore(playerName);
                        }}
                    >
                        <input
                            className="modalInput"
                            type="text"
                            placeholder="Enter your name"
                            value={playerName}
                            onChange={(e) => onNameChange(e.target.value)}
                        />
                        <button type="submit" className="modalSubmitButton">
                            Submit Score
                        </button>
                    </form>
                )}
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
