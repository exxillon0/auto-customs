import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

// Настраиваем шрифт
const manrope = Manrope({ 
  subsets: ["latin", "cyrillic"], // Обязательно добавляем кириллицу
  variable: "--font-manrope",     // Создаем CSS-переменную
  display: "swap",
});

export const metadata: Metadata = {
  title: "Калькулятор растаможки",
  description: "Расчет стоимости авто из США",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body className="bg-gray-50 text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}