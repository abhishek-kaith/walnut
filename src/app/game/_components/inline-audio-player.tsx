"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface TTSConfig {
	endpoint: string;
	apiKey?: string;
	voice?: string;
	speed?: number;
	pitch?: number;
}

interface InlineAudioPlayerProps {
	text: string;
	ttsConfig?: TTSConfig;
	className?: string;
}

type AudioState =
	| "idle"
	| "fetching"
	| "loading"
	| "playing"
	| "paused"
	| "error";

export function InlineAudioPlayer({
	text,
	ttsConfig,
	className = "",
}: InlineAudioPlayerProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [audioState, setAudioState] = useState<AudioState>("idle");
	const [isExpanded, setIsExpanded] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [usingWebSpeech, setUsingWebSpeech] = useState(false);
	const [speechUtterance, setSpeechUtterance] =
		useState<SpeechSynthesisUtterance | null>(null);
	const [playbackRate, setPlaybackRate] = useState(1.0);
	const previousRateRef = useRef(1.0);

	// TTS API Integration
	const fetchTTSAudio = async (): Promise<string> => {
		if (!text || !ttsConfig) {
			throw new Error("No text or TTS config provided");
		}

		setAudioState("fetching");
		setError(null);

		try {
			const requestBody = {
				text,
				voice: ttsConfig.voice || "en-US-AriaNeural",
				speed: ttsConfig.speed || 1.0,
				pitch: ttsConfig.pitch || 1.0,
				format: "mp3",
			};

			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};

			if (ttsConfig.apiKey) {
				headers.Authorization = `Bearer ${ttsConfig.apiKey}`;
			}

			const response = await fetch(ttsConfig.endpoint, {
				method: "POST",
				headers,
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				throw new Error(
					`TTS API error: ${response.status} ${response.statusText}`,
				);
			}

			const contentType = response.headers.get("content-type");
			if (contentType?.includes("application/json")) {
				const errorData = await response.json();
				throw new Error(errorData.message || "TTS API returned an error");
			}

			const audioBlob = await response.blob();
			const audioUrl = URL.createObjectURL(audioBlob);
			return audioUrl;
		} catch (error) {
			setAudioState("error");
			const errorMessage =
				error instanceof Error ? error.message : "Failed to fetch audio";
			setError(errorMessage);
			throw error;
		}
	};

	// Web Speech API Fallback
	const useWebSpeechAPI = useCallback(async (): Promise<void> => {
		if (!("speechSynthesis" in window)) {
			throw new Error("Web Speech API not supported");
		}

		// Cancel any ongoing speech
		window.speechSynthesis.cancel();

		setUsingWebSpeech(true);
		setAudioState("loading");
		setError(null);

		// Wait for voices to load if needed
		const getVoices = () => window.speechSynthesis.getVoices();
		let voices = getVoices();

		if (voices.length === 0) {
			// Wait for voiceschanged event
			await new Promise<void>((resolve) => {
				const handleVoicesChanged = () => {
					voices = getVoices();
					if (voices.length > 0) {
						window.speechSynthesis.removeEventListener(
							"voiceschanged",
							handleVoicesChanged,
						);
						resolve();
					}
				};
				window.speechSynthesis.addEventListener(
					"voiceschanged",
					handleVoicesChanged,
				);

				// Fallback timeout
				setTimeout(() => {
					window.speechSynthesis.removeEventListener(
						"voiceschanged",
						handleVoicesChanged,
					);
					resolve();
				}, 1000);
			});
		}

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.rate = Math.max(
			0.1,
			Math.min(10, playbackRate * (ttsConfig?.speed || 1.0)),
		);
		utterance.pitch = Math.max(0, Math.min(2, ttsConfig?.pitch || 1.0));
		utterance.volume = 1.0;

		// Try to use a specific voice if available
		voices = getVoices();
		const preferredVoice =
			voices.find(
				(voice) =>
					voice.lang.startsWith("en") &&
					(voice.name.includes("Neural") || voice.name.includes("Premium")),
			) ||
			voices.find((voice) => voice.lang.startsWith("en")) ||
			voices[0];

		if (preferredVoice) {
			utterance.voice = preferredVoice;
			console.log("Using voice:", preferredVoice.name);
		}

		utterance.onstart = () => {
			console.log("Speech started");
			setAudioState("playing");
		};

		utterance.onend = () => {
			console.log("Speech ended");
			setAudioState("idle");
			setUsingWebSpeech(false);
			setSpeechUtterance(null);
		};

		utterance.onerror = (event) => {
			console.error("Speech synthesis error:", event);
			setAudioState("error");
			setError(`Speech failed: ${event.error}`);
			setUsingWebSpeech(false);
			setSpeechUtterance(null);
		};

		utterance.onpause = () => {
			console.log("Speech paused");
			setAudioState("paused");
		};

		utterance.onresume = () => {
			console.log("Speech resumed");
			setAudioState("playing");
		};

		setSpeechUtterance(utterance);

		try {
			console.log("Starting speech synthesis");
			window.speechSynthesis.speak(utterance);
		} catch (error) {
			console.error("Speech synthesis failed:", error);
			setAudioState("error");
			setError("Failed to start speech synthesis");
			setUsingWebSpeech(false);
			setSpeechUtterance(null);
		}
	}, [text, playbackRate, ttsConfig]);

	// Audio event handlers
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleLoadedMetadata = () => {
			setDuration(audio.duration);
			setAudioState("paused");
		};

		const handleTimeUpdate = () => {
			setCurrentTime(audio.currentTime);
		};

		const handleEnded = () => {
			setAudioState("paused");
			setCurrentTime(0);
		};

		const handleLoadStart = () => {
			setAudioState("loading");
		};

		const handleCanPlay = () => {
			if (audioState === "loading") {
				setAudioState("paused");
			}
		};

		const handleError = () => {
			setAudioState("error");
			setError("Failed to load audio");
		};

		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("loadstart", handleLoadStart);
		audio.addEventListener("canplay", handleCanPlay);
		audio.addEventListener("error", handleError);

		return () => {
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("loadstart", handleLoadStart);
			audio.removeEventListener("canplay", handleCanPlay);
			audio.removeEventListener("error", handleError);
		};
	}, [audioState]);

	// Playback rate control
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.playbackRate = playbackRate;
		}

		// For Web Speech API, we need to restart speech with new rate
		if (
			usingWebSpeech &&
			audioState === "playing" &&
			previousRateRef.current !== playbackRate
		) {
			console.log(
				`Changing Web Speech rate from ${previousRateRef.current} to ${playbackRate}`,
			);
			window.speechSynthesis.cancel();
			// Small delay to ensure cancellation completes
			setTimeout(async () => {
				try {
					await useWebSpeechAPI();
				} catch (error) {
					console.error("Failed to restart speech with new rate:", error);
				}
			}, 100);
		}

		previousRateRef.current = playbackRate;
	}, [playbackRate, usingWebSpeech, audioState, useWebSpeechAPI]);

	// Auto-expand when playing starts, auto-collapse after inactivity
	useEffect(() => {
		if (audioState === "playing" && !usingWebSpeech) {
			setIsExpanded(true);
		}
	}, [audioState, usingWebSpeech]);

	useEffect(() => {
		if (!isExpanded) return;

		const timer = setTimeout(() => {
			if (
				audioState !== "playing" &&
				audioState !== "loading" &&
				audioState !== "fetching"
			) {
				setIsExpanded(false);
			}
		}, 8000);

		return () => clearTimeout(timer);
	}, [isExpanded, audioState]);

	const handlePlayPause = async () => {
		if (usingWebSpeech) {
			if (audioState === "playing") {
				window.speechSynthesis.pause();
				setAudioState("paused");
			} else if (audioState === "paused") {
				window.speechSynthesis.resume();
				setAudioState("playing");
			} else {
				window.speechSynthesis.cancel();
				setUsingWebSpeech(false);
				setAudioState("idle");
			}
			return;
		}

		const audio = audioRef.current;

		if (audioState === "playing") {
			audio?.pause();
			setAudioState("paused");
			return;
		}

		if (audioState === "paused" && audioUrl) {
			try {
				await audio?.play();
				setAudioState("playing");
			} catch (error) {
				setAudioState("error");
				setError("Failed to play audio");
			}
			return;
		}

		// Try TTS API first, fallback to Web Speech API
		if (audioState === "idle" || audioState === "error") {
			try {
				if (ttsConfig) {
					const newAudioUrl = await fetchTTSAudio();
					setAudioUrl(newAudioUrl);

					setTimeout(async () => {
						try {
							await audio?.play();
							setAudioState("playing");
						} catch (error) {
							setAudioState("error");
							setError("Failed to play audio");
						}
					}, 100);
				} else {
					await useWebSpeechAPI();
				}
			} catch (error) {
				console.warn("TTS API failed, falling back to Web Speech API:", error);
				try {
					await useWebSpeechAPI();
				} catch (speechError) {
					console.error("Both TTS API and Web Speech API failed:", speechError);
					setAudioState("error");
					setError("Both TTS and browser speech failed");
				}
			}
		}
	};

	const handleSeek = (
		e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
	) => {
		const audio = audioRef.current;
		if (!audio || duration === 0) return;

		const rect = e.currentTarget.getBoundingClientRect();
		let x: number;

		if ("clientX" in e) {
			// MouseEvent
			x = e.clientX - rect.left;
		} else {
			// KeyboardEvent - seek to middle
			x = rect.width / 2;
		}

		const percentage = x / rect.width;
		const newTime = percentage * duration;

		audio.currentTime = newTime;
		setCurrentTime(newTime);
	};

	const formatTime = (time: number): string => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

	const getStateIcon = () => {
		switch (audioState) {
			case "fetching":
				return (
					<svg
						className="h-6 w-6 animate-spin"
						fill="none"
						viewBox="0 0 24 24"
						aria-label="Loading"
					>
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
			case "loading":
				return (
					<svg
						className="h-6 w-6 animate-pulse"
						fill="currentColor"
						viewBox="0 0 24 24"
						aria-label="Loading audio"
					>
						<title>Loading audio</title>
						<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
					</svg>
				);
			case "playing":
				return (
					<svg
						className="h-6 w-6"
						fill="currentColor"
						viewBox="0 0 20 20"
						aria-label="Pause"
					>
						<title>Pause</title>
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
				);
			case "error":
				return (
					<svg
						className="h-6 w-6"
						fill="currentColor"
						viewBox="0 0 20 20"
						aria-label="Error"
					>
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
					<svg
						className="h-6 w-6"
						fill="currentColor"
						viewBox="0 0 24 24"
						aria-label="Play"
					>
						<title>Play</title>
						<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
					</svg>
				);
		}
	};

	const getStateColor = () => {
		switch (audioState) {
			case "playing":
				return "text-green-400 hover:text-green-300 bg-green-400/10 hover:bg-green-400/20 border border-green-400/20";
			case "error":
				return "text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20";
			case "fetching":
				return "text-blue-400 bg-blue-400/10 border border-blue-400/20";
			case "loading":
				return "text-[var(--color-rpg-gold)] bg-[var(--color-rpg-gold)]/10 border border-[var(--color-rpg-gold)]/20";
			default:
				return "text-[var(--color-rpg-gold)] hover:text-[var(--color-rpg-gold)]/80 bg-[var(--color-rpg-gold)]/5 hover:bg-[var(--color-rpg-gold)]/10 border border-[var(--color-rpg-gold)]/20 hover:border-[var(--color-rpg-gold)]/40";
		}
	};

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			{audioUrl && (
				<audio ref={audioRef} src={audioUrl} preload="metadata">
					<track kind="captions" srcLang="en" label="English" />
				</audio>
			)}

			{/* Audio Icon Button */}
			<button
				onClick={() => {
					if (audioState === "idle" || audioState === "error") {
						handlePlayPause();
					} else if (audioState === "playing") {
						handlePlayPause();
					} else if (audioState === "paused") {
						handlePlayPause();
					} else {
						setIsExpanded(!isExpanded);
					}
				}}
				disabled={audioState === "fetching" || audioState === "loading"}
				className={`flex items-center justify-center rounded-lg p-2 transition-all hover:scale-105 ${getStateColor()} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
				title={
					audioState === "idle" || audioState === "error"
						? "Play scene narration"
						: audioState === "playing"
							? "Pause narration"
							: audioState === "paused"
								? "Resume narration"
								: audioState === "fetching"
									? "Loading audio..."
									: audioState === "loading"
										? "Preparing audio..."
										: "Listen to scene narration"
				}
			>
				{getStateIcon()}
			</button>

			{/* Expanded Controls */}
			{isExpanded && (
				<div className="ml-1 flex items-center gap-2">
					<button
						onClick={handlePlayPause}
						disabled={audioState === "fetching" || audioState === "loading"}
						className={`rounded p-1 transition-colors ${getStateColor()} disabled:opacity-50`}
					>
						{audioState === "playing" ? "Pause" : "Play"}
					</button>

					{/* Progress Controls - Only for TTS Audio */}
					{audioUrl && !usingWebSpeech && (
						<>
							<span className="min-w-[2rem] text-gray-400 text-xs">
								{formatTime(currentTime)}
							</span>
							<div
								className="group h-1 w-16 cursor-pointer rounded-full bg-white/20"
								onClick={handleSeek}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										handleSeek(e);
									}
								}}
								tabIndex={0}
								role="slider"
								aria-label="Seek audio"
								aria-valuemin={0}
								aria-valuemax={duration}
								aria-valuenow={currentTime}
							>
								<div
									className="h-full rounded-full bg-[var(--color-rpg-gold)] transition-all group-hover:bg-[var(--color-rpg-gold)]/80"
									style={{ width: `${progressPercentage}%` }}
								/>
							</div>
							<span className="min-w-[2rem] text-gray-400 text-xs">
								{duration > 0 ? formatTime(duration) : "--:--"}
							</span>
						</>
					)}

					{/* Speed Control - Works for both TTS and Web Speech */}
					<div className="flex items-center gap-1">
						<span className="text-gray-400 text-xs">Speed:</span>
						<div className="flex rounded-md bg-white/10">
							{[0.5, 1.0, 2.0].map((rate) => (
								<button
									key={rate}
									onClick={() => setPlaybackRate(rate)}
									className={`rounded px-2 py-1 text-xs transition-colors ${
										playbackRate === rate
											? "bg-[var(--color-rpg-gold)] text-black"
											: "text-gray-300 hover:bg-white/10 hover:text-white"
									}`}
								>
									{rate}x
								</button>
							))}
						</div>
					</div>

					{usingWebSpeech && (
						<span className="text-gray-400 text-xs">Using browser speech</span>
					)}

					{error && (
						<span
							className="max-w-32 truncate text-red-400 text-xs"
							title={error}
						>
							{error}
						</span>
					)}
				</div>
			)}
		</div>
	);
}
