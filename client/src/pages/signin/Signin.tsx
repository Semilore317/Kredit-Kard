import { useState } from "react";
import AuthCTAButton from "../../components/AuthCTAButton";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store/store";
import { loginTrader } from "../../store/slices/authSlice";
import { useNavigate } from "react-router";

const Signin = () => {
    const [form, setForm] = useState({ phone: "", pin: "" });
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { status, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const action = await dispatch(loginTrader({ phone: form.phone, pin: form.pin }));
        if (loginTrader.fulfilled.match(action)) {
            navigate("/app");
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm">{error}</div>}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="signin-phone" className="text-sm font-medium text-slate-700">
                    Phone Number
                </label>
                <input
                    id="signin-phone"
                    type="tel"
                    placeholder="08031234567"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:border-transparent transition-all"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="signin-pin" className="text-sm font-medium text-slate-700">
                    4-Digit PIN
                </label>
                <input
                    id="signin-pin"
                    type="password"
                    placeholder="••••"
                    required
                    maxLength={4}
                    value={form.pin}
                    onChange={(e) => setForm({ ...form, pin: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:border-transparent transition-all"
                />
            </div>
            <AuthCTAButton label={status === 'loading' ? 'Signing in...' : 'Sign in'} />
        </form>
    );
};

export default Signin;