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
		<div className="relative flex min-h-screen items-center justify-center bg-[var(--color-background-white)] p-3 md:p-4">
			<div className="w-full max-w-4xl">
				<div className="absolute top-3 right-3 z-10 md:top-4 md:right-4">
					<button
						onClick={handleSkip}
						className="font-medium text-[var(--color-primary)]/60 text-sm transition-colors hover:text-[var(--color-primary)] active:scale-95"
					>
						Skip Intro →
					</button>
				</div>

				<div className="relative overflow-hidden rounded-2xl bg-[var(--color-primary)]">
					<div className="absolute top-0 left-0 z-10 h-1 w-full bg-gray-200">
						<div
							className="h-full bg-[var(--color-accent)] transition-all duration-300"
							style={{
								width: `${((currentStep + 1) / introSteps.length) * 100}%`,
							}}
						/>
					</div>

					<div className="relative h-48 overflow-hidden sm:h-56 md:h-64 lg:h-80">
						<Image
							src={introSteps[currentStep]?.image || "/scene/d1s1.png"}
							alt={introSteps[currentStep]?.title || "Game intro"}
							width={800}
							height={320}
							className="h-full w-full object-cover"
							priority
						/>
						<div className="absolute inset-0 bg-[var(--color-primary)]/40" />

						<div className="absolute top-3 left-3 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 font-semibold text-white text-xs md:top-4 md:left-4 md:px-4 md:py-2 md:text-sm">
							{currentStep + 1} of {introSteps.length}
						</div>

						{userProfile && currentStep === 0 && (
							<div className="absolute bottom-3 left-3 rounded-lg bg-[var(--color-primary)]/80 px-3 py-1.5 text-white backdrop-blur-sm md:bottom-4 md:left-4 md:px-4 md:py-2">
								<p className="font-medium text-xs md:text-sm">
									{userProfile.occupation} • Age {userProfile.age}
								</p>
							</div>
						)}
					</div>

					<div className="p-4 md:p-6 lg:p-8">
						<h1 className="mb-3 font-bold text-2xl text-white leading-tight md:mb-4 md:text-3xl lg:text-[40px]">
							{introSteps[currentStep]?.title || "Welcome!"}
						</h1>

						<div className="mb-6 space-y-4 md:mb-8 md:space-y-6">
							<p className="text-base text-white/90 leading-relaxed md:text-lg">
								{introSteps[currentStep]?.content ||
									"Welcome to your personality journey!"}
							</p>

							<div className="grid grid-cols-3 gap-2 md:gap-3">
								<div className="rounded-lg bg-[var(--color-primary-light)] p-3 text-center md:p-4">
									<span className="mb-1 block text-xl md:text-2xl">🧠</span>
									<p className="font-semibold text-white text-xs md:text-sm">
										Behavioral Style
									</p>
								</div>
								<div className="rounded-lg bg-[var(--color-accent)] p-3 text-center md:p-4">
									<span className="mb-1 block text-xl md:text-2xl">🌊</span>
									<p className="font-semibold text-white text-xs md:text-sm">
										Character Traits
									</p>
								</div>
								<div className="rounded-lg bg-[var(--color-success)] p-3 text-center md:p-4">
									<span className="mb-1 block text-xl md:text-2xl">⭐</span>
									<p className="font-semibold text-white text-xs md:text-sm">
										Core Motivations
									</p>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<button
								onClick={handlePrevious}
								disabled={currentStep === 0}
								className="rounded-lg bg-[var(--color-primary-light)] px-4 py-2.5 text-sm text-white transition-colors hover:bg-[var(--color-primary)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3"
							>
								← Previous
							</button>

							<div className="flex justify-center space-x-1.5 sm:space-x-2">
								{introSteps.map((step, index) => (
									<div
										key={step.title}
										className={`h-1.5 w-1.5 rounded-full transition-all sm:h-2 sm:w-2 ${
											index === currentStep
												? "w-4 bg-[var(--color-accent)] sm:w-6"
												: "bg-white/30"
										}`}
									/>
								))}
							</div>

							<button
								onClick={handleNext}
								className="rounded-lg bg-[var(--color-accent)] px-4 py-2.5 font-semibold text-sm text-white transition-colors hover:bg-[var(--color-accent)]/80 active:scale-95 sm:px-6 sm:py-3"
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
