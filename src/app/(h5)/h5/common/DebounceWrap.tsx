import React, { useRef, useState, ComponentType } from "react";

// 定义 HOC 的 props 类型
interface WithDebounceOverlayProps {
  onBusinessAction?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
interface DebounceWrapProps {
  children: React.ReactNode;
  debounceTime?: number;
}

const DebounceWrap = function ({
  children,
  debounceTime = 1000,
}: DebounceWrapProps) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isOverlayVisible) {
      console.log("isOverlayVisible", isOverlayVisible);
      return;
    }

    // 设置蒙层可见
    setIsOverlayVisible(true);
    setOpacity(0.8);

    // 设置定时器隐藏蒙层
    setTimeout(() => {
      setIsOverlayVisible(false);
      setOpacity(1);
    }, debounceTime);
  };

  // 获取组件的原生 DOM 元素
  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // width: componentRef.current
    //   ? `${componentRef.current.offsetWidth}px`
    //   : "100%",
    // height: componentRef.current
    //   ? `${componentRef.current.offsetHeight}px`
    //   : "100%",
    // backgroundColor: "rgba(255, 255, 255, 0.2)", // 蒙层颜色
    zIndex: 9999, // 确保在最上层
    display: isOverlayVisible ? "block" : "none",
  };

  return (
    <div
      style={{ position: "relative", opacity: opacity }}
      ref={componentRef}
      onClick={handleClick}
    >
      {children}
      <div style={overlayStyle} />
    </div>
  );
};
export default DebounceWrap;
// 高阶组件
const withDebounceOverlay = <P extends object>(
  WrappedComponent: ComponentType<P>,
  debounceTime = 1000,
) => {
  const WithDebounceOverlay: React.FC<P & WithDebounceOverlayProps> = (
    props,
  ) => {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (isOverlayVisible) return;

      // 设置蒙层可见
      setIsOverlayVisible(true);

      // 处理内部业务逻辑
      props.onBusinessAction?.(event);

      // 设置定时器隐藏蒙层
      setTimeout(() => {
        setIsOverlayVisible(false);
      }, debounceTime);
    };

    // 获取组件的原生 DOM 元素
    const overlayStyle: React.CSSProperties = {
      position: "absolute",
      top: 0,
      left: 0,
      width: componentRef.current
        ? `${componentRef.current.offsetWidth}px`
        : "100%",
      height: componentRef.current
        ? `${componentRef.current.offsetHeight}px`
        : "100%",
      backgroundColor: "rgba(255, 255, 255, 0.5)", // 蒙层颜色
      zIndex: 9999, // 确保在最上层
      display: isOverlayVisible ? "block" : "none",
    };

    return (
      <div
        style={{ position: "relative" }}
        ref={componentRef}
        onClick={handleClick}
      >
        <WrappedComponent {...(props as P)} />
        <div style={overlayStyle} />
      </div>
    );
  };

  return WithDebounceOverlay;
};
