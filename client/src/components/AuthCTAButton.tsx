interface AuthCTAButtonProps {
    label: string;
    disabled?: boolean;
}

const AuthCTAButton = ({ label, disabled }: AuthCTAButtonProps) => {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="cursor-pointer w-full bg-[#fbbf24] hover:bg-[#f59e0b] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-black uppercase tracking-widest py-4 rounded-2xl transition-all border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] mt-2"
        >
            {label}
        </button>
    );
};

export default AuthCTAButton;
