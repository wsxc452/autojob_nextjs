"use client";
import React from "react";
import Form from "./Form";
// import ChartOne from "../Charts/ChartOne";
// import ChartTwo from "../Charts/ChartTwo";
// import ChatCard from "../Chat/ChatCard";
// import TableOne from "../Tables/TableOne";
// import CardDataStats from "../CardDataStats";

// const MapOne = dynamic(() => import("@/app/pc/components/Maps/MapOne"), {
//   ssr: false,
// });

// const ChartThree = dynamic(() => import("@/app/pc/components/Charts/ChartThree"), {
//   ssr: false,
// });

const BaseFrom: React.FC = () => {
  return (
    <div className="flex flex-row">
      <div className="flex-1 ">
        <Form isLoading={false} />
      </div>
    </div>
  );
};

export default BaseFrom;
