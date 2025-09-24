"use client";

import type { GameData } from "@/types/game";
import Image from "next/image";
import { useState } from "react";

interface GameIntroProps {
	intro: GameData["intro"];
	userProfile: { name: string; age: number; occupation: string } | null;
	onStart: () => void;
	onSkip: () => void;
}

export function GameIntro({
	intro,
	userProfile,
	onStart,
	onSkip,
}: GameIntroProps) {
	const [currentStep, setCurrentStep] = useState(0);

	const sceneImages = [
		"/scene/d1s1.png",
		"/scene/d1s2.png",
		"/scene/d1s3.png",
		"/scene/d2s1.png",
		"/scene/d2s2.png",
	];

	const introSteps = [
		{
			title: `Welcome, ${userProfile?.name || "Adventurer"}!`,
			content:
				"You're about to embark on a 7-day journey through various workplace and personal scenarios that will help uncover your unique personality traits.",
			image: sceneImages[0],
		},
		{
			title: "Your Mission",
			content:
				"Each day presents realistic situations where you'll need to make choices. Your responses will help us understand your DISC profile, OCEAN traits, and Enneagram type.",
			image: sceneImages[1],
		},
		{
			title: "Be True to Yourself",
			content:
				"Be honest with your choices - there are no right or wrong answers. The goal is to understand yourself better and gain insights into how you navigate different situations.",
			image: sceneImages[2],
		},
		{
			title: "Take Your Time",
			content:
				"Take your time with each scenario, consider the options carefully, and choose what feels most authentic to you.",
			image: sceneImages[3],
		},
	];

	const handleNext = () => {
		if (currentStep < introSteps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			onStart();
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSkip = () => {
		onSkip();
	};

	return (
		<div className="relative flex min-h-screen items-center justify-center bg-[var(--color-background-white)] p-4">
			<div className="w-full max-w-4xl">
				<div className="absolute top-4 right-4">
					<button
						onClick={handleSkip}
						className="font-medium text-[var(--color-primary)]/60 text-sm transition-colors hover:text-[var(--color-primary)]"
					>
						Skip Intro →
					</button>
				</div>

				<div className="relative overflow-hidden rounded-2xl bg-[var(--color-primary)]">
					<div className="absolute top-0 left-0 h-1 w-full bg-gray-200">
						<div
							className="h-full bg-[var(--color-accent)] transition-all duration-300"
							style={{
								width: `${((currentStep + 1) / introSteps.length) * 100}%`,
							}}
						/>
					</div>

					<div className="relative h-64 overflow-hidden md:h-80">
						<Image
							src={introSteps[currentStep]?.image || "/scene/d1s1.png"}
							alt={introSteps[currentStep]?.title || "Game intro"}
							width={800}
							height={320}
							className="h-full w-full object-cover"
						/>
						<div className="absolute inset-0 bg-[var(--color-primary)]/40" />

						<div className="absolute top-4 left-4 rounded-lg bg-[var(--color-accent)] px-4 py-2 font-semibold text-sm text-white">
							{currentStep + 1} of {introSteps.length}
						</div>

						{userProfile && currentStep === 0 && (
							<div className="absolute bottom-4 left-4 rounded-lg bg-[var(--color-primary)]/80 px-4 py-2 text-white backdrop-blur-sm">
								<p className="font-medium text-sm">
									{userProfile.occupation} • Age {userProfile.age}
								</p>
							</div>
						)}
					</div>

					<div className="p-6 md:p-8">
						<h1 className="mb-4 font-bold text-[32px] text-white leading-tight md:text-[40px]">
							{introSteps[currentStep]?.title || "Welcome!"}
						</h1>

						<div className="mb-8 space-y-6">
							<p className="text-lg text-white/90 leading-relaxed">
								{introSteps[currentStep]?.content ||
									"Welcome to your personality journey!"}
							</p>

							<div className="grid grid-cols-3 gap-3">
								<div className="rounded-lg bg-[var(--color-primary-light)] p-4 text-center">
									<span className="mb-2 block text-2xl">🧠</span>
									<p className="font-semibold text-sm text-white">DISC</p>
								</div>
								<div className="rounded-lg bg-[var(--color-accent)] p-4 text-center">
									<span className="mb-2 block text-2xl">🌊</span>
									<p className="font-semibold text-sm text-white">OCEAN</p>
								</div>
								<div className="rounded-lg bg-[var(--color-success)] p-4 text-center">
									<span className="mb-2 block text-2xl">⭐</span>
									<p className="font-semibold text-sm text-white">Enneagram</p>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<button
								onClick={handlePrevious}
								disabled={currentStep === 0}
								className="rounded-lg bg-[var(--color-primary-light)] px-6 py-3 text-white transition-colors hover:bg-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
							>
								← Previous
							</button>

							<div className="flex space-x-2">
								{introSteps.map((step, index) => (
									<div
										key={step.title}
										className={`h-2 w-2 rounded-full transition-all ${
											index === currentStep
												? "w-6 bg-[var(--color-accent)]"
												: "bg-white/30"
										}`}
									/>
								))}
							</div>

							<button
								onClick={handleNext}
								className="rounded-lg bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-accent)]/80"
							>
								{currentStep === introSteps.length - 1
									? "Let's level up!"
									: "Next →"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
