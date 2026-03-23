import { useState } from "react";
import AuthCTAButton from "../../components/AuthCTAButton";

const Signup = () => {
    const [form, setForm] = useState({ businessName: "", phone: "", password: "" });

    return (
        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-business" className="text-sm font-medium text-slate-700">
                    Business Name
                </label>
                <input
                    id="signup-business"
                    type="text"
                    placeholder="Storekeeper"
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
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:border-transparent transition-all"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-password" className="text-sm font-medium text-slate-700">
                    Password
                </label>
                <input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:border-transparent transition-all"
                />
            </div>
            <AuthCTAButton label="Create Account" />
        </form>
    );
};

export default Signup;