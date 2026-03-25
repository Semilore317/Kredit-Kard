import { useState } from "react";
import AuthCTAButton from "../../components/AuthCTAButton";
import apiClient from "../../api/client";
import { useNavigate } from "react-router";

const Signup = () => {
    const [form, setForm] = useState({ name: "", phone: "", business_name: "", pin: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await apiClient.post("/auth/register", {
                name: form.name,
                phone: form.phone,
                business_name: form.business_name,
                pin: form.pin
            });
            // Auto login after signup
            const loginRes = await apiClient.post("/auth/login", {
                phone: form.phone,
                pin: form.pin
            });
            localStorage.setItem("token", loginRes.data.access_token);
            navigate("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || "Registration failed. Try a different phone.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
                <div className="p-4 bg-red-50 border-[3px] border-red-900 text-red-900 text-sm font-black uppercase tracking-tight rounded-xl">
                    Error: {error}
                </div>
            )}
            
            <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</label>
                <input
                    type="text"
                    placeholder="Mama Titi"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-14 px-4 rounded-xl border-[3px] border-slate-200 focus:border-slate-900 focus:ring-0 text-slate-900 text-lg font-bold placeholder:text-slate-300 transition-all shadow-sm outline-none"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Business Name</label>
                <input
                    type="text"
                    placeholder="Mama Titi's Store"
                    value={form.business_name}
                    onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                    className="w-full h-14 px-4 rounded-xl border-[3px] border-slate-200 focus:border-slate-900 focus:ring-0 text-slate-900 text-lg font-bold placeholder:text-slate-300 transition-all shadow-sm outline-none"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Phone Number</label>
                <input
                    type="text"
                    placeholder="08012345678"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-14 px-4 rounded-xl border-[3px] border-slate-200 focus:border-slate-900 focus:ring-0 text-slate-900 text-lg font-bold placeholder:text-slate-300 transition-all shadow-sm outline-none"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">PIN (4 Digits)</label>
                <input
                    type="password"
                    inputMode="numeric"
                    placeholder="••••"
                    value={form.pin}
                    onChange={(e) => setForm({ ...form, pin: e.target.value })}
                    className="w-full h-14 px-4 rounded-xl border-[3px] border-slate-200 focus:border-slate-900 focus:ring-0 text-slate-900 text-lg font-bold placeholder:text-slate-300 transition-all shadow-sm outline-none"
                    required
                />
            </div>

            <div className="mt-4">
                <AuthCTAButton label={isLoading ? "Registering..." : "Create Account"} disabled={isLoading} />
            </div>
        </form>
    );
};

export default Signup;