"use client";

import type { UserScores } from "@/types/game";
import { DISC_TRAITS, ENNEAGRAM_MOTIVATIONS, OCEAN_TRAITS } from "@/types/game";
import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
} from "recharts";

interface GameResultsProps {
	scores: UserScores;
	totalPoints: number;
	onRestart: () => void;
}

export function GameResults({
	scores,
	totalPoints,
	onRestart,
}: GameResultsProps) {
	// Prepare data for the combined DISC + OCEAN radar chart
	const chartData = [
		// DISC traits
		{
			trait: "Dominance",
			value: Math.max(0, scores.disc.D),
			fullMark: 10,
			category: "DISC",
			color: "var(--color-disc-d)",
		},
		{
			trait: "Influence",
			value: Math.max(0, scores.disc.I),
			fullMark: 10,
			category: "DISC",
			color: "var(--color-disc-i)",
		},
		{
			trait: "Steadiness",
			value: Math.max(0, scores.disc.S),
			fullMark: 10,
			category: "DISC",
			color: "var(--color-disc-s)",
		},
		{
			trait: "Conscientiousness",
			value: Math.max(0, scores.disc.C),
			fullMark: 10,
			category: "DISC",
			color: "var(--color-disc-c)",
		},
		// OCEAN traits
		{
			trait: "Openness",
			value: Math.max(0, scores.ocean.O),
			fullMark: 10,
			category: "OCEAN",
			color: "var(--color-ocean-o)",
		},
		{
			trait: "Extraversion",
			value: Math.max(0, scores.ocean.E),
			fullMark: 10,
			category: "OCEAN",
			color: "var(--color-ocean-e)",
		},
		{
			trait: "Agreeableness",
			value: Math.max(0, scores.ocean.A),
			fullMark: 10,
			category: "OCEAN",
			color: "var(--color-ocean-a)",
		},
		{
			trait: "Neuroticism",
			value: Math.max(0, scores.ocean.N),
			fullMark: 10,
			category: "OCEAN",
			color: "var(--color-ocean-n)",
		},
	];

	// Find dominant Enneagram type
	const enneagramEntries = Object.entries(scores.enneagram) as [
		string,
		number,
	][];
	const dominantEnneagram = enneagramEntries.reduce((max, current) =>
		current[1] > max[1] ? current : max,
	);
	const [dominantType, dominantScore] = dominantEnneagram;

	// Get top 3 Enneagram motivations
	const topEnneagram = enneagramEntries
		.sort(([, a], [, b]) => b - a)
		.slice(0, 3)
		.filter(([, score]) => score > 0);

	return (
		<div className="min-h-screen p-4">
			<div className="mx-auto max-w-6xl space-y-8">
				{/* Header */}
				<div className="rpg-card p-8 text-center">
					<div className="space-y-4">
						<div className="text-4xl">🏆</div>
						<h1 className="font-bold text-4xl text-[var(--color-rpg-gold)]">
							Your Personality Quest Complete!
						</h1>
						<p className="text-gray-300 text-xl">
							You've earned{" "}
							<span className="font-bold text-[var(--color-rpg-gold)]">
								{totalPoints} ⭐
							</span>{" "}
							adventure points
						</p>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-2">
					{/* Combined DISC + OCEAN Radar Chart */}
					<div className="rpg-card p-6">
						<h2 className="mb-6 font-bold text-2xl text-[var(--color-rpg-gold)]">
							📊 Your Personality Profile
						</h2>

						<div className="mb-6 h-96">
							<ResponsiveContainer width="100%" height="100%">
								<RadarChart data={chartData}>
									<PolarGrid
										gridType="polygon"
										stroke="var(--color-rpg-border)"
									/>
									<PolarAngleAxis
										dataKey="trait"
										tick={{
											fill: "var(--color-rpg-gold)",
											fontSize: 12,
											fontWeight: "bold",
										}}
									/>
									<PolarRadiusAxis
										angle={90}
										domain={[0, 10]}
										tick={{
											fill: "var(--color-gray-400)",
											fontSize: 10,
										}}
									/>
									<Radar
										name="Traits"
										dataKey="value"
										stroke="var(--color-rpg-gold)"
										fill="var(--color-rpg-gold)"
										fillOpacity={0.2}
										strokeWidth={2}
									/>
								</RadarChart>
							</ResponsiveContainer>
						</div>

						{/* Legend */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="mb-2 font-bold text-[var(--color-disc-d)]">
									DISC Traits
								</h3>
								<div className="space-y-1 text-sm">
									{Object.entries(DISC_TRAITS).map(([key, trait]) => (
										<div key={key} className="flex justify-between">
											<span className="text-gray-300">{trait.name}:</span>
											<span className="font-bold text-[var(--color-rpg-gold)]">
												{Math.max(
													0,
													scores.disc[key as keyof typeof scores.disc],
												)}
											</span>
										</div>
									))}
								</div>
							</div>
							<div>
								<h3 className="mb-2 font-bold text-[var(--color-ocean-o)]">
									OCEAN Traits
								</h3>
								<div className="space-y-1 text-sm">
									{Object.entries(OCEAN_TRAITS).map(([key, trait]) => (
										<div key={key} className="flex justify-between">
											<span className="text-gray-300">{trait.name}:</span>
											<span className="font-bold text-[var(--color-rpg-gold)]">
												{Math.max(
													0,
													scores.ocean[key as keyof typeof scores.ocean],
												)}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Enneagram Core Motivations */}
					<div className="space-y-8">
						{/* Dominant Enneagram Type */}
						<div className="rpg-card p-6">
							<h2 className="mb-4 font-bold text-2xl text-[var(--color-rpg-gold)]">
								🎭 Your Core Motivation
							</h2>

							<div className="rounded-lg bg-gradient-to-r from-[var(--color-rpg-gold)] to-[var(--color-rpg-bronze)] p-6">
								<div className="rounded bg-[var(--color-rpg-dark)] p-4">
									<h3 className="mb-2 font-bold text-[var(--color-rpg-gold)] text-xl">
										{
											ENNEAGRAM_MOTIVATIONS[
												dominantType as keyof typeof ENNEAGRAM_MOTIVATIONS
											]?.name
										}
									</h3>
									<p className="text-sm text-white">
										{ENNEAGRAM_MOTIVATIONS[
											dominantType as keyof typeof ENNEAGRAM_MOTIVATIONS
										]?.description || "No description available"}
									</p>
									<div className="mt-2 text-right">
										<span className="font-bold text-[var(--color-rpg-gold)]">
											Score: {dominantScore}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Top Motivations */}
						<div className="rpg-card p-6">
							<h3 className="mb-4 font-bold text-[var(--color-rpg-gold)] text-xl">
								⚡ Your Top Motivations
							</h3>

							<div className="space-y-3">
								{topEnneagram.map(([type, score], index) => (
									<div
										key={type}
										className="rounded-lg bg-[var(--color-rpg-border)] p-4"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h4 className="mb-1 font-bold text-gray-300">
													#{index + 1}{" "}
													{ENNEAGRAM_MOTIVATIONS[
														type as keyof typeof ENNEAGRAM_MOTIVATIONS
													]?.name || "Unknown Type"}
												</h4>
												<p className="text-gray-400 text-sm">
													{ENNEAGRAM_MOTIVATIONS[
														type as keyof typeof ENNEAGRAM_MOTIVATIONS
													]?.description || "No description available"}
												</p>
											</div>
											<div className="ml-4 font-bold text-[var(--color-rpg-gold)]">
												{score}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Actions */}
						<div className="rpg-card p-6 text-center">
							<h3 className="mb-4 font-bold text-[var(--color-rpg-gold)] text-lg">
								🎮 What's Next?
							</h3>

							<div className="space-y-4">
								<button onClick={onRestart} className="rpg-button w-full">
									🔄 Start New Quest
								</button>

								<div className="text-gray-400 text-sm">
									<p>
										Want to explore more? Try the assessment again with
										different choices!
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Trait Descriptions */}
				<div className="grid gap-8 md:grid-cols-2">
					<div className="rpg-card p-6">
						<h3 className="mb-4 font-bold text-[var(--color-rpg-gold)] text-xl">
							🎯 DISC Traits Explained
						</h3>
						<div className="space-y-3">
							{Object.entries(DISC_TRAITS).map(([key, trait]) => (
								<div
									key={key}
									className="border-[var(--color-disc-d)] border-l-4 pl-3"
								>
									<h4 className="font-bold text-gray-300">{trait.name}</h4>
									<p className="text-gray-400 text-sm">{trait.description}</p>
								</div>
							))}
						</div>
					</div>

					<div className="rpg-card p-6">
						<h3 className="mb-4 font-bold text-[var(--color-rpg-gold)] text-xl">
							🌊 OCEAN Traits Explained
						</h3>
						<div className="space-y-3">
							{Object.entries(OCEAN_TRAITS).map(([key, trait]) => (
								<div
									key={key}
									className="border-[var(--color-ocean-o)] border-l-4 pl-3"
								>
									<h4 className="font-bold text-gray-300">{trait.name}</h4>
									<p className="text-gray-400 text-sm">{trait.description}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
