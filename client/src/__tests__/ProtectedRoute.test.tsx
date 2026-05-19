import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProtectedRoute from '../components/ProtectedRoute';
import * as authHook from '../hooks/useAuth';

vi.mock('../hooks/useAuth');

describe('ProtectedRoute', () => {
  const renderRoute = (allowedRoles?: string[]) => {
    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={<div>Home Page</div>} />
          <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  it('shows loading state initially', () => {
    // @ts-ignore
    vi.mocked(authHook.useAuth).mockReturnValue({ loading: true, user: null, hasRole: vi.fn() });
    renderRoute();
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('redirects to login if user is not authenticated', () => {
    // @ts-ignore
    vi.mocked(authHook.useAuth).mockReturnValue({ loading: false, user: null, hasRole: vi.fn() });
    renderRoute();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders outlet if user is authenticated and no specific roles are required', () => {
    // @ts-ignore
    vi.mocked(authHook.useAuth).mockReturnValue({
      loading: false,
      user: { id: 1, email: 'test@example.com', role: 'JURY' },
      hasRole: vi.fn().mockReturnValue(true)
    });
    renderRoute();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to HOME if user is authenticated but lacks required role', () => {
    // @ts-ignore
    vi.mocked(authHook.useAuth).mockReturnValue({
      loading: false,
      user: { id: 1, email: 'test@example.com', role: 'JURY' },
      hasRole: vi.fn().mockReturnValue(false)
    });
    renderRoute(['ADMIN']);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders outlet if user has required role', () => {
    // @ts-ignore
    vi.mocked(authHook.useAuth).mockReturnValue({
      loading: false,
      user: { id: 1, email: 'test@example.com', role: 'ADMIN' },
      hasRole: vi.fn().mockImplementation((roles) => roles.includes('ADMIN'))
    });
    renderRoute(['ADMIN']);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
