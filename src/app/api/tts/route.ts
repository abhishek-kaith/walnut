import {
	PollyClient,
	SynthesizeSpeechCommand,
	type VoiceId,
} from "@aws-sdk/client-polly";
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
			voice = "Joanna",
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

		// AWS Polly configuration
		const awsRegion = process.env.AWS_REGION || "us-east-1";
		const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
		const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

		if (!awsAccessKeyId || !awsSecretAccessKey) {
			console.warn("AWS credentials not found, falling back to Web Speech API");
			return NextResponse.json(
				{
					error:
						"AWS Polly not configured. Add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to your .env file",
					fallback: true,
				},
				{ status: 501 },
			);
		}

		try {
			// Initialize AWS Polly client
			const pollyClient = new PollyClient({
				region: awsRegion,
				credentials: {
					accessKeyId: awsAccessKeyId,
					secretAccessKey: awsSecretAccessKey,
				},
			});

			// Map format to Polly output format
			const outputFormat = format === "wav" ? "pcm" : "mp3";

			// Build SSML with prosody controls for speed and pitch
			const ssmlText = `
				<speak>
					<prosody rate="${speed * 100}%" pitch="${pitch > 1 ? "+" : ""}${((pitch - 1) * 50).toFixed(1)}%">
						${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
					</prosody>
				</speak>
			`;

			// Synthesize speech using AWS Polly
			const command = new SynthesizeSpeechCommand({
				Text: ssmlText,
				TextType: "ssml",
				VoiceId: voice as VoiceId,
				OutputFormat: outputFormat,
				SampleRate: "22050",
				Engine: "neural", // Use neural engine for better quality
			});

			const response = await pollyClient.send(command);

			if (!response.AudioStream) {
				throw new Error("No audio stream returned from Polly");
			}

			// Convert the stream to a buffer
			const audioBuffer = await response.AudioStream.transformToByteArray();

			return new NextResponse(audioBuffer as unknown as BodyInit, {
				headers: {
					"Content-Type": outputFormat === "mp3" ? "audio/mpeg" : "audio/wav",
					"Content-Length": audioBuffer.length.toString(),
					"Cache-Control": "public, max-age=3600", // Cache for 1 hour
				},
			});
		} catch (awsError) {
			console.error("AWS Polly error:", awsError);

			// Fallback to Web Speech API on AWS errors
			return NextResponse.json(
				{
					error: "AWS Polly failed, falling back to Web Speech API",
					fallback: true,
					details:
						awsError instanceof Error ? awsError.message : "Unknown AWS error",
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

// GET endpoint for health check
export async function GET() {
	const awsConfigured = !!(
		process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
	);

	return NextResponse.json({
		status: "AWS Polly TTS API endpoint ready",
		timestamp: new Date().toISOString(),
		configured: awsConfigured,
		region: process.env.AWS_REGION || "us-east-1",
		fallback: "Web Speech API",
		availableVoices: [
			"Joanna",
			"Matthew",
			"Ivy",
			"Justin",
			"Kendra",
			"Kimberly",
			"Salli",
			"Joey",
			"Emma",
			"Brian",
			"Amy",
			"Russell",
		],
	});
}
