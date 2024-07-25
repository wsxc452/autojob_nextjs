import MessageCom from "@/components/Message";
import { AntdRegistry } from "@ant-design/nextjs-registry";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="body-wrap">
      <AntdRegistry>
        {children}
        <MessageCom />
      </AntdRegistry>
    </div>
  );
}
