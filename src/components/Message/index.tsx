"use client";
import React, { FC, useEffect } from "react";

import { message } from "antd";
import { MESSAGE_EVENT_NAME } from "@/utils/antdMessage";

type Props = {};

const MessageCom: FC<Props> = (props) => {
  const [api, contextHolder] = message.useMessage();

  useEffect(() => {
    const bindEvent = (e: CustomEvent | any) => {
      const func = e?.detail?.type || "info";
      const { content, duration, onClose } = e.detail?.params;
      (api as any)[func](content, duration, onClose);
    };

    window.addEventListener(MESSAGE_EVENT_NAME, bindEvent);

    return () => {
      window.removeEventListener(MESSAGE_EVENT_NAME, bindEvent);
    };
  }, [api]);

  return <>{contextHolder}</>;
};

export default MessageCom;
