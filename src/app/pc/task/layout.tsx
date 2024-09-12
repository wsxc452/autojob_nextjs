import DefaultLayout from "@/app/pc/components/Layouts/DefaultLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-col dark:bg-boxdark dark:text-bodydark ">
      {children}
    </div>
  );
}
