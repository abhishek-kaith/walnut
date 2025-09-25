"use client";

import { useEffect, useRef, useState } from "react";

interface TTSConfig {
	endpoint: string;
	apiKey?: string;
	voice?: string;
	speed?: number;
	pitch?: number;
}

interface FloatingAudioPlayerProps {
	text?: string;
	dayNumber: number;
	sceneNumber?: number;
	ttsConfig?: TTSConfig;
	position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
	size?: "sm" | "md" | "lg";
	className?: string;
}

type AudioState =
	| "idle"
	| "fetching"
	| "loading"
	| "playing"
	| "paused"
	| "error";

export function FloatingAudioPlayer({
	text,
	dayNumber,
	sceneNumber,
	ttsConfig,
	position = "bottom-right",
	size = "md",
	className = "",
}: FloatingAudioPlayerProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [audioState, setAudioState] = useState<AudioState>("idle");
	const [isExpanded, setIsExpanded] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [volume, setVolume] = useState(0.8);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Size configurations
	const sizeConfig = {
		sm: {
			collapsed: "w-12 h-12",
			expanded: "w-80 h-20",
			button: "w-8 h-8",
			icon: "w-4 h-4",
			text: "text-xs",
		},
		md: {
			collapsed: "w-14 h-14",
			expanded: "w-96 h-24",
			button: "w-10 h-10",
			icon: "w-5 h-5",
			text: "text-sm",
		},
		lg: {
			collapsed: "w-16 h-16",
			expanded: "w-[28rem] h-28",
			button: "w-12 h-12",
			icon: "w-6 h-6",
			text: "text-base",
		},
	};

	// Position configurations
	const positionConfig = {
		"bottom-right": "bottom-4 right-4",
		"bottom-left": "bottom-4 left-4",
		"top-right": "top-4 right-4",
		"top-left": "top-4 left-4",
	};

	const config = sizeConfig[size];

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

			// Check if response is JSON (error) or audio blob
			const contentType = response.headers.get("content-type");

			if (contentType?.includes("application/json")) {
				const errorData = await response.json();
				throw new Error(errorData.message || "TTS API returned an error");
			}

			// Create blob URL for audio
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

	// Volume control
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [volume]);

	// Auto-collapse after inactivity
	useEffect(() => {
		if (!isExpanded) return;

		const timer = setTimeout(() => {
			if (audioState !== "playing") {
				setIsExpanded(false);
			}
		}, 5000);

		return () => clearTimeout(timer);
	}, [isExpanded, audioState]);

	const handlePlayPause = async () => {
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

		// Fetch new audio
		if (audioState === "idle" || audioState === "error") {
			try {
				const newAudioUrl = await fetchTTSAudio();
				setAudioUrl(newAudioUrl);

				// Audio will load and then we can play
				setTimeout(async () => {
					try {
						await audio?.play();
						setAudioState("playing");
					} catch (error) {
						setAudioState("error");
						setError("Failed to play audio");
					}
				}, 100);
			} catch (error) {
				console.error("Failed to fetch TTS audio:", error);
			}
		}
	};

	const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
		const audio = audioRef.current;
		if (!audio || duration === 0) return;

		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
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
			case "loading":
				return (
					<svg
						className={`${config.icon} animate-spin`}
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
			case "playing":
				return (
					<svg
						className={config.icon}
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
						className={config.icon}
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
						className={config.icon}
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
				return "bg-green-500 hover:bg-green-600";
			case "error":
				return "bg-red-500 hover:bg-red-600";
			case "fetching":
			case "loading":
				return "bg-blue-500";
			default:
				return "bg-[var(--color-rpg-gold)] hover:bg-[var(--color-rpg-gold)]/80";
		}
	};

	return (
		<div className={`fixed z-50 ${positionConfig[position]} ${className}`}>
			{audioUrl && (
				<audio ref={audioRef} src={audioUrl} preload="metadata">
					<track kind="captions" srcLang="en" label="English" />
				</audio>
			)}

			<div
				className={`rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out border-white/20${isExpanded ? config.expanded : config.collapsed}
					${isExpanded ? "rounded-2xl" : "rounded-full"}bg-[var(--color-primary)]/90`}
			>
				{!isExpanded ? (
					// Collapsed State - Floating Button
					<button
						onClick={() => setIsExpanded(true)}
						className={`flex h-full w-full items-center justify-center text-white transition-all duration-200${getStateColor()} rounded-full active:scale-95`}
						title={`Play Day ${dayNumber}${sceneNumber ? ` Scene ${sceneNumber}` : ""} Audio`}
					>
						{getStateIcon()}
					</button>
				) : (
					// Expanded State - Full Controls
					<div className="flex h-full items-center gap-3 p-3">
						{/* Play/Pause Button */}
						<button
							onClick={handlePlayPause}
							disabled={audioState === "fetching" || audioState === "loading"}
							className={`
								${config.button} flex items-center justify-center text-white transition-all duration-200${getStateColor()} rounded-full active:scale-95 disabled:cursor-not-allowed disabled:opacity-50`}
						>
							{getStateIcon()}
						</button>

						{/* Progress and Controls */}
						<div className="min-w-0 flex-1">
							{/* Title */}
							<div className="mb-1 flex items-center justify-between">
								<span
									className={`${config.text} truncate font-medium text-white/90`}
								>
									Day {dayNumber}
									{sceneNumber && ` • Scene ${sceneNumber}`}
								</span>
								<button
									onClick={() => setIsExpanded(false)}
									className="text-white/60 transition-colors hover:text-white/90"
								>
									<svg
										className="h-4 w-4"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<title>Close</title>
										<path
											fillRule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</div>

							{/* Progress Bar */}
							{audioUrl && (
								<div className="flex items-center gap-2">
									<span className="w-8 text-right text-white/70 text-xs">
										{formatTime(currentTime)}
									</span>
									<div
										className="group h-1 flex-1 cursor-pointer rounded-full bg-white/20"
										onClick={handleSeek}
										onKeyDown={() => {}}
									>
										<div
											className="h-full rounded-full bg-white/80 transition-all group-hover:bg-white"
											style={{ width: `${progressPercentage}%` }}
										/>
									</div>
									<span className="w-8 text-white/70 text-xs">
										{duration > 0 ? formatTime(duration) : "--:--"}
									</span>

									{/* Volume Control */}
									<div className="flex items-center gap-1">
										<input
											type="range"
											min="0"
											max="1"
											step="0.1"
											value={volume}
											onChange={(e) =>
												setVolume(Number.parseFloat(e.target.value))
											}
											className="h-1 w-12 appearance-none rounded-full bg-white/20 slider:bg-white/80"
										/>
									</div>
								</div>
							)}

							{/* Error Display */}
							{error && (
								<div className="mt-1 truncate text-red-300 text-xs">
									{error}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
