import { useNavigate } from "react-router";
import AuthHeader from "../../components/AuthHeader";
import CreditCardIcon from "../../components/CreditCardIcon";
import FeatureCard from "../../components/FeatureCard";
import LedgerIcon from "../../components/icons/LedgerIcon";
import TransferArrowsIcon from "../../components/icons/TransferArrowsIcon";
import ShieldIcon from "../../components/icons/ShieldIcon";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full overflow-hidden" style={{ background: "linear-gradient(135deg, #fff4f0 0%, #fff0f4 30%, #f5f6fc 65%, #f0f8fe 100%)" }}>

            {/* Floating header — fixed with space from the top and sides */}
            <div className="hidden sm:block fixed top-4 left-4 right-4 z-50">
                <AuthHeader
                    onLoginClick={() => navigate("/auth?mode=login")}
                    onGetStartedClick={() => navigate("/auth?mode=register")}
                />
            </div>

            {/* Hero Section — pt-32 clears the floating header */}
            <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden pt-10 sm:pt-32">



                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-brand-primary-50 text-brand-primary-600 text-sm font-medium px-4 py-1.5 rounded-full border border-brand-primary-200">
                        {/* Credit card icon */}
                        <CreditCardIcon />
                        Built for Nigerian traders
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                        Digitizing Nigeria's
                        <br />
                        <span className="text-slate-900">informal </span>
                        <span className="text-brand-primary-500">credit economy</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-500 text-base sm:text-lg max-w-md leading-relaxed">
                        Record debts. Generate instant payment options. Clear disputes. All from your phone.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto">
                        <button className="cursor-pointer w-full sm:w-auto bg-brand-primary-500 hover:bg-brand-primary-600 active:bg-brand-primary-700 text-white font-semibold px-6 py-4 rounded-xl transition-colors shadow-sm text-sm sm:text-base">
                            Get Started Free
                        </button>
                        <button className="cursor-pointer w-full sm:w-auto text-slate-700 hover:text-brand-primary-500 font-semibold px-6 py-4 rounded-xl border border-slate-200 hover:border-brand-primary-300 transition-colors text-sm sm:text-base bg-white">
                            Log in
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full py-20 px-6">
                <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">

                    {/* Section heading */}
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center">
                        Everything you need to manage credit
                    </h2>

                    {/* Feature cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full px-5">
                        <FeatureCard
                            icon={<LedgerIcon />}
                            title="Record Debts"
                            description="Log customer debts instantly with amounts, due dates, and notes. Never lose track again."
                        />
                        <FeatureCard
                            icon={<TransferArrowsIcon />}
                            title="Generate Payment Options"
                            description="Auto-generate USSD codes, bank transfers, card links, and QR codes for each debt."
                        />
                        <FeatureCard
                            icon={<ShieldIcon />}
                            title="Track & Resolve"
                            description="Monitor repayments in real-time. Send reminders. Clear disputes with full transaction history."
                        />
                    </div>
                </div>
            </section>

        </div>

    );
};

export default Landing;
