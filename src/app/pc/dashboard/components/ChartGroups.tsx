import { Col, Row } from "antd";
import React, { Suspense } from "react";
const PieChartLazy = React.lazy(() => import("./PieChart"));
const BlackChartLazy = React.lazy(() => import("./BlackChart"));
const TopsChartLazy = React.lazy(() => import("./TopsChart"));
const ColumnChartLazy = React.lazy(() => import("./ColumnChart"));
function ChartGroups() {
  return (
    <div className="w-full">
      <Row>
        <Col span={12}>
          <Suspense fallback={<div>Loading...</div>}>
            <PieChartLazy />
          </Suspense>
        </Col>
        <Col span={12}>
          <Suspense fallback={<div>Loading...</div>}>
            <TopsChartLazy />
          </Suspense>
        </Col>

        <Col span={24}>
          <Suspense fallback={<div>Loading...</div>}>
            <BlackChartLazy />
          </Suspense>
        </Col>
        <Col span={24}>
          <Suspense fallback={<div>Loading...</div>}>
            <ColumnChartLazy />
          </Suspense>
        </Col>
      </Row>
    </div>
  );
}

export default ChartGroups;
