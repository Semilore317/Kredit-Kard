import { useState } from "react";
import AuthCTAButton from "../../components/AuthCTAButton";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store/store";
import { registerTrader, loginTrader } from "../../store/slices/authSlice";
import { useNavigate } from "react-router";

const Signup = () => {
    const [form, setForm] = useState({ name: "", businessName: "", phone: "", pin: "" });
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { status, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const action = await dispatch(registerTrader({
            name: form.name,
            business_name: form.businessName,
            phone: form.phone,
            pin: form.pin
        }));
        if (registerTrader.fulfilled.match(action)) {
            // Automatically log the user in after successful registration
            const loginAction = await dispatch(loginTrader({
                phone: form.phone,
                pin: form.pin
            }));
            
            if (loginTrader.fulfilled.match(loginAction)) {
                navigate("/app");
            }
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm">{error}</div>}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-name" className="text-sm font-medium text-slate-700">
                    Full Name
                </label>
                <input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:border-transparent transition-all"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-business" className="text-sm font-medium text-slate-700">
                    Business Name
                </label>
                <input
                    id="signup-business"
                    type="text"
                    placeholder="Storekeeper"
                    required
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:border-transparent transition-all"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-phone" className="text-sm font-medium text-slate-700">
                    Phone Number
                </label>
                <input
                    id="signup-phone"
                    type="tel"
                    placeholder="08031234567"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:border-transparent transition-all"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-pin" className="text-sm font-medium text-slate-700">
                    4-Digit PIN
                </label>
                <input
                    id="signup-pin"
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    required
                    value={form.pin}
                    onChange={(e) => setForm({ ...form, pin: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:border-transparent transition-all"
                />
            </div>
            <AuthCTAButton label={status === 'loading' ? 'Creating...' : 'Create Account'} />
        </form>
    );
};

export default Signup;