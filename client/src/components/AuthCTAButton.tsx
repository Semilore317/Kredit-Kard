interface AuthCTAButtonProps {
    label: string;
}

const AuthCTAButton = ({ label }: AuthCTAButtonProps) => {
    return (
        <button
            type="submit"
            className="cursor-pointer w-full bg-brand-primary-500 hover:bg-brand-primary-600 active:bg-brand-primary-700 text-white font-semibold py-3 rounded-xl transition-colors mt-1"
        >
            {label}
        </button>
    );
};

export default AuthCTAButton;
