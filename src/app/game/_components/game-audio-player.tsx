"use client";

import { useEffect, useRef, useState } from "react";

interface GameAudioPlayerProps {
	audioSrc?: string;
	dayNumber: number;
	sceneNumber?: number;
	className?: string;
}

export function GameAudioPlayer({
	audioSrc = "/sample.wav",
	dayNumber,
	sceneNumber,
	className = "",
}: GameAudioPlayerProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [volume, setVolume] = useState(0.7);
	const [showVolumeControl, setShowVolumeControl] = useState(false);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleLoadedMetadata = () => {
			setDuration(audio.duration);
			setIsLoading(false);
		};

		const handleTimeUpdate = () => {
			setCurrentTime(audio.currentTime);
		};

		const handleEnded = () => {
			setIsPlaying(false);
			setCurrentTime(0);
		};

		const handleLoadStart = () => {
			setIsLoading(true);
		};

		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("loadstart", handleLoadStart);

		return () => {
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("loadstart", handleLoadStart);
		};
	}, [audioSrc]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [volume]);

	const togglePlay = () => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
			setIsPlaying(false);
		} else {
			audio.play().catch((error) => {
				console.error("Error playing audio:", error);
			});
			setIsPlaying(true);
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

	return (
		<div
			className={`rpg-card bg-[var(--color-primary-light)]/20 p-3 md:p-4 ${className}`}
		>
			<audio ref={audioRef} src={audioSrc} preload="metadata" />

			{/* Header */}
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="flex h-6 w-6 items-center justify-center rounded bg-[var(--color-rpg-gold)]/20 md:h-8 md:w-8">
						<span className="text-xs md:text-sm">🎵</span>
					</div>
					<div>
						<p className="font-bold text-[var(--color-rpg-gold)] text-xs md:text-sm">
							Day {dayNumber} Audio
							{sceneNumber && ` - Scene ${sceneNumber}`}
						</p>
					</div>
				</div>

				{/* Volume Control */}
				<div className="relative">
					<button
						onClick={() => setShowVolumeControl(!showVolumeControl)}
						className="flex h-6 w-6 items-center justify-center rounded bg-[var(--color-primary)]/30 text-[var(--color-rpg-gold)] transition-all hover:bg-[var(--color-primary)]/50 md:h-8 md:w-8"
						title="Volume"
					>
						<svg
							className="h-3 w-3 md:h-4 md:w-4"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.818L4.936 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.936l3.447-2.818a1 1 0 011.617.818zm0 0a1 1 0 01.894.553l2.991 5.98a.869.869 0 01.02.037l.99 1.98A1 1 0 0113.2 13.4L11.73 10.62a1 1 0 00-1.664.062 5.963 5.963 0 01-1.064-6.587z"
								clipRule="evenodd"
							/>
						</svg>
					</button>

					{showVolumeControl && (
						<div className="absolute top-full right-0 z-10 mt-1 rounded bg-[var(--color-primary)] p-2 shadow-lg">
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={volume}
								onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
								className="w-20 accent-[var(--color-rpg-gold)]"
							/>
						</div>
					)}
				</div>
			</div>

			{/* Main Controls */}
			<div className="flex items-center gap-3 md:gap-4">
				{/* Play/Pause Button */}
				<button
					onClick={togglePlay}
					disabled={isLoading}
					className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-rpg-gold)] text-[var(--color-primary)] transition-all hover:scale-105 hover:bg-[var(--color-rpg-gold)]/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:h-12 md:w-12"
					title={isPlaying ? "Pause" : "Play"}
				>
					{isLoading ? (
						<svg
							className="h-4 w-4 animate-spin md:h-5 md:w-5"
							fill="none"
							viewBox="0 0 24 24"
						>
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
					) : isPlaying ? (
						<svg
							className="h-4 w-4 md:h-5 md:w-5"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
					) : (
						<svg
							className="h-4 w-4 md:h-5 md:w-5"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
								clipRule="evenodd"
							/>
						</svg>
					)}
				</button>

				{/* Progress Bar and Time */}
				<div className="flex-1">
					<div
						className="group mb-1 h-2 cursor-pointer rounded-full bg-[var(--color-primary)]/30 md:h-3"
						onClick={handleSeek}
					>
						<div
							className="h-full rounded-full bg-[var(--color-rpg-gold)] transition-all group-hover:bg-[var(--color-rpg-gold)]/80"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>

					<div className="flex justify-between text-[var(--color-rpg-gold)]/70 text-xs">
						<span>{formatTime(currentTime)}</span>
						<span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
					</div>
				</div>
			</div>

			{/* Audio Status */}
			{isPlaying && (
				<div className="mt-2 flex items-center gap-2">
					<div className="flex gap-1">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="h-1 w-1 animate-pulse rounded-full bg-[var(--color-rpg-gold)]"
								style={{ animationDelay: `${i * 0.2}s` }}
							/>
						))}
					</div>
					<span className="text-[var(--color-rpg-gold)]/70 text-xs">
						Now playing
					</span>
				</div>
			)}
		</div>
	);
}
