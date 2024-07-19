"use client";
import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
// import ChartOne from "../Charts/ChartOne";
// import ChartTwo from "../Charts/ChartTwo";
// import ChatCard from "../Chat/ChatCard";
// import TableOne from "../Tables/TableOne";
// import CardDataStats from "../CardDataStats";
// const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
//   ssr: false,
// });

// const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
//   ssr: false,
// });

interface FilterComponyProps {
  isShow: boolean;
  onClose: (isShow: boolean) => void;
  children?: React.ReactNode;
}

const FilterCompony: React.FC<FilterComponyProps> = ({
  isShow,
  onClose,
  children,
}) => {
  console.log(isShow);
  const [isModalOpen, setIsModalOpen] = useState(isShow);

  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    setIsModalOpen(isShow);
  }, [isShow]);

  const handleOk = () => {
    setIsModalOpen(false);
    onClose(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    onClose(false);
  };
  return (
    <>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    </>
  );
};

export default FilterCompony;
