import { NextResponse } from "next/server";

export type ResponseReturn<T = any> = {
  data: T;
  status: number;
};

export function jsonReturn(
  data: Record<string, any>,
  status: number = 200,
): NextResponse<ResponseReturn> {
  return NextResponse.json({
    data,
    status,
  });
}
