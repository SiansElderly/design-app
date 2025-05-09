import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Spinner, Alert, Button } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import AppNavbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import React from 'react';

const ServiceList = lazy(() => import('./pages/ServiceList'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function AppRouter() {
  return (
    <HashRouter>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <AppNavbar />
        <main className="flex-grow-1">
          <Breadcrumbs />
          <Suspense fallback={
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          }>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<ServiceList />} />
                <Route path="/services" element={<ServiceList />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryWrapper>
      {children}
    </ErrorBoundaryWrapper>
  );
}

class ErrorBoundaryWrapper extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger" className="m-3">
          <Alert.Heading>Произошла ошибка</Alert.Heading>
          <p>{this.state.error?.message || 'Неизвестная ошибка'}</p>
          <Button 
            variant="outline-danger" 
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Попробовать снова
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}