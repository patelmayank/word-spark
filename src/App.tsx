import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import GalleryPage from "./pages/GalleryPage";
import SubmitQuotePage from "./pages/SubmitQuotePage";
import MyQuotesPage from "./pages/MyQuotesPage";
import QuoteDetailPage from "./pages/QuoteDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/quote/:id" element={<QuoteDetailPage />} />
            <Route 
              path="/submit" 
              element={
                <ProtectedRoute>
                  <SubmitQuotePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-quotes" 
              element={
                <ProtectedRoute>
                  <MyQuotesPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
