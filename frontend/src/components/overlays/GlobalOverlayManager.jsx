import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import AuditDrawer from './AuditDrawer';
import DossierViewer from './DossierViewer';
import ScenarioSimulator from './ScenarioSimulator';
import SessionScheduler from './SessionScheduler';
import VentureWizard from './VentureWizard';
import DealWizard from './DealWizard';
import DiscoveryWizard from './DiscoveryWizard';
import RegistryViewer from './RegistryViewer';
import ComplianceConsole from './ComplianceConsole';

import ImpactMap from './ImpactMap';

export default function GlobalOverlayManager() {
    const { activeOverlay, overlayData, closeOverlay } = useUIStore();

    if (!activeOverlay) return null;

    const renderOverlay = () => {
        switch (activeOverlay) {
            case 'AUDIT_DRAWER':
                return <AuditDrawer onClose={closeOverlay} />;
            case 'DOSSIER_VIEWER':
                return <DossierViewer data={overlayData} onClose={closeOverlay} />;
            case 'SCENARIO_SIMULATOR':
                return <ScenarioSimulator onClose={closeOverlay} />;
            case 'SCHEDULE_SESSION':
                return <SessionScheduler data={overlayData} onClose={closeOverlay} />;
            case 'VENTURE_WIZARD':
                return <VentureWizard onClose={closeOverlay} />;
            case 'DEAL_WIZARD':
                return <DealWizard onClose={closeOverlay} />;
            case 'DISCOVERY_WIZARD':
                return <DiscoveryWizard onClose={closeOverlay} />;
            case 'REGISTRY_VIEWER':
                return <RegistryViewer onClose={closeOverlay} />;
            case 'COMPLIANCE_CONSOLE':
                return <ComplianceConsole onClose={closeOverlay} />;
            case 'IMPACT_MAP':
                return <ImpactMap onClose={closeOverlay} />;
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
