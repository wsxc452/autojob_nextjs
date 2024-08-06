export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col dark:bg-boxdark dark:text-bodydark ">
      {children}
    </div>
  );
}
