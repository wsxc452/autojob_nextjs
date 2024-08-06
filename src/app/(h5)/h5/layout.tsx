import MessageCom from "@/app/pc/components/Message";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import LogoutButton from "./common/LogoutButton";
import "./index/page.css";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="body-wrap page flex h-screen w-screen flex-col text-black">
      <AntdRegistry>
        <header className="flex flex-row  justify-between gap-5 border-b-2 border-slate-100 bg-white p-3">
          <div className="logo">AutoJob</div>
          <div className="user-info">
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
          <MessageCom />
        </main>
      </AntdRegistry>
    </div>
  );
}
