export default function CardWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 flex  min-h-full items-center justify-center">
      <div className="m-5 rounded-xl bg-white p-5 shadow-md dark:bg-slate-500">
        {children}
      </div>
    </div>
  );
}
