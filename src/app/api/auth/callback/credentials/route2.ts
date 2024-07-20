import { NextRequest, NextResponse } from "next/server";
import { handlers } from "@/auth";

export async function POST3(request: NextRequest, response: NextResponse) {
  console.log("POST request", request);
  try {
    // Call the POST handler and pass the request object
    // 读取原始请求体
    const clonedRequest = request.clone();

    const body = await clonedRequest.text(); // 获取请求体作为文本

    // 你需要手动解析文本
    // 假设请求体是 application/x-www-form-urlencoded 格式
    const formData = new URLSearchParams(body);
    console.log("POST request====", JSON.stringify(formData));
    const response = await handlers.POST(request);

    console.log("POST request====", JSON.stringify(request));
    return response; // Return the response
  } catch (error) {
    console.error("POST request error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function POST(request: NextRequest, response: NextResponse) {
  //   return handlers.POST(request);
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const body = Object.fromEntries(formData);
  // 这里面做用户的校验操作, 避免在客户端,auth.ts中做校验
  console.log("POST request====**********************************");
  const BASE_PATH = "http://localhost:3000";
  if (!(body.username === "wsxc451" && body.password === "xiaocao11")) {
    const errmsg = "Invalid username or password";
    return new NextResponse(
      JSON.stringify({
        error: errmsg,
        status: 401,
        url: `${BASE_PATH}/api/auth/error?error=Configuration&code=401&msg=${encodeURIComponent(errmsg)}`,
        ok: false,
      }),
      {
        status: response.status, // Keep the same status code
        headers: response.headers, // Keep the same headers
      },
    );
  }
  return handlers.POST(request);
}
