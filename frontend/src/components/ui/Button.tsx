interface ButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

export default function Button({ text, onClick, className = '', disabled = false }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`text-white px-6 py-2 w-full
                ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 cursor-pointer'} 
                ${className}`}
            disabled={disabled}
        >
            {text}
        </button>
    );
};
