import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DefaultLayout>
      <div className="flex flex-col dark:bg-boxdark dark:text-bodydark ">
        {children}
      </div>
    </DefaultLayout>
  );
}
