// Public API for the auth feature module
export { AuthProvider } from './auth.context';
export { useAuth } from './use-auth';
export { LoginPage } from './components/LoginPage';
export { AuthGuard } from './components/AuthGuard';
export { RoleGuard } from './components/RoleGuard';
export { authApi } from './auth.api';
export type { AuthUser, LoginRequest, SignupRequest } from './auth.types';
