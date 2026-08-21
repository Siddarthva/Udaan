import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
            <div className="space-y-4 max-w-md">
                <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
                <h2 className="text-xl font-bold text-gray-800">Page Not Found</h2>
                <p className="text-xs text-gray-500">
                    The requested path does not exist or has been relocated.
                </p>
                <Button onClick={() => navigate("/dashboard")}>
                    Return to Dashboard
                </Button>
            </div>
        </div>
    );
}
