"use client";
import LoginForm from "./LoginForm";
export default function Page() {
  function test() {
    console.log("test");
    // localStorage.setItem("test", "test");
    let testLocal = localStorage.getItem("userInfo");

    // localStorage.setItem("test", "test");

    console.log("testLocal");
  }

  function onSubmit(values: any) {
    console.log("values", JSON.stringify(values));
    /**@ts-ignore */
    // 检测用户是否可以登陆
    window.airscript.call("key", JSON.stringify({ userInfo: values }));
  }
  return (
    <div className="p-6">
      <div className="text-center text-xl" onClick={test}>
        简历投递助手
      </div>
      <LoginForm onSumbit={onSubmit} />
    </div>
  );
}
