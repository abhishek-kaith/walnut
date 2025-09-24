"use client";

import type { UserScores } from "@/types/game";
import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
} from "recharts";

interface GameDayCompleteProps {
	dayNumber: number;
	dayTitle: string;
	pointsEarned: number;
	totalPoints: number;
	scores: UserScores;
	isLastDay: boolean;
	onContinue: () => void;
}

const DISC_LABELS = {
	D: "Dominance",
	I: "Influence",
	C: "Conscientiousness",
	S: "Steadiness",
};
const OCEAN_LABELS = {
	O: "Openness",
	C: "Conscientiousness",
	E: "Extraversion",
	A: "Agreeableness",
	N: "Neuroticism",
};

export function GameDayComplete({
	dayNumber,
	dayTitle,
	pointsEarned,
	totalPoints,
	scores,
	isLastDay,
	onContinue,
}: GameDayCompleteProps) {
	const getTopTrait = (obj: Record<string, number>) => {
		return Object.entries(obj).reduce(
			(max, [key, value]) => (value > max.value ? { key, value } : max),
			{ key: "", value: 0 },
		);
	};

	const topDisc = getTopTrait(scores.disc);
	const topOcean = getTopTrait(scores.ocean);

	// Prepare radar chart data
	const discData = Object.entries(scores.disc).map(([key, value]) => ({
		trait: key,
		score: Math.max(0, value),
		fullMark: Math.max(...Object.values(scores.disc), 1),
	}));

	const oceanData = Object.entries(scores.ocean).map(([key, value]) => ({
		trait: key,
		score: Math.max(0, value),
		fullMark: Math.max(...Object.values(scores.ocean), 1),
	}));

	return (
		<div className="flex min-h-screen items-center justify-center bg-[var(--color-background-white)] p-4">
			<div className="w-full max-w-4xl space-y-6">
				<div className="text-center">
					<div className="mb-4 inline-flex items-center space-x-3 rounded-xl bg-[var(--color-success)] px-6 py-3 text-white">
						<span className="text-2xl">🎉</span>
						<span className="font-semibold text-lg">
							Day {dayNumber} Complete!
						</span>
					</div>
					<h1 className="mb-2 font-bold text-[40px] text-[var(--color-primary)] leading-tight">
						Daily Summary
					</h1>
					<p className="text-[var(--color-primary)]/80 text-lg">
						Here's how your choices shaped your personality profile today
					</p>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="rounded-xl bg-[var(--color-primary)] p-4">
						<div className="mb-3 flex items-center space-x-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]">
								<span className="text-lg">🌰</span>
							</div>
							<h3 className="font-semibold text-lg text-white">
								Points Earned
							</h3>
						</div>
						<div className="text-center">
							<div className="mb-1 font-bold text-3xl text-[var(--color-accent)]">
								+{pointsEarned}
							</div>
							<div className="text-white/80">Total: {totalPoints}</div>
						</div>
					</div>

					<div className="rounded-xl bg-[var(--color-primary-light)] p-4">
						<div className="mb-3 flex items-center space-x-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
								<span className="text-lg">🧠</span>
							</div>
							<h3 className="font-semibold text-lg text-white">
								Top DISC Trait
							</h3>
						</div>
						<div className="text-center">
							<div className="mb-1 font-bold text-white text-xl">
								{DISC_LABELS[topDisc.key as keyof typeof DISC_LABELS] ||
									"Unknown"}
							</div>
							<div className="text-white/80">Score: {topDisc.value || 0}</div>
						</div>
					</div>

					<div className="rounded-xl bg-[var(--color-accent)] p-4">
						<div className="mb-3 flex items-center space-x-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
								<span className="text-lg">🌊</span>
							</div>
							<h3 className="font-semibold text-lg text-white">
								Top OCEAN Trait
							</h3>
						</div>
						<div className="text-center">
							<div className="mb-1 font-bold text-white text-xl">
								{OCEAN_LABELS[topOcean.key as keyof typeof OCEAN_LABELS] ||
									"Unknown"}
							</div>
							<div className="text-white/80">Score: {topOcean.value || 0}</div>
						</div>
					</div>
				</div>

				<div className="rounded-xl bg-[var(--color-primary)] p-6">
					<h3 className="mb-6 text-center font-semibold text-white text-xl">
						Today's Personality Traits
					</h3>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<h4 className="mb-3 text-center font-medium text-lg text-white">
								DISC Profile
							</h4>
							<div className="h-48">
								<ResponsiveContainer width="100%" height="100%">
									<RadarChart data={discData}>
										<PolarGrid stroke="rgba(255,255,255,0.2)" />
										<PolarAngleAxis
											dataKey="trait"
											tick={{ fill: "white", fontSize: 10 }}
										/>
										<PolarRadiusAxis
											angle={45}
											domain={[0, "dataMax"]}
											tick={{ fill: "white", fontSize: 8 }}
										/>
										<Radar
											name="DISC"
											dataKey="score"
											stroke="var(--color-primary-light)"
											fill="var(--color-primary-light)"
											fillOpacity={0.3}
											strokeWidth={2}
										/>
									</RadarChart>
								</ResponsiveContainer>
							</div>
							<div className="mt-3 grid grid-cols-4 gap-2">
								{Object.entries(scores.disc).map(([key, value]) => (
									<div key={key} className="text-center">
										<div className="rounded-lg bg-[var(--color-primary-light)] p-2">
											<div className="text-white/80 text-xs">{key}</div>
											<div className="font-semibold text-sm text-white">
												{value}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<div>
							<h4 className="mb-3 text-center font-medium text-lg text-white">
								OCEAN Traits
							</h4>
							<div className="h-48">
								<ResponsiveContainer width="100%" height="100%">
									<RadarChart data={oceanData}>
										<PolarGrid stroke="rgba(255,255,255,0.2)" />
										<PolarAngleAxis
											dataKey="trait"
											tick={{ fill: "white", fontSize: 10 }}
										/>
										<PolarRadiusAxis
											angle={45}
											domain={[0, "dataMax"]}
											tick={{ fill: "white", fontSize: 8 }}
										/>
										<Radar
											name="OCEAN"
											dataKey="score"
											stroke="var(--color-accent)"
											fill="var(--color-accent)"
											fillOpacity={0.3}
											strokeWidth={2}
										/>
									</RadarChart>
								</ResponsiveContainer>
							</div>
							<div className="mt-3 grid grid-cols-5 gap-1">
								{Object.entries(scores.ocean).map(([key, value]) => (
									<div key={key} className="text-center">
										<div className="rounded-lg bg-[var(--color-accent)] p-2">
											<div className="text-white/80 text-xs">{key}</div>
											<div className="font-semibold text-sm text-white">
												{value}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="rounded-xl bg-[var(--color-success)] p-4">
					<div className="flex items-center space-x-3">
						<div className="text-2xl">🏆</div>
						<div>
							<h4 className="font-semibold text-white">
								Achievement Unlocked!
							</h4>
							<p className="text-sm text-white/80">
								Day {dayNumber} Explorer - You've completed{" "}
								{dayNumber === 1 ? "your first day" : `${dayNumber} days`} of
								the journey
							</p>
						</div>
					</div>
				</div>

				<div className="text-center">
					<button
						onClick={onContinue}
						className="rounded-lg bg-[var(--color-accent)] px-8 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-accent)]/80"
					>
						{isLastDay
							? "View Final Results"
							: `Continue to Day ${dayNumber + 1}`}
					</button>
				</div>
			</div>
		</div>
	);
}
