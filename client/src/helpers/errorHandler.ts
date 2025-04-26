import { AppError } from "@/types";
import { NextResponse } from "next/server";

export default function errorHandler(err: AppError) {
  const message = err.message || "Internal Server Error";
  let status = 500;

  if ("status" in err) {
    status = err.status;
  }

  console.log(message, "<<<<< error throw in errorHandler");

  return new NextResponse(
    JSON.stringify({
      message: message,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
