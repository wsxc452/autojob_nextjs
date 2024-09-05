import Link from "next/link";
import PieChart from "./components/PieChart";
import { Col, Row } from "antd";
import ColumnChart from "./components/ColumnChart";
import TopsChart from "./components/TopsChart";
import BlackChart from "./components/BlackChart";

interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="flex w-full flex-col  gap-3">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav className="w-full">
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              数据看板 /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
      <div className="w-full">
        <Row>
          <Col span={12}>
            <PieChart />
          </Col>
          <Col span={12}>
            <ColumnChart />
          </Col>
          <Col span={24}>
            <BlackChart />
          </Col>
          <Col span={12}>
            <TopsChart />
          </Col>
          <Col span={12}></Col>
        </Row>
      </div>
    </div>
  );
};

export default Breadcrumb;
