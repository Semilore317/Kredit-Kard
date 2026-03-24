import { type ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-brand-primary-100 items-center">
            <div className="w-10 h-10 rounded-xl bg-brand-primary-50 flex items-center justify-center">
                {icon}
            </div>
            <div className="text-center">
                <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

export default FeatureCard;
