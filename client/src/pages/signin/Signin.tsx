import { useState } from "react";
import AuthCTAButton from "../../components/AuthCTAButton";

const Signin = () => {
    const [form, setForm] = useState({ emailOrPhone: "", password: "" });

    return (
        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="signin-email" className="text-sm font-medium text-slate-700">
                    Email or Phone
                </label>
                <input
                    id="signin-email"
                    type="text"
                    placeholder="08031234567"
                    value={form.emailOrPhone}
                    onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:border-transparent transition-all"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="signin-password" className="text-sm font-medium text-slate-700">
                    Password
                </label>
                <input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:border-transparent transition-all"
                />
            </div>
            <AuthCTAButton label="Sign in" />
        </form>
    );
};

export default Signin;