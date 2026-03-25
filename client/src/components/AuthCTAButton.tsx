interface AuthCTAButtonProps {
    label: string;
    disabled?: boolean;
}

const AuthCTAButton = ({ label, disabled }: AuthCTAButtonProps) => {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="cursor-pointer w-full bg-brand-primary-500 hover:bg-brand-primary-600 active:bg-brand-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors mt-1"
        >
            {label}
        </button>
    );
};

export default AuthCTAButton;
