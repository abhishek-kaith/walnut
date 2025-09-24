"use client";

import type { Choice, Deltas, Scene } from "@/types/game";
import Image from "next/image";
import { useState } from "react";

interface GameSceneProps {
	scene: Scene;
	dayNumber: number;
	sceneNumber: number;
	totalDays: number;
	totalScenes: number;
	totalPoints: number;
	onChoice: (choiceId: string, deltas: Deltas) => void;
}

export function GameScene({
	scene,
	dayNumber,
	sceneNumber,
	totalDays,
	totalScenes,
	totalPoints,
	onChoice,
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
		<div className="min-h-screen p-4">
			{/* Header with progress */}
			<div className="mx-auto mb-6 max-w-4xl">
				<div className="rpg-card p-4">
					<div className="mb-4 flex items-center justify-between">
						<div className="text-[var(--color-rpg-gold)]">
							<h2 className="font-bold text-xl">Day {dayNumber}</h2>
							<p className="text-gray-300 text-sm">
								Scene {sceneNumber} of {totalScenes}
							</p>
						</div>
						<div className="text-right">
							<p className="font-bold text-[var(--color-rpg-gold)]">
								{totalPoints} ⭐
							</p>
							<p className="text-gray-300 text-xs">Adventure Points</p>
						</div>
					</div>

					{/* Progress bar */}
					<div className="rpg-progress-bar h-3">
						<div
							className="rpg-progress-fill"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>
			</div>

			{/* Main scene */}
			<div className="mx-auto max-w-4xl">
				<div className="rpg-scene-card">
					<div className="grid gap-8 md:grid-cols-2">
						{/* Scene image */}
						<div className="order-2 md:order-1">
							<Image
								src={scene.imageUrl}
								alt={scene.title}
								width={500}
								height={400}
								className="w-full rounded-lg border border-[var(--color-rpg-border)] shadow-lg"
							/>
						</div>

						{/* Scene content */}
						<div className="order-1 space-y-6 md:order-2">
							<div>
								<h1 className="mb-4 font-bold text-2xl text-[var(--color-rpg-gold)]">
									{scene.title}
								</h1>

								<div className="space-y-4">
									{scene.description.map((paragraph, index) => (
										<p
											key={`${scene.id}-desc-${index}`}
											className="text-gray-300 leading-relaxed"
										>
											{paragraph}
										</p>
									))}
								</div>
							</div>

							{/* Choices */}
							{!showingResult && (
								<div className="space-y-3">
									<h3 className="mb-3 font-bold text-[var(--color-rpg-gold)] text-lg">
										⚡ What do you do?
									</h3>
									{scene.choices.map((choice, index) => (
										<button
											key={choice.id}
											onClick={() => handleChoice(choice)}
											className={`rpg-choice-button w-full p-4 text-left ${
												selectedChoice === choice.id
													? "border-[var(--color-rpg-gold)] bg-[var(--color-primary-light)]"
													: ""
											}`}
											disabled={selectedChoice !== null}
										>
											<span className="mr-2 font-bold text-[var(--color-rpg-gold)]">
												{String.fromCharCode(65 + index)}.
											</span>
											{choice.text}
										</button>
									))}
								</div>
							)}

							{/* Choice result */}
							{showingResult && selectedChoice && (
								<div className="rounded-lg border border-[var(--color-rpg-gold)] bg-[var(--color-rpg-gold)] bg-opacity-20 p-4">
									<div className="flex items-center space-x-2">
										<span className="text-2xl">🎯</span>
										<div>
											<p className="font-bold text-[var(--color-rpg-gold)]">
												Choice Recorded!
											</p>
											<p className="text-gray-300 text-sm">
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
