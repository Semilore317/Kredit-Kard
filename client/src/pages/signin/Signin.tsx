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
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
                <div className="p-3 bg-red-50 border-2 border-red-200 text-red-700 text-xs font-bold rounded-xl">
                    {error}
                </div>
            )}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="signin-email" className="text-sm font-medium text-slate-700">
                    Phone Number
                </label>
                <input
                    id="signin-email"
                    type="text"
                    placeholder="08012345678"
                    value={form.emailOrPhone}
                    onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:border-transparent transition-all"
                    required
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="signin-password" className="text-sm font-medium text-slate-700">
                    PIN (4 Digits)
                </label>
                <input
                    id="signin-password"
                    type="password"
                    inputMode="numeric"
                    placeholder="••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:border-transparent transition-all"
                    required
                />
            </div>
            <AuthCTAButton label={isLoading ? "Signing in..." : "Sign in"} disabled={isLoading} />
        </form>
    );
};

export default Signin;