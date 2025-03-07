import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Header from "@/components/ui/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "PathVise-AI Career Coach",
  description: "PathVise-AI Career Coach is an AI-powered platform that provides personalized career guidance, resume optimization, and skill development to help individuals achieve their professional goals.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${inter.className} `}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          {/* header */}
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          {/* footer */}
          <footer className="bg-muted/50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-200">
              <p>Made by PathVise Team</p>
            </div>
          </footer>
          </ThemeProvider>
        


    
          
      </body>
    </html>
    </ClerkProvider>
  );
}
