import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "vculture",
    description: "vculture - Stories that matter",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="el" suppressHydrationWarning>
            <body className="antialiased bg-background text-foreground">
                <div className="noise-overlay" />
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
