"use client";

import type { Choice, Deltas, Scene } from "@/types/game";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { InlineAudioPlayer } from "./inline-audio-player";

interface GameSceneProps {
	scene: Scene;
	dayNumber: number;
	sceneNumber: number;
	totalDays: number;
	totalScenes: number;
	totalPoints: number;
	onChoice: (choiceId: string, deltas: Deltas) => void;
	onRestart?: () => void;
}

export function GameScene({
	scene,
	dayNumber,
	sceneNumber,
	totalDays,
	totalScenes,
	totalPoints,
	onChoice,
	onRestart,
}: GameSceneProps) {
	const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
	const [showingResult, setShowingResult] = useState(false);

	const handleChoice = (choice: Choice) => {
		setSelectedChoice(choice.id);
		setShowingResult(true);

		// Show result briefly before progressing
		setTimeout(() => {
			onChoice(choice.id, choice.deltas);
			setSelectedChoice(null);
			setShowingResult(false);
		}, 2000);
	};

	const progressPercentage = ((sceneNumber - 1) / totalScenes) * 100;

	return (
		<div className="min-h-screen p-2 md:p-4">
			{/* Floating Action Buttons */}
			<div className="fixed top-2 right-2 z-50 flex hidden flex-col gap-1 md:top-4 md:right-4 md:gap-2">
				<Link
					href="/"
					className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 text-white shadow-lg transition-all hover:scale-105 hover:bg-gray-700 md:h-12 md:w-12"
					title="Exit to Home"
				>
					<svg
						className="h-4 w-4 md:h-5 md:w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						role="img"
						aria-label="Exit to Home"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</Link>
				{onRestart && (
					<button
						onClick={onRestart}
						className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg transition-all hover:scale-105 hover:bg-[var(--color-accent)]/80 md:h-12 md:w-12"
						title="Restart Game"
					>
						<svg
							className="h-4 w-4 md:h-5 md:w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							role="img"
							aria-label="Restart Game"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
					</button>
				)}
			</div>

			{/* Header with progress */}
			<div className="mx-auto mb-4 max-w-4xl md:mb-6 xl:max-w-6xl">
				<div className="rpg-card p-3 md:p-4">
					<div className="mb-3 flex items-center justify-between md:mb-4">
						<div className="text-[var(--color-rpg-gold)]">
							<h2 className="font-bold text-lg md:text-xl">Day {dayNumber}</h2>
						</div>
						<div className="text-right">
							<p className="font-bold text-[var(--color-rpg-gold)] text-sm md:text-base">
								{totalPoints} ⭐
							</p>
						</div>
					</div>

					{/* Progress bar */}
					<div className="rpg-progress-bar h-2 md:h-3">
						<div
							className="rpg-progress-fill"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>
			</div>

			{/* Main scene */}
			<div className="mx-auto max-w-4xl xl:max-w-6xl">
				<div className="rpg-scene-card">
					<div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 lg:gap-8">
						{/* Scene image - Top on mobile, left on desktop */}
						<div className="order-1 md:order-1">
							<Image
								src={scene.imageUrl}
								alt={scene.title}
								width={600}
								height={400}
								className="w-full rounded-lg border border-[var(--color-rpg-border)] shadow-lg"
								priority
							/>
						</div>

						{/* Scene content - Bottom on mobile, right on desktop */}
						<div className="order-2 space-y-4 md:order-2 md:space-y-6">
							<div>
								<div className="mb-3 md:mb-4">
									<h1 className="font-bold text-[var(--color-rpg-gold)] text-xl md:text-2xl lg:text-3xl">
										{scene.title.split(":")[1]}
									</h1>
									<InlineAudioPlayer
										text={`${scene.title}. ${scene.description.join(" ")} What do you do? Your choices are: ${scene.choices.map((choice, index) => `Option ${String.fromCharCode(65 + index)}: ${choice.text.split(". ")[1]?.trim() || choice.text}`).join(". ")}.`}
										ttsConfig={{
											endpoint: "/api/tts",
											voice: "en-US",
											speed: 1.0,
											pitch: 1.0,
										}}
										className="mt-2"
									/>
								</div>

								<div className="space-y-2 md:space-y-4">
									{scene.description.map((paragraph, index) => (
										<p
											key={`${scene.id}-desc-${index}`}
											className="text-gray-300 text-sm leading-relaxed md:text-base"
										>
											{paragraph}
										</p>
									))}
								</div>
							</div>

							{/* Choices */}
							{!showingResult && (
								<div className="space-y-2 md:space-y-3">
									<h3 className="mb-2 font-bold text-[var(--color-rpg-gold)] text-base md:mb-3 md:text-lg">
										What do you do?
									</h3>
									{scene.choices.map((choice, index) => (
										<button
											key={choice.id}
											onClick={() => handleChoice(choice)}
											className={`rpg-choice-button w-full p-3 text-left text-sm transition-all duration-200 md:p-4 md:text-base ${
												selectedChoice === choice.id && showingResult
													? "border-[var(--color-rpg-gold)] bg-[var(--color-primary-light)] ring-2 ring-[var(--color-rpg-gold)]"
													: "hover:border-[var(--color-rpg-gold)] hover:ring-1 hover:ring-[var(--color-rpg-gold)]/50"
											}`}
											disabled={selectedChoice !== null}
										>
											<span className="mr-2 font-bold text-[var(--color-rpg-gold)]">
												{String.fromCharCode(65 + index)}.
											</span>
											{choice.text.split(". ")[1]?.trim()}
										</button>
									))}
								</div>
							)}

							{/* Choice result */}
							{showingResult && selectedChoice && (
								<div className="rounded-lg border border-[var(--color-rpg-gold)] bg-opacity-20 p-3 md:p-4">
									<div className="flex items-center space-x-2">
										<span className="text-xl md:text-2xl">🎯</span>
										<div>
											<p className="font-bold text-[var(--color-rpg-gold)] text-sm md:text-base">
												Choice Recorded!
											</p>
											<p className="text-gray-300 text-xs md:text-sm">
												Your decision shapes your personality profile...
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

		</div>
	);
}
