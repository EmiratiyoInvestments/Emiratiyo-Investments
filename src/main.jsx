import React from 'react';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './App.jsx';
import './index.css';
const queryClient = new QueryClient();
const container = document.getElementById('root');
const appRoot = <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <App />
    </QueryClientProvider>
  </StrictMode>;
if (container.hasChildNodes()) {
  hydrateRoot(container, appRoot);
} else {
  createRoot(container).render(appRoot);
}
