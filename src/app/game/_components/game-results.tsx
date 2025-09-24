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
			trait: "Direct & Decisive",
			value: Math.max(0, scores.disc.D),
			fullMark: 10,
			category: "DISC",
			color: "var(--color-disc-d)",
		},
		{
			trait: "People-Oriented & Enthusiastic",
			value: Math.max(0, scores.disc.I),
			fullMark: 10,
			category: "DISC",
			color: "var(--color-disc-i)",
		},
		{
			trait: "Patient & Supportive",
			value: Math.max(0, scores.disc.S),
			fullMark: 10,
			category: "DISC",
			color: "var(--color-disc-s)",
		},
		{
			trait: "Analytical & Precise",
			value: Math.max(0, scores.disc.C),
			fullMark: 10,
			category: "DISC",
			color: "var(--color-disc-c)",
		},
		// OCEAN traits
		{
			trait: "Creative & Curious",
			value: Math.max(0, scores.ocean.O),
			fullMark: 10,
			category: "OCEAN",
			color: "var(--color-ocean-o)",
		},
		{
			trait: "Organized & Responsible",
			value: Math.max(0, scores.ocean.C),
			fullMark: 10,
			category: "OCEAN",
			color: "var(--color-ocean-c)",
		},
		{
			trait: "Sociable & Assertive",
			value: Math.max(0, scores.ocean.E),
			fullMark: 10,
			category: "OCEAN",
			color: "var(--color-ocean-e)",
		},
		{
			trait: "Cooperative & Empathetic",
			value: Math.max(0, scores.ocean.A),
			fullMark: 10,
			category: "OCEAN",
			color: "var(--color-ocean-a)",
		},
		{
			trait: "Sensitive & Stress-Aware",
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
									Your Behavioral Style
								</h3>
								<div className="space-y-1 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-300">Direct & Decisive:</span>
										<span className="font-bold text-[var(--color-rpg-gold)]">
											{Math.max(0, scores.disc.D)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-300">People-Oriented:</span>
										<span className="font-bold text-[var(--color-rpg-gold)]">
											{Math.max(0, scores.disc.I)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-300">Patient & Supportive:</span>
										<span className="font-bold text-[var(--color-rpg-gold)]">
											{Math.max(0, scores.disc.S)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-300">Analytical & Precise:</span>
										<span className="font-bold text-[var(--color-rpg-gold)]">
											{Math.max(0, scores.disc.C)}
										</span>
									</div>
								</div>
							</div>
							<div>
								<h3 className="mb-2 font-bold text-[var(--color-ocean-o)]">
									Your Character Traits
								</h3>
								<div className="space-y-1 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-300">Creative & Curious:</span>
										<span className="font-bold text-[var(--color-rpg-gold)]">
											{Math.max(0, scores.ocean.O)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-300">
											Organized & Responsible:
										</span>
										<span className="font-bold text-[var(--color-rpg-gold)]">
											{Math.max(0, scores.ocean.C)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-300">Sociable & Assertive:</span>
										<span className="font-bold text-[var(--color-rpg-gold)]">
											{Math.max(0, scores.ocean.E)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-300">
											Cooperative & Empathetic:
										</span>
										<span className="font-bold text-[var(--color-rpg-gold)]">
											{Math.max(0, scores.ocean.A)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-300">
											Sensitive & Stress-Aware:
										</span>
										<span className="font-bold text-[var(--color-rpg-gold)]">
											{Math.max(0, scores.ocean.N)}
										</span>
									</div>
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

				{/* Personality Type Summary */}
				<div className="rpg-card p-6">
					<h3 className="mb-4 text-center font-bold text-2xl text-[var(--color-rpg-gold)]">
						🌟 Your Personality Profile
					</h3>

					<div className="grid gap-6 md:grid-cols-2">
						<div>
							<h4 className="mb-3 font-bold text-[var(--color-disc-d)] text-lg">
								How You Interact & Make Decisions
							</h4>
							<div className="space-y-3">
								<div className="border-[var(--color-disc-d)] border-l-4 pl-3">
									<h5 className="font-bold text-gray-300">Direct & Decisive</h5>
									<p className="text-gray-400 text-sm">
										You're focused on results and taking action quickly
									</p>
								</div>
								<div className="border-[var(--color-disc-i)] border-l-4 pl-3">
									<h5 className="font-bold text-gray-300">
										People-Oriented & Enthusiastic
									</h5>
									<p className="text-gray-400 text-sm">
										You enjoy social interactions and inspiring others
									</p>
								</div>
								<div className="border-[var(--color-disc-s)] border-l-4 pl-3">
									<h5 className="font-bold text-gray-300">
										Patient & Supportive
									</h5>
									<p className="text-gray-400 text-sm">
										You value stability and helping others succeed
									</p>
								</div>
								<div className="border-[var(--color-disc-c)] border-l-4 pl-3">
									<h5 className="font-bold text-gray-300">
										Analytical & Precise
									</h5>
									<p className="text-gray-400 text-sm">
										You focus on accuracy and following procedures
									</p>
								</div>
							</div>
						</div>

						<div>
							<h4 className="mb-3 font-bold text-[var(--color-ocean-o)] text-lg">
								Your Core Character Traits
							</h4>
							<div className="space-y-3">
								<div className="border-[var(--color-ocean-o)] border-l-4 pl-3">
									<h5 className="font-bold text-gray-300">
										Creative & Curious
									</h5>
									<p className="text-gray-400 text-sm">
										You're open to new experiences and love learning
									</p>
								</div>
								<div className="border-[var(--color-ocean-c)] border-l-4 pl-3">
									<h5 className="font-bold text-gray-300">
										Organized & Responsible
									</h5>
									<p className="text-gray-400 text-sm">
										You're dependable and like to plan ahead
									</p>
								</div>
								<div className="border-[var(--color-ocean-e)] border-l-4 pl-3">
									<h5 className="font-bold text-gray-300">
										Sociable & Assertive
									</h5>
									<p className="text-gray-400 text-sm">
										You're outgoing and comfortable taking charge
									</p>
								</div>
								<div className="border-[var(--color-ocean-a)] border-l-4 pl-3">
									<h5 className="font-bold text-gray-300">
										Cooperative & Empathetic
									</h5>
									<p className="text-gray-400 text-sm">
										You value harmony and understanding others
									</p>
								</div>
								<div className="border-[var(--color-ocean-n)] border-l-4 pl-3">
									<h5 className="font-bold text-gray-300">
										Sensitive & Stress-Aware
									</h5>
									<p className="text-gray-400 text-sm">
										You're in tune with emotions and handle pressure
										thoughtfully
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
