import { useState } from "react";
import { useNavigate } from "react-router";
import AuthCTAButton from "../../components/AuthCTAButton";
import apiClient from "../../api/client";

const Signin = () => {
    const [form, setForm] = useState({ emailOrPhone: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await apiClient.post("/auth/login", {
                phone: form.emailOrPhone,
                pin: form.password
            });
            
            localStorage.setItem("token", response.data.access_token);
            navigate("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || "Authentication failed. Check your PIN.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {error && (
                <div className="p-4 bg-red-50 border-[3px] border-red-900 text-red-900 text-sm font-black uppercase tracking-tight rounded-xl">
                    Error: {error}
                </div>
            )}
            <div className="flex flex-col gap-2">
                <label htmlFor="signin-email" className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Phone Number
                </label>
                <input
                    id="signin-email"
                    type="text"
                    placeholder="08012345678"
                    value={form.emailOrPhone}
                    onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
                    className="w-full h-14 px-4 rounded-xl border-[3px] border-slate-200 focus:border-slate-900 focus:ring-0 text-slate-900 text-lg font-bold placeholder:text-slate-300 transition-all shadow-sm"
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="signin-password" className="text-xs font-black uppercase tracking-widest text-slate-500">
                    PIN (4 Digits)
                </label>
                <input
                    id="signin-password"
                    type="password"
                    inputMode="numeric"
                    placeholder="••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full h-14 px-4 rounded-xl border-[3px] border-slate-200 focus:border-slate-900 focus:ring-0 text-slate-900 text-lg font-bold placeholder:text-slate-300 transition-all shadow-sm"
                    required
                />
            </div>
            <div className="mt-2 text-slate-900">
                <AuthCTAButton label={isLoading ? "Signing in..." : "Sign in"} disabled={isLoading} />
            </div>
        </form>
    );
};

export default Signin;