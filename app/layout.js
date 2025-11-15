import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import dynamic from "next/dynamic";
import { AdminModeProvider } from "../contexts/AdminModeContext";
import { EditModeProvider } from "../contexts/EditModeContext";
import { ContentProvider } from "../contexts/ContentContext";
import EditModeToggle from "../components/EditModeToggle";

// Lazy load Footer (está below-the-fold)
const Footer = dynamic(() => import("../components/Footer"), {
  loading: () => <div className="bg-[#23262C] h-96" />,
  ssr: true
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "City Soccer",
  description: "City Soccer Chile",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AdminModeProvider>
          <EditModeProvider>
            <ContentProvider>
              <Navigation />
              
              {/* Main content with responsive padding for navigation */}
              {/* Mobile: top padding | Desktop: left padding */}
              <main className="pt-[72px] md:pt-0 md:pl-20 transition-all duration-[382ms]">
                {children}
              </main>
              
              <Footer />
              
              {/* Botón flotante para activar modo edición (solo para admins) */}
              <EditModeToggle />
            </ContentProvider>
          </EditModeProvider>
        </AdminModeProvider>
      </body>
    </html>
  );
}