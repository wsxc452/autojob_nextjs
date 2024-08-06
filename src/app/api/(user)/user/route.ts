import { jsonReturn } from "../../common/common";

export async function POST(request: Request) {}
export async function GET(request: Request) {
    return jsonReturn({ code: 0, data: "user" });
}
