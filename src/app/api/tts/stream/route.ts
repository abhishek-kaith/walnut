import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
	apiKey: "sk_c5a5a0be1cfe47c60dcaf2c598c77962a12332534109ccff",
});

export async function POST(request: Request) {
	try {
		const { text, voice = "21m00Tcm4TlvDq8ikWAM" } = await request.json();

		if (!text?.trim()) {
			return Response.json({ error: "Text is required" }, { status: 400 });
		}

		const audioStream = await elevenlabs.textToSpeech.stream(voice, {
			text: text.trim(),
			modelId: "eleven_multilingual_v2",
		});

		const webStream = new ReadableStream({
			async start(controller) {
				const reader = audioStream.getReader();

				try {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						controller.enqueue(value);
					}
				} catch (error) {
					controller.error(error);
				} finally {
					controller.close();
					reader.releaseLock();
				}
			},
		});

		return new Response(webStream, {
			headers: {
				"Content-Type": "audio/mpeg",
				"Transfer-Encoding": "chunked",
				"Cache-Control": "no-cache",
			},
		});
	} catch (error) {
		console.error("TTS streaming error:", error);
		return Response.json({ error: "Failed to stream audio" }, { status: 500 });
	}
}
