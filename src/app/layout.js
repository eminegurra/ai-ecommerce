import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from '@/components/ChatWidget';
import { CartProvider } from '@/context/CartContext'; // ✅ Import the cart context

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShopAi",
  description: "Created by Emine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {children}
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
