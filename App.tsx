import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-green-50">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-orange-500 via-white to-green-600 border-b-4 border-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl animate-pulse">🇮🇳</div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Immigration Tracking System</h1>
              <p className="text-sm text-blue-700 font-medium">Government of India • भारत सरकार</p>
            </div>
          </div>
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        </div>
      </header>
      
      <main className="flex-1">
        <Authenticated>
          <Dashboard />
        </Authenticated>
        
        <Unauthenticated>
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🇮🇳</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Immigration Officer Portal
                </h2>
                <p className="text-gray-600">
                  Secure access to visa monitoring system
                </p>
              </div>
              <SignInForm />
            </div>
          </div>
        </Unauthenticated>
      </main>
      
      {/* Footer with Helpline Information */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
              <span>📞</span> Need Help? Emergency Contacts
            </h3>
            <p className="text-blue-200">24/7 Support for International Visitors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-800/50 rounded-lg">
              <div className="text-2xl mb-2">🏛️</div>
              <h4 className="font-semibold mb-1">Immigration Helpline</h4>
              <p className="text-lg font-bold text-orange-300">1800-111-555</p>
              <p className="text-xs text-blue-200">Visa & Immigration Queries</p>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster position="top-right" />
    </div>
  );
}
