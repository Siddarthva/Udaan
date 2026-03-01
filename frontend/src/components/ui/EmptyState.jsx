import React from "react";

export const EmptyState = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center w-full bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            {Icon && (
                <div className="mb-4 h-12 w-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400">
                    <Icon size={24} />
                </div>
            )}
            <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
};
