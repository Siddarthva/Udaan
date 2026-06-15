import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import VentureWizard from './VentureWizard';

export default function GlobalOverlayManager() {
    const { activeOverlay, closeOverlay } = useUIStore();

    if (!activeOverlay) return null;

    const renderOverlay = () => {
        switch (activeOverlay) {
            case 'VENTURE_WIZARD':
                return <VentureWizard onClose={closeOverlay} />;
            default:
                return null;
        }
    };

    return (
        <AnimatePresence mode="wait">
            {renderOverlay()}
        </AnimatePresence>
    );
}
