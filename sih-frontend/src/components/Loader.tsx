import { useState, useEffect } from "react";

const loadingSteps = [
    "Getting Your Profile...",
    "Matching Your Profile with Jobs...",
    "Curating Jobs Especially for You...",
    "Almost There..."
];

export default function FancyLoader({ isLoading }: { isLoading: Boolean }) {
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % loadingSteps.length);
        }, 2500); // Change message every 2.5 seconds

        return () => clearInterval(interval);
    }, [isLoading]);

    if (!isLoading) return null;

    return (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
            {/* Animated Dot Spinner */}
            <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 bg-blue-600 rounded-full animate-bounce`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                ))}
            </div>

            {/* Step Message */}
            <p className="text-gray-700 text-lg font-medium animate-pulse">
                {loadingSteps[stepIndex]}
            </p>
        </div>
    );
}
