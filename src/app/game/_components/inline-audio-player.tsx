"use client";

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { useEffect, useRef, useState } from "react";

interface InlineAudioPlayerProps {
	text: string;
	voice?: string;
	className?: string;
	onTextChange?: (newText: string) => void;
}

type AudioState = "idle" | "loading" | "playing" | "paused" | "error";
type AudioSource = "elevenlabs" | "webspeech" | null;

export function InlineAudioPlayer({
	text,
	voice = "21m00Tcm4TlvDq8ikWAM",
	className = "",
	onTextChange,
}: InlineAudioPlayerProps) {
	const [audioState, setAudioState] = useState<AudioState>("idle");
	const [error, setError] = useState<string | null>(null);
	const [currentAudioSource, setCurrentAudioSource] =
		useState<AudioSource>(null);
	const previousTextRef = useRef(text);
	const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Initialize audio element
	useEffect(() => {
		if (!audioRef.current) {
			audioRef.current = new Audio();
		}
	}, []);

	// Stop all audio on scene change
	useEffect(() => {
		if (previousTextRef.current !== text) {
			// Stop any playing audio
			stopAllAudio();

			window.scrollTo({ top: 0, behavior: "smooth" });
			previousTextRef.current = text;
			setAudioState("idle");
			setError(null);
			setCurrentAudioSource(null);

			if (onTextChange) {
				onTextChange(text);
			}
		}
	}, [text, onTextChange]);

	const stopAllAudio = () => {
		// Stop Web Speech API
		if (window.speechSynthesis) {
			window.speechSynthesis.cancel();
		}
		speechUtteranceRef.current = null;

		// Stop HTML Audio element
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			audioRef.current.src = "";
		}

		setCurrentAudioSource(null);
	};

	// Set up audio element event listeners
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handlePlay = () => {
			if (currentAudioSource === "elevenlabs") {
				setAudioState("playing");
			}
		};

		const handlePause = () => {
			if (currentAudioSource === "elevenlabs") {
				setAudioState("paused");
			}
		};

		const handleEnded = () => {
			if (currentAudioSource === "elevenlabs") {
				setAudioState("idle");
				setCurrentAudioSource(null);
			}
		};

		const handleError = () => {
			if (currentAudioSource === "elevenlabs") {
				setAudioState("error");
				setError("Audio playback failed");
				setCurrentAudioSource(null);
			}
		};

		audio.addEventListener("play", handlePlay);
		audio.addEventListener("pause", handlePause);
		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("error", handleError);

		return () => {
			audio.removeEventListener("play", handlePlay);
			audio.removeEventListener("pause", handlePause);
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("error", handleError);
		};
	}, [currentAudioSource]);

	const fetchElevenLabsAudio = async (): Promise<void> => {
		console.log("Trying ElevenLabs real-time streaming...");

		try {
			const elevenlabs = new ElevenLabsClient({
				apiKey: "sk_c5a5a0be1cfe47c60dcaf2c598c77962a12332534109ccff",
			});

			// Use textToSpeech.stream for true real-time streaming
			const audioStream = await elevenlabs.textToSpeech.stream(voice, {
				text: text.trim(),
				modelId: "eleven_multilingual_v2",
			});

			// Start streaming audio chunks immediately
			await streamAudioChunks(audioStream);
		} catch (error) {
			console.error("ElevenLabs streaming error:", error);
			throw new Error("ElevenLabs streaming failed");
		}
	};

	// Stream audio chunks in real-time using MediaSource API
	const streamAudioChunks = async (stream: ReadableStream): Promise<void> => {
		// Check if MediaSource is supported
		if (!("MediaSource" in window)) {
			console.log("MediaSource not supported, falling back to blob method");
			return streamToBlob(stream);
		}

		const mediaSource = new MediaSource();
		const audioUrl = URL.createObjectURL(mediaSource);

		if (!audioRef.current) return;

		audioRef.current.src = audioUrl;
		setCurrentAudioSource("elevenlabs");

		return new Promise((resolve, reject) => {
			mediaSource.addEventListener("sourceopen", async () => {
				try {
					// Create source buffer for MP3 audio
					const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
					// let isFirstChunk = true;
					let isPlayingStarted = false;
					let pendingBuffer: Uint8Array[] = [];
					const MIN_BUFFER_SIZE = 8192; // Minimum bytes before starting playback

					const reader = stream.getReader();

					const processChunk = async () => {
						try {
							const { done, value } = await reader.read();

							if (done) {
								if (mediaSource.readyState === "open") {
									mediaSource.endOfStream();
								}
								resolve();
								return;
							}

							if (value) {
								// If not playing yet, accumulate chunks
								if (!isPlayingStarted) {
									pendingBuffer.push(value);
									const totalSize = pendingBuffer.reduce(
										(acc, chunk) => acc + chunk.length,
										0,
									);

									// If we have enough buffer, start playback
									if (totalSize >= MIN_BUFFER_SIZE && !sourceBuffer.updating) {
										isPlayingStarted = true;
										// Concatenate all pending chunks and append
										const fullChunk = new Uint8Array(totalSize);
										let offset = 0;
										// biome-ignore lint/complexity/noForEach: <explanation>
										pendingBuffer.forEach((chunk) => {
											fullChunk.set(chunk, offset);
											offset += chunk.length;
										});
										pendingBuffer = [];
										sourceBuffer.appendBuffer(fullChunk);

										// Start playing immediately
										console.log("Starting playback with accumulated buffer");
										setAudioState("playing"); // Clear loading state
										setTimeout(async () => {
											try {
												await audioRef.current?.play();
											} catch (e) {
												console.log("Playback failed, continuing to buffer...");
											}
										}, 100);
									}
								} else if (!sourceBuffer.updating) {
									// Direct streaming after playback started
									sourceBuffer.appendBuffer(value);
								}
							}

							// Wait for buffer to finish updating before next chunk
							if (sourceBuffer.updating) {
								sourceBuffer.addEventListener("updateend", processChunk, {
									once: true,
								});
							} else {
								// Process next chunk immediately
								setTimeout(processChunk, 0);
							}
						} catch (error) {
							console.error("Error processing chunk:", error);
							reject(error);
						}
					};

					// Start processing chunks
					processChunk();
				} catch (error) {
					console.error("Error setting up MediaSource:", error);
					reject(error);
				}
			});

			mediaSource.addEventListener("error", (error) => {
				console.error("MediaSource error:", error);
				reject(error);
			});
		});
	};

	// Fallback: Convert stream to blob (for older browsers)
	const streamToBlob = async (stream: ReadableStream): Promise<void> => {
		console.log("Using blob fallback for streaming");
		const reader = stream.getReader();
		const chunks: Uint8Array[] = [];

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				if (value) chunks.push(value);
			}
		} finally {
			reader.releaseLock();
		}

		// Create blob and play
		const audioBlob = new Blob(chunks as BlobPart[], { type: "audio/mpeg" });
		const audioUrl = URL.createObjectURL(audioBlob);

		if (audioRef.current) {
			audioRef.current.src = audioUrl;
			setCurrentAudioSource("elevenlabs");
			setAudioState("playing"); // Clear loading state
			await audioRef.current.play();
		}
	};

	const handlePlayPause = async () => {
		if (!text?.trim()) return;

		// Handle pause/resume for ElevenLabs audio
		if (currentAudioSource === "elevenlabs" && audioRef.current) {
			if (audioState === "playing") {
				audioRef.current.pause();
				return;
			}
			if (audioState === "paused") {
				await audioRef.current.play();
				return;
			}
		}

		// Handle pause/resume for Web Speech API
		if (currentAudioSource === "webspeech" && speechUtteranceRef.current) {
			if (audioState === "playing") {
				window.speechSynthesis.pause();
				setAudioState("paused");
				return;
			}
			if (audioState === "paused") {
				window.speechSynthesis.resume();
				setAudioState("playing");
				return;
			}
		}

		// Stop any currently playing audio
		if (audioState === "playing") {
			stopAllAudio();
			setAudioState("idle");
			return;
		}

		// Start new audio playback
		setAudioState("loading");
		setError(null);

		// Step 1: Try ElevenLabs API first
		try {
			await fetchElevenLabsAudio();
		} catch (elevenlabsError) {
			console.warn(
				"ElevenLabs failed, trying Web Speech API:",
				elevenlabsError,
			);
			setError("ElevenLabs failed, trying Web Speech API...");

			// Step 2: Try Web Speech API as fallback
			try {
				await useWebSpeechAPI();
			} catch (webSpeechError) {
				console.error(
					"Both ElevenLabs and Web Speech API failed:",
					webSpeechError,
				);
				setAudioState("error");
				setError("Both ElevenLabs and Web Speech API failed");
				setCurrentAudioSource(null);
			}
		}
	};

	const useWebSpeechAPI = async (): Promise<void> => {
		if (!("speechSynthesis" in window)) {
			throw new Error("Web Speech API not supported");
		}

		console.log("Using Web Speech API...");
		setCurrentAudioSource("webspeech");

		return new Promise((resolve, reject) => {
			const utterance = new SpeechSynthesisUtterance(text.trim());
			utterance.rate = 1.0;
			utterance.pitch = 1.0;
			utterance.volume = 0.8;

			speechUtteranceRef.current = utterance;

			utterance.onstart = () => {
				console.log("Web Speech started");
				setAudioState("playing");
				setError(null);
			};

			utterance.onend = () => {
				console.log("Web Speech ended");
				setAudioState("idle");
				setCurrentAudioSource(null);
				speechUtteranceRef.current = null;
				resolve();
			};

			utterance.onerror = (event) => {
				console.error("Web Speech error:", event.error);
				setAudioState("error");
				setCurrentAudioSource(null);
				speechUtteranceRef.current = null;
				reject(new Error(`Web Speech API failed: ${event.error}`));
			};

			utterance.onpause = () => {
				setAudioState("paused");
			};

			utterance.onresume = () => {
				setAudioState("playing");
			};

			try {
				window.speechSynthesis.speak(utterance);
			} catch (error) {
				setCurrentAudioSource(null);
				speechUtteranceRef.current = null;
				reject(error);
			}
		});
	};

	const getIcon = () => {
		switch (audioState) {
			case "loading":
				return (
					<svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
						<title>Loading</title>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				);
			case "playing":
				return (
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<title>Stop</title>
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
				);
			case "paused":
				return (
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<title>Resume</title>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
							clipRule="evenodd"
						/>
					</svg>
				);
			case "error":
				return (
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<title>Error</title>
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clipRule="evenodd"
						/>
					</svg>
				);
			default:
				return (
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<title>Play</title>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
							clipRule="evenodd"
						/>
					</svg>
				);
		}
	};

	const getStateColor = () => {
		switch (audioState) {
			case "playing":
				return "bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-md hover:shadow-red-500/20"; // Red gradient for stop
			case "paused":
				return "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-md hover:shadow-blue-500/20"; // Blue gradient for resume
			case "error":
				return "bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-md hover:shadow-red-500/20";
			case "loading":
				return "bg-gradient-to-br from-gray-400 to-gray-500 text-white animate-pulse";
			default:
				return "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-md hover:shadow-blue-500/20"; // Blue gradient for play
		}
	};

	const getButtonTitle = () => {
		switch (audioState) {
			case "loading":
				return currentAudioSource === "elevenlabs"
					? "Starting real-time stream..."
					: "Loading audio...";
			case "playing":
				return currentAudioSource === "elevenlabs"
					? "Pause audio (Real-time Stream)"
					: "Pause audio (Web Speech)";
			case "paused":
				return currentAudioSource === "elevenlabs"
					? "Resume audio (Real-time Stream)"
					: "Resume audio (Web Speech)";
			case "error":
				return "Try playing audio again";
			default:
				return "Play audio";
		}
	};

	const getStatusMessage = () => {
		if (error) {
			return (
				<span className="text-red-500 text-sm" title={error}>
					{error}
				</span>
			);
		}

		if (audioState === "playing") {
			const source =
				currentAudioSource === "elevenlabs" ? "Real-time Stream" : "Web Speech";
			return (
				<div className="flex items-center gap-1">
					<div className="flex gap-1">
						{[...Array(3)].map((_, i) => {
							const k = `kay${i}`;
							return (
								<div
									key={k}
									className="h-1 w-1 animate-pulse rounded-full bg-green-500"
									style={{ animationDelay: `${i * 0.2}s` }}
								/>
							);
						})}
					</div>
					<span className="text-green-500 text-sm">Playing ({source})</span>
				</div>
			);
		}

		if (audioState === "paused") {
			const source =
				currentAudioSource === "elevenlabs"
					? "ElevenLabs Stream"
					: "Web Speech";
			return <span className="text-sm text-yellow-500">Paused ({source})</span>;
		}

		return null;
	};

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			{/* Hidden audio element for ElevenLabs playback */}
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio ref={audioRef} preload="none" style={{ display: "none" }} />

			<button
				onClick={handlePlayPause}
				disabled={audioState === "loading"}
				className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${getStateColor()} backdrop-blur-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/20`}
				title={getButtonTitle()}
			>
				<div className="scale-90">{getIcon()}</div>
			</button>

			{getStatusMessage()}
		</div>
	);
}
