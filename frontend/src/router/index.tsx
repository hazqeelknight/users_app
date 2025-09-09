import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Module routes (to be imported from each module)
const usersRoutes = React.lazy(() => import('@/users/routes'));
const eventsRoutes = React.lazy(() => import('@/events/routes'));
const availabilityRoutes = React.lazy(() => import('@/availability/routes'));
const integrationsRoutes = React.lazy(() => import('@/integrations/routes'));
const notificationsRoutes = React.lazy(() => import('@/notifications/routes'));
const contactsRoutes = React.lazy(() => import('@/contacts/routes'));
const workflowsRoutes = React.lazy(() => import('@/workflows/routes'));

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  
  // Protected routes with layout
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: <Navigate to="/" replace />,
  },
  
  // Module routes
  {
    path: '/users/*',
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            {React.createElement(usersRoutes)}
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/events/*',
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            {React.createElement(eventsRoutes)}
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/availability/*',
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            {React.createElement(availabilityRoutes)}
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/integrations/*',
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            {React.createElement(integrationsRoutes)}
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/notifications/*',
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            {React.createElement(notificationsRoutes)}
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/contacts/*',
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            {React.createElement(contactsRoutes)}
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/workflows/*',
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            {React.createElement(workflowsRoutes)}
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
  },
  
  // 404 page
  {
    path: '*',
    element: <NotFound />,
  },
]);