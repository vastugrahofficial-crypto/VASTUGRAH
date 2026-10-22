import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
// Add page imports here
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Panchang from "@/pages/Panchang";
import Kundli from "@/pages/Kundli";
import Horoscope from "@/pages/Horoscope";
import AiAstrologer from "@/pages/AiAstrologer";
import ConsultationChat from "@/pages/ConsultationChat";
import ConsultationCall from "@/pages/ConsultationCall";
import Reports from "@/pages/Reports";
import KnowRudraksha from "@/pages/KnowRudraksha";
import KnowGemstone from "@/pages/KnowGemstone";

const AuthenticatedApp = () => {
    const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

    // Show loading spinner while checking app public settings or auth
    if (isLoadingPublicSettings || isLoadingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Handle authentication errors
    if (authError) {
        if (authError.type === 'user_not_registered') {
            return <UserNotRegisteredError />;
        } else if (authError.type === 'auth_required') {
            // Redirect to login automatically
            navigateToLogin();
            return null;
        }
    }

    // Render the main app
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
                        <Route path="/panchang" element={<Panchang />} />
                        <Route path="/kundli" element={<Kundli />} />
                        <Route path="/horoscope" element={<Horoscope />} />
                        <Route path="/ai-astrologer" element={<AiAstrologer />} />
                    </Route>
                    <Route path="/consultation/chat" element={<ConsultationChat />} />
                    <Route path="/consultation/call" element={<ConsultationCall />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/know-your-rudraksha" element={<KnowRudraksha />} />
                    <Route path="/know-your-gemstone" element={<KnowGemstone />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <FloatingWhatsApp />
        </>
    );
};


function App() {

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
                <Router>
                    <ScrollToTop />
                    <AuthenticatedApp />
                </Router>
                <Toaster />
            </QueryClientProvider>
        </AuthProvider>
    )
}

export default App