

interface AuthSelectorProps {
    activePage: "signin" | "signup";
    onSelect: (page: "signin" | "signup") => void;
}

const AuthSelector = ({ activePage, onSelect }: AuthSelectorProps) => {
    return (
        <div className="bg-slate-200  rounded-full p-1 flex">
            <button
                onClick={() => onSelect("signin")}
                className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all cursor-pointer duration-200 ${activePage === "signin"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                    }`}
            >
                Sign in
            </button>
            <button
                onClick={() => onSelect("signup")}
                className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all cursor-pointer duration-200 ${activePage === "signup"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                    }`}
            >
                Register
            </button>
        </div>
    );
};

export default AuthSelector;