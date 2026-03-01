import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProviders } from "./app/Providers";
import { AppRoutes } from "./app/Routes";
import { Toaster } from "react-hot-toast";

/**
 * Root Application: Entry with global providers and routing.
 * Features: Toast notifications, Theme handling, Context restoration.
 */
export default function App() {
  return (
    <Router>
      <AppProviders>
        <AppRoutes />

        {/* Professional Global Feedback */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#1A1F23',
              borderRadius: '12px',
              border: '1px solid #F1F1F1',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              fontSize: '12.5px',
              fontWeight: '600',
              padding: '12px 16px'
            }
          }}
        />
      </AppProviders>
    </Router>
  );
}
