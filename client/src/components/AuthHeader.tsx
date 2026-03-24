import { Link } from "react-router";
import CreditCardIcon from "./CreditCardIcon";

interface AuthHeaderProps {
    onLoginClick: () => void;
    onGetStartedClick: () => void;
}

const AuthHeader = ({ onLoginClick, onGetStartedClick }: AuthHeaderProps) => {
    return (
        /* Outer strip — brand color acts as the "outer ring" of the double border */
        <div className="w-full  px-3 sm:px-5 py-2.5 rounded-full">
            {/* Inner pill — white card that "floats" inside the colored strip */}
            <nav className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between  bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-md">
                <Link to="/landing" className="flex items-center gap-2">
                    <span className="text-brand-primary-500">
                        <CreditCardIcon />
                    </span>
                    <span className="text-xl font-bold">
                        <span className="text-slate-900">Kredit</span>
                        <span className="text-brand-primary-500">Kard</span>
                    </span>
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onLoginClick}
                        className="cursor-pointer text-xs sm:text-sm text-slate-500 hover:text-brand-primary-500 font-medium transition-colors px-3 py-1.5 rounded-full border border-slate-200 hover:border-brand-primary-300 hover:bg-brand-primary-50"
                    >
                        Log in
                    </button>
                    <button
                        onClick={onGetStartedClick}
                        className="cursor-pointer text-xs sm:text-sm bg-brand-primary-500 hover:bg-brand-primary-600 text-white font-semibold px-4 py-1.5 rounded-full transition-colors shadow-sm"
                    >
                        Get Started
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default AuthHeader;
