import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-thai",
});

export const metadata: Metadata = {
  title: "บ้านสีขาวริมโขง ธาตุพนม | ที่พักวิวแม่น้ำโขง นครพนม",
  description:
    "บ้านสีขาวริมโขง ธาตุพนม ที่พักสไตล์รีสอร์ทโมเดิร์น วิวแม่น้ำโขง ใกล้พระธาตุพนม จองผ่านไลน์ได้ทันที",
  keywords: ["ที่พักธาตุพนม", "โรงแรมนครพนม", "ที่พักริมโขง", "บ้านสีขาวริมโขง"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${notoThai.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
