import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import DocsLayout from './components/DocsLayout';
import Home from './pages/Home';
import QuickStart from './pages/docs/QuickStart';
import IntegratorRegistration from './pages/docs/IntegratorRegistration';
import CompanyRegistration from './pages/docs/CompanyRegistration';
import Messaging from './pages/docs/Messaging';
import Webhooks from './pages/docs/Webhooks';
import E2EEncryption from './pages/docs/E2EEncryption';
import RichMessages from './pages/docs/RichMessages';
import Media from './pages/docs/Media';
import Presence from './pages/docs/Presence';
import KeyTransfer from './pages/docs/KeyTransfer';
import AuthReference from './pages/docs/AuthReference';
import ErrorHandling from './pages/docs/ErrorHandling';
import SdkReference from './pages/docs/SdkReference';
import SampleIntegrator from './pages/docs/SampleIntegrator';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/docs',
    element: <DocsLayout />,
    children: [
      { index: true, element: <Navigate to="/docs/quickstart" replace /> },
      // Getting Started
      { path: 'quickstart', element: <QuickStart /> },
      { path: 'integrator-registration', element: <IntegratorRegistration /> },
      { path: 'company-registration', element: <CompanyRegistration /> },
      // Guides
      { path: 'messaging', element: <Messaging /> },
      { path: 'webhooks', element: <Webhooks /> },
      { path: 'e2e-encryption', element: <E2EEncryption /> },
      { path: 'rich-messages', element: <RichMessages /> },
      { path: 'media', element: <Media /> },
      { path: 'presence', element: <Presence /> },
      { path: 'key-transfer', element: <KeyTransfer /> },
      // Reference
      { path: 'auth', element: <AuthReference /> },
      { path: 'errors', element: <ErrorHandling /> },
      { path: 'sdk', element: <SdkReference /> },
      { path: 'sample-integrator', element: <SampleIntegrator /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];
