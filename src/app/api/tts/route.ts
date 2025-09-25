import { env } from "@/env";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
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
			// speed = 1.0,
			// pitch = 1.0,
			format = "mp3",
		} = body;
		if (!text || text.trim().length === 0) {
			return NextResponse.json({ error: "Text is required" }, { status: 400 });
		}
		if (text.length > 5000) {
			return NextResponse.json(
				{ error: "Text too long (max 5000 characters)" },
				{ status: 400 },
			);
		}
		const elevenLabsApiKey = env.EL;
		if (!elevenLabsApiKey) {
			console.warn(
				"ElevenLabs API key not found, falling back to Web Speech API",
			);
			return NextResponse.json(
				{
					error:
						"ElevenLabs not configured. Add ELEVENLABS_API_KEY to your .env file",
					fallback: true,
				},
				{ status: 501 },
			);
		}
		try {
			const elevenlabs = new ElevenLabsClient({
				apiKey: elevenLabsApiKey,
			});
			const audio = await elevenlabs.textToSpeech.convert(
				"21m00Tcm4TlvDq8ikWAM",
				{
					text: text,
					modelId: "eleven_v3",
				},
			);
			return new NextResponse(audio as ReadableStream, {
				headers: {
					"Content-Type": "audio/mpeg",
					"Cache-Control": "public, max-age=3600",
					"Transfer-Encoding": "chunked",
				},
			});
		} catch (elevenLabsError) {
			console.error("ElevenLabs error:", elevenLabsError);
			return NextResponse.json(
				{
					error: "ElevenLabs failed, falling back to Web Speech API",
					fallback: true,
					details:
						elevenLabsError instanceof Error
							? elevenLabsError.message
							: "Unknown ElevenLabs error",
				},
				{ status: 501 },
			);
		}
	} catch (error) {
		console.error("TTS API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function GET() {
	const elevenLabsConfigured = !!process.env.ELEVENLABS_API_KEY;

	return NextResponse.json({
		status: "ElevenLabs TTS API endpoint ready",
		timestamp: new Date().toISOString(),
		configured: elevenLabsConfigured,
		fallback: "Web Speech API",
		availableVoices: [
			"JBFqnCBsd6RMkjVDRZzb", // Rachel
			"TxGEqnHWrfWFTfGW9XjX", // Josh
			"VR6AewLTigWG4xSOukaG", // Arnold
			"pNInz6obpgDQGcFmaJgB", // Adam
			"yoZ06aMxZJJ28mfd3POQ", // Sam
		],
	});
}
