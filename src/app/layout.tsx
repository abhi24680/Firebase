
import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from "@/firebase";
import { DemoProvider } from "@/firebase/demo-context";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Edugo',
  description: 'Industrial-grade RFID and AI crowd-counting attendance marking system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased selection:bg-primary selection:text-primary-foreground">
        <DemoProvider>
          <FirebaseClientProvider>
            {children}
          </FirebaseClientProvider>
        </DemoProvider>
        <Toaster />
      </body>
    </html>
  );
}
