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

interface TraitDetail {
	key: string;
	name: string;
	description: string;
	color: string;
	icon: string;
}

interface IntroStepDetails {
	framework: string;
	traits: TraitDetail[];
}

interface IntroStep {
	title: string;
	content: string;
	image: string;
	details: IntroStepDetails | null;
}

export function GameIntro({
	intro,
	userProfile,
	onStart,
	onSkip,
}: GameIntroProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [activeFramework, setActiveFramework] = useState<
		"disc" | "ocean" | "enneagram"
	>("disc");

	const sceneImages = [
		"/scene/d1s1.png",
		"/scene/d1s2.png",
		"/scene/d1s3.png",
		"/scene/d2s1.png",
		"/scene/d2s2.png",
	];

	// Condensed personality framework data
	const frameworks = {
		disc: {
			title: "DISC Behavioral Style",
			description: "How you naturally behave and communicate",
			icon: "🧠",
			color: "var(--color-disc-d, #ff6b6b)",
			traits: [
				{
					key: "D",
					name: "Dominance",
					desc: "Direct, decisive, results-oriented",
					icon: "⚡",
				},
				{
					key: "I",
					name: "Influence",
					desc: "Enthusiastic, people-oriented, talkative",
					icon: "🗣️",
				},
				{
					key: "S",
					name: "Steadiness",
					desc: "Patient, predictable, stable",
					icon: "🤝",
				},
				{
					key: "C",
					name: "Conscientiousness",
					desc: "Precise, analytical, systematic",
					icon: "📋",
				},
			],
		},
		ocean: {
			title: "OCEAN Personality Traits",
			description: "Your core personality dimensions",
			icon: "🌊",
			color: "var(--color-ocean-o, #e17055)",
			traits: [
				{
					key: "O",
					name: "Openness",
					desc: "Creativity, curiosity, new experiences",
					icon: "🎨",
				},
				{
					key: "C",
					name: "Conscientiousness",
					desc: "Organization, responsibility, dependability",
					icon: "📊",
				},
				{
					key: "E",
					name: "Extraversion",
					desc: "Sociability, assertiveness, talkativeness",
					icon: "🌟",
				},
				{
					key: "A",
					name: "Agreeableness",
					desc: "Cooperation, trust, empathy",
					icon: "💝",
				},
				{
					key: "N",
					name: "Neuroticism",
					desc: "Emotional sensitivity, stress awareness",
					icon: "⚡",
				},
			],
		},
		enneagram: {
			title: "Enneagram Motivations",
			description: "Your deepest fears and desires",
			icon: "⭐",
			color: "var(--color-enneagram-3, #fdcb6e)",
			traits: [
				{
					key: "1",
					name: "Perfectionist",
					desc: "Desire to be good/right",
					icon: "⚖️",
				},
				{
					key: "2",
					name: "Helper",
					desc: "Desire to be loved/needed",
					icon: "💙",
				},
				{
					key: "3",
					name: "Achiever",
					desc: "Desire to be valuable/worthwhile",
					icon: "🏆",
				},
				{
					key: "4",
					name: "Individualist",
					desc: "Desire to find self/significance",
					icon: "🎭",
				},
				{
					key: "5",
					name: "Investigator",
					desc: "Desire to be competent/understand",
					icon: "🔍",
				},
				{
					key: "6",
					name: "Loyalist",
					desc: "Desire for security/support",
					icon: "🛡️",
				},
				{
					key: "7",
					name: "Enthusiast",
					desc: "Desire happiness/satisfaction",
					icon: "✨",
				},
				{
					key: "8",
					name: "Challenger",
					desc: "Desire self-reliance/control",
					icon: "💪",
				},
				{
					key: "9",
					name: "Peacemaker",
					desc: "Desire inner/outer peace",
					icon: "🕊️",
				},
			],
		},
	};

	const introSteps: IntroStep[] = [
		{
			title: `Welcome, ${userProfile?.name || "Adventurer"}!`,
			content:
				"Embark on a 14-day workplace journey that reveals your personality across three comprehensive frameworks.",
			image: sceneImages[0] || "/scene/d1s1.png",
			details: null,
		},
		{
			title: "DISC Behavioral Style",
			content:
				"Discover how you naturally behave and communicate in different situations through four key dimensions:",
			image: sceneImages[1] || "/scene/d1s2.png",
			details: {
				framework: "DISC",
				traits: frameworks.disc.traits.map((trait) => ({
					key: trait.key,
					name: trait.name,
					description: trait.desc,
					color: "var(--color-disc, #ff6b6b)",
					icon: trait.icon,
				})),
			},
		},
		{
			title: "OCEAN Personality Traits",
			content:
				"Explore your core personality dimensions that shape how you think, feel, and behave:",
			image: sceneImages[2] || "/scene/d1s3.png",
			details: {
				framework: "OCEAN",
				traits: frameworks.ocean.traits.map((trait) => ({
					key: trait.key,
					name: trait.name,
					description: trait.desc,
					color: "var(--color-ocean, #e17055)",
					icon: trait.icon,
				})),
			},
		},
		{
			title: "Enneagram Core Motivations",
			content:
				"Uncover the deepest fears and desires that drive your behavior across nine personality types:",
			image: sceneImages[3] || "/scene/d2s1.png",
			details: {
				framework: "Enneagram",
				traits: frameworks.enneagram.traits.map((trait) => ({
					key: trait.key,
					name: trait.name,
					description: trait.desc,
					color: "var(--color-enneagram, #fdcb6e)",
					icon: trait.icon,
				})),
			},
		},
		{
			title: "Ready to Begin?",
			content:
				"No right or wrong answers - choose what feels natural to you. Your authentic responses create your unique personality profile.",
			image: sceneImages[4] || "/scene/d2s2.png",
			details: null,
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

					<div className="relative h-32 overflow-hidden sm:h-40 md:h-48">
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

					<div className="p-3 md:p-4 lg:p-6">
						<h1 className="mb-3 font-bold text-2xl text-white leading-tight md:mb-4 md:text-3xl lg:text-[40px]">
							{introSteps[currentStep]?.title || "Welcome!"}
						</h1>

						<div className="mb-4 space-y-3 md:mb-5 md:space-y-4">
							<p className="text-sm text-white/90 leading-relaxed md:text-base">
								{introSteps[currentStep]?.content ||
									"Welcome to your personality journey!"}
							</p>

							{/* Framework Details - Show when available */}
							{introSteps[currentStep]?.details ? (
								<div className="space-y-2">
									<div className="grid grid-cols-2 gap-2 md:gap-3">
										{introSteps[currentStep].details.traits.map((trait) => (
											<div
												key={trait.key}
												className="rounded-lg bg-white/10 p-2 md:p-3"
											>
												<div className="mb-1 flex items-center gap-2">
													<span className="text-sm md:text-base">
														{trait.icon}
													</span>
													<h4 className="font-bold text-white text-xs md:text-sm">
														{trait.key} - {trait.name}
													</h4>
												</div>
												<p className="text-white/80 text-xs leading-relaxed">
													{trait.description}
												</p>
											</div>
										))}
									</div>
								</div>
							) : (
								/* Overview cards for welcome and final steps */
								<div className="grid grid-cols-3 gap-2">
									<div className="rounded-lg bg-[var(--color-primary-light)] p-2 text-center md:p-3">
										<span className="mb-1 block text-lg md:text-xl">🧠</span>
										<p className="font-semibold text-white text-xs">
											DISC Style
										</p>
									</div>
									<div className="rounded-lg bg-[var(--color-accent)] p-2 text-center md:p-3">
										<span className="mb-1 block text-lg md:text-xl">🌊</span>
										<p className="font-semibold text-white text-xs">
											OCEAN Traits
										</p>
									</div>
									<div className="rounded-lg bg-[var(--color-success)] p-2 text-center md:p-3">
										<span className="mb-1 block text-lg md:text-xl">⭐</span>
										<p className="font-semibold text-white text-xs">
											Enneagram
										</p>
									</div>
								</div>
							)}
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
