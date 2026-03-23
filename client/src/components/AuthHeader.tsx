import { Link } from "react-router";
import CreditCardIcon from "./CreditCardIcon";

interface AuthHeaderProps {
    onLoginClick: () => void;
    onGetStartedClick: () => void;
}

const AuthHeader = ({ onLoginClick, onGetStartedClick }: AuthHeaderProps) => {
    return (
        <nav className="w-full px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
            <Link to="/landing" className="flex items-center gap-2">
                <span className="text-brand-primary-500">
                    <CreditCardIcon />
                </span>
                <span className="text-xl font-bold">
                    <span className="text-slate-900">Kredit</span>
                    <span className="text-brand-primary-500">Kard</span>
                </span>
            </Link>
            <div className="flex items-center gap-4">
                <button
                    onClick={onLoginClick}
                    className="cursor-pointer text-xs sm:text-sm text-slate-500 hover:text-brand-primary-500 font-medium transition-colors px-2 sm:px-3 py-1.5 rounded-lg hover:bg-brand-primary-50"
                >
                    Log in
                </button>
                <button
                    onClick={onGetStartedClick}
                    className="cursor-pointer text-xs sm:text-sm bg-brand-primary-500 hover:bg-brand-primary-600 text-white font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
                >
                    Get Started
                </button>
            </div>
        </nav>
    );
};

export default AuthHeader;
