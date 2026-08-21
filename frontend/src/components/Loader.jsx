import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/helpers";

export default function Loader({ fullScreen = false, text = "Loading...", className = "" }) {
    if (fullScreen) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <Loader2 className="h-8 w-8 text-gray-900 animate-spin mb-3" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{text}</p>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center justify-center p-4", className)}>
            <Loader2 className="h-6 w-6 text-gray-900 animate-spin" />
        </div>
    );
}
export { Loader };
