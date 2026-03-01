import React from "react";
import { ScrollProgressBar } from "./LayoutPrimitives";

export const ScrollableLayout = ({ children, showProgress = true }) => {
    return (
        <div className="relative w-full overflow-x-hidden">
            {showProgress && <ScrollProgressBar />}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
};
