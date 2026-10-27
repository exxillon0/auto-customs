import "./globals.css";
export const metadata = { title: "Калькулятор растаможки" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}