

interface AuthSelectorProps {
    activePage: "signin" | "signup";
    onSelect: (page: "signin" | "signup") => void;
}

const AuthSelector = ({ activePage, onSelect }: AuthSelectorProps) => {
    return (
        <div className="bg-white border-[3px] border-slate-900 rounded-2xl flex overflow-hidden shadow-[4px_4px_0px_#0f172a]">
            <button
                onClick={() => onSelect("signin")}
                className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all cursor-pointer ${activePage === "signin"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-900 hover:bg-slate-50"
                    }`}
            >
                Sign in
            </button>
            <button
                onClick={() => onSelect("signup")}
                className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all cursor-pointer border-l-[3px] border-slate-900 ${activePage === "signup"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-900 hover:bg-slate-50"
                    }`}
            >
                Register
            </button>
        </div>
    );
};

export default AuthSelector;