import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Call your backend register endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9001"}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Registration failed" },
        { status: response.status }
      );
    }

    // If registration is successful, return success response
    // The frontend will handle the login flow
    return NextResponse.json({
      message: "Registration successful",
      user: data.user,
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
