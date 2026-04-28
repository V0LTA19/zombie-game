import "./globals.css";

export const metadata = {
  title: "Zombie Game",
  description: "RPG Shooter Prototype",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
