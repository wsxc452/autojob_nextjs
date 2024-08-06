"use client";
import { Flex, Layout } from "antd";
import Menus from "./Menus";
const { Header, Footer, Sider, Content } = Layout;
const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  //   color: "#fff",
  backgroundColor: "#fff",
};

const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#e3e3e3",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#333",
  backgroundColor: "#e3e3e3",
  height: 34,
  lineHeight: "34px",
  padding: "0px",
};

const layoutStyle = {
  overflow: "hidden",
  width: "100%",
  maxwidth: "100%",
  height: "100%",
  innerHeight: "100%",
  minHeight: "100%",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full w-full flex-col  text-black ">
      <Flex gap="middle" wrap className="h-full w-full">
        <Layout style={layoutStyle}>
          <Sider width="30%" style={siderStyle}>
            <Menus />
          </Sider>
          <Layout>
            {/* <Header style={headerStyle}>Header</Header> */}
            <Content style={contentStyle}> {children}</Content>
            {/* <Footer style={footerStyle}>Footer</Footer> */}
          </Layout>
        </Layout>
      </Flex>
    </div>
  );
}
