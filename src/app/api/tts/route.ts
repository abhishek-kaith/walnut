import { type NextRequest, NextResponse } from "next/server";

interface TTSRequest {
	text: string;
	voice?: string;
	speed?: number;
	pitch?: number;
	format?: string;
}

export async function POST(request: NextRequest) {
	try {
		const body: TTSRequest = await request.json();
		const {
			text,
			voice = "en-US",
			speed = 1.0,
			pitch = 1.0,
			format = "mp3",
		} = body;

		// Validate input
		if (!text || text.trim().length === 0) {
			return NextResponse.json({ error: "Text is required" }, { status: 400 });
		}

		if (text.length > 5000) {
			return NextResponse.json(
				{ error: "Text too long (max 5000 characters)" },
				{ status: 400 },
			);
		}

		// Since we're using "standard TTS", we'll return an error to force fallback to Web Speech API
		// This ensures the browser's built-in TTS is used instead of a server-side service
		console.log("TTS request received, falling back to Web Speech API for standard TTS");
		
		return NextResponse.json(
			{
				error: "Using standard Web Speech API",
				fallback: true,
				config: { voice, speed, pitch, format },
			},
			{ status: 501 }
		);

	} catch (error) {
		console.error("TTS API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// GET endpoint for health check
export async function GET() {
	return NextResponse.json({
		status: "TTS API endpoint ready",
		timestamp: new Date().toISOString(),
		note: "Configure your TTS provider in this endpoint",
	});
}
