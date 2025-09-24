import * as fs from "node:fs";
import * as path from "node:path";

interface DiscType {
	D?: number;
	I?: number;
	S?: number;
	C?: number;
}

interface OceanType {
	O?: number;
	C?: number;
	E?: number;
	A?: number;
	N?: number;
}

interface EnneagramType {
	[key: string]: number;
}

interface TraitDeltas {
	disc?: DiscType;
	ocean?: OceanType;
	enneagram?: EnneagramType;
}

interface Choice {
	id: string;
	text: string;
	deltas?: TraitDeltas;
}

interface Scene {
	id: string;
	title: string;
	description: string[];
	choices: Choice[];
	imageUrl?: string;
}

interface Day {
	id: string;
	title: string;
	scenes: Scene[];
}

interface GameData {
	days: Day[];
}

interface ScoreEntry {
	Day: number;
	Scene: number;
	Option: string;
	"DISC Delta": string;
	"OCEAN Delta": string;
	"Enneagram Delta": string;
}

const parseDiscDelta = (deltaStr: string): DiscType => {
	const result: DiscType = {};
	if (!deltaStr) return result;

	const parts = deltaStr.split(", ");
	for (const part of parts) {
		const match = part.trim().match(/([DISC])([+-])(\d+)/);
		if (match) {
			const [, trait, sign, value] = match;
			const numValue = Number.parseInt(value) * (sign === "+" ? 1 : -1);
			result[trait as keyof DiscType] = numValue;
		}
	}
	return result;
};

const parseOceanDelta = (deltaStr: string): OceanType => {
	const result: OceanType = {};
	if (!deltaStr) return result;

	const parts = deltaStr.split(", ");
	for (const part of parts) {
		const match = part.trim().match(/([OCEAN])([+-])(\d+)/);
		if (match) {
			const [, trait, sign, value] = match;
			const numValue = Number.parseInt(value) * (sign === "+" ? 1 : -1);
			result[trait as keyof OceanType] = numValue;
		}
	}
	return result;
};

const parseEnneagramDelta = (deltaStr: string): EnneagramType => {
	const result: EnneagramType = {};
	if (!deltaStr) return result;

	const parts = deltaStr.split("+");
	for (const part of parts) {
		const match = part.trim().match(/Type (\d+)/);
		if (match) {
			const typeNum = Number.parseInt(match[1]);
			const key = `type${typeNum}`;
			result[key] = (result[key] || 0) + 1;
		}
	}
	return result;
};

const parseMarkdownFile = (filePath: string): Map<string, Scene> => {
	const content = fs.readFileSync(filePath, "utf-8");
	const sceneMap = new Map<string, Scene>();

	const lines = content.split("\n");

	let currentDay = 0;
	let currentScene = 0;
	let currentSceneTitle = "";
	let currentDescription: string[] = [];
	let currentChoices: Choice[] = [];
	let inDescription = false;
	let inChoices = false;

	const finalizeScene = () => {
		if (currentDay > 0 && currentScene > 0 && currentSceneTitle) {
			const sceneId = `day-${currentDay}-scene-${currentScene}`;
			const scene: Scene = {
				id: sceneId,
				title: currentSceneTitle,
				description: currentDescription.filter((line) => line.trim() !== ""),
				choices: currentChoices,
				imageUrl: `/scene/d${currentDay}s${currentScene}.png`,
			};
			sceneMap.set(`${currentDay}-${currentScene}`, scene);
		}

		// Reset for next scene
		currentDescription = [];
		currentChoices = [];
		currentSceneTitle = "";
		inDescription = false;
		inChoices = false;
	};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Day header: ## Day 1
		if (line.match(/^## Day (\d+)/)) {
			finalizeScene(); // Finalize previous scene if any
			const dayMatch = line.match(/^## Day (\d+)/);
			if (dayMatch) {
				currentDay = Number.parseInt(dayMatch[1]);
				currentScene = 0;
			}
			continue;
		}

		// Scene header: ### Scene 1: Title
		if (line.match(/^### Scene (\d+):/)) {
			finalizeScene(); // Finalize previous scene
			const sceneMatch = line.match(/^### Scene (\d+): (.+)/);
			if (sceneMatch) {
				currentScene = Number.parseInt(sceneMatch[1]);
				currentSceneTitle = `Scene ${currentScene}: ${sceneMatch[2]}`;
				inDescription = true;
				inChoices = false;
			}
			continue;
		}

		// Skip separators and empty lines at scene boundaries
		if (line === "---" || line === "") {
			continue;
		}

		// Skip "What do you do?" lines
		if (line === "What do you do?") {
			inDescription = false;
			continue;
		}

		// Choice options: * A. or * B. or * C.
		if (line.match(/^\* [ABC]\./)) {
			if (!inChoices) {
				inChoices = true;
				inDescription = false;
			}

			const choiceMatch = line.match(/^\* ([ABC])\. (.+)/);
			if (choiceMatch) {
				const choiceId = choiceMatch[1].toLowerCase();
				const choiceText = `${choiceMatch[1]}. ${choiceMatch[2]}`;

				currentChoices.push({
					id: `day-${currentDay}-scene-${currentScene}-${choiceId}`,
					text: choiceText,
				});
			}
			continue;
		}

		// Description lines (before choices)
		if (inDescription && !inChoices && line !== "") {
			currentDescription.push(line);
		}
	}

	// Finalize the last scene
	finalizeScene();

	return sceneMap;
};

const main = (): void => {
	console.log("=== GENERATING COMPLETE GAME DATA ===\n");

	const scriptDir = path.dirname(__filename);
	const projectRoot = path.join(scriptDir, "..");

	// Read markdown file
	const markdownPath = path.join(projectRoot, "data", "day-scene.md");
	const scenesMap = parseMarkdownFile(markdownPath);
	console.log(`📖 Parsed ${scenesMap.size} scenes from markdown`);

	// Read score data
	const scorePath = path.join(projectRoot, "data", "score.json");
	const scoreData: ScoreEntry[] = JSON.parse(
		fs.readFileSync(scorePath, "utf-8"),
	);
	console.log(`📊 Loaded ${scoreData.length} personality entries`);

	// Group score data by day and scene
	const scoreMap = new Map<string, ScoreEntry[]>();
	for (const entry of scoreData) {
		const key = `${entry.Day}-${entry.Scene}`;
		if (!scoreMap.has(key)) {
			scoreMap.set(key, []);
		}
		scoreMap.get(key)?.push(entry);
	}

	// Build complete game data
	const daysMap = new Map<number, Day>();

	// Process each scene - either from markdown or from score data
	const allSceneKeys = new Set([...scenesMap.keys(), ...scoreMap.keys()]);

	for (const key of allSceneKeys) {
		const [dayNum, sceneNum] = key.split("-").map(Number);
		const scoreEntries = scoreMap.get(key) || [];
		const markdownScene = scenesMap.get(key);

		let choices: Choice[] = [];

		if (markdownScene && markdownScene.choices.length > 0) {
			// Use choices from markdown and add personality data
			choices = markdownScene.choices.map((choice) => {
				const choiceId = choice.id.split("-").pop() || ""; // Get 'a', 'b', 'c', or 'd'
				const scoreEntry = scoreEntries.find(
					(entry) => entry.Option.charAt(0).toLowerCase() === choiceId,
				);

				if (scoreEntry) {
					const discDelta = parseDiscDelta(scoreEntry["DISC Delta"]);
					const oceanDelta = parseOceanDelta(scoreEntry["OCEAN Delta"]);
					const enneagramDelta = parseEnneagramDelta(
						scoreEntry["Enneagram Delta"],
					);

					const deltas: TraitDeltas = {};
					if (Object.keys(discDelta).length > 0) deltas.disc = discDelta;
					if (Object.keys(oceanDelta).length > 0) deltas.ocean = oceanDelta;
					if (Object.keys(enneagramDelta).length > 0)
						deltas.enneagram = enneagramDelta;

					return {
						...choice,
						...(Object.keys(deltas).length > 0 && { deltas }),
					};
				}

				return choice;
			});
		} else if (scoreEntries.length > 0) {
			// Generate choices from score data when markdown is missing
			choices = scoreEntries.map((entry) => {
				const choiceId = entry.Option.charAt(0).toLowerCase();
				const discDelta = parseDiscDelta(entry["DISC Delta"]);
				const oceanDelta = parseOceanDelta(entry["OCEAN Delta"]);
				const enneagramDelta = parseEnneagramDelta(entry["Enneagram Delta"]);

				const deltas: TraitDeltas = {};
				if (Object.keys(discDelta).length > 0) deltas.disc = discDelta;
				if (Object.keys(oceanDelta).length > 0) deltas.ocean = oceanDelta;
				if (Object.keys(enneagramDelta).length > 0)
					deltas.enneagram = enneagramDelta;

				return {
					id: `day-${dayNum}-scene-${sceneNum}-${choiceId}`,
					text: entry.Option,
					...(Object.keys(deltas).length > 0 && { deltas }),
				};
			});
		}

		// Skip if no choices available
		if (choices.length === 0) return;

		// Generate image URL based on naming pattern
		const imageUrl = `/scene/d${dayNum}s${sceneNum}.png`;

		// Create scene
		const scene: Scene = {
			id: `day-${dayNum}-scene-${sceneNum}`,
			title: markdownScene?.title || `Scene ${sceneNum}`,
			description: markdownScene?.description || [
				`Day ${dayNum}, Scene ${sceneNum} - Content available from choice data`,
			],
			choices,
			imageUrl,
		};

		// Add to day
		if (!daysMap.has(dayNum)) {
			daysMap.set(dayNum, {
				id: `day-${dayNum}`,
				title: `Day ${dayNum}`,
				scenes: [],
			});
		}

		daysMap.get(dayNum)?.scenes.push(scene);
	}

	// Convert to sorted array
	const days = Array.from(daysMap.values()).sort((a, b) => {
		const aNum = Number.parseInt(a.id.split("-")[1]);
		const bNum = Number.parseInt(b.id.split("-")[1]);
		return aNum - bNum;
	});

	// Sort scenes within each day
	for (const day of days) {
		day.scenes.sort((a, b) => {
			const aNum = Number.parseInt(a.id.split("-")[3]);
			const bNum = Number.parseInt(b.id.split("-")[3]);
			return aNum - bNum;
		});
	}

	const gameData: GameData = { days };

	// Write final output
	const outputPath = path.join(projectRoot, "data", "final-game-data.json");
	fs.writeFileSync(outputPath, JSON.stringify(gameData, null, 2));

	console.log("✅ Complete game data generated successfully!");
	console.log("📊 Final structure:");
	console.log(`   - ${days.length} days`);
	console.log(
		`   - ${days.reduce((sum, day) => sum + day.scenes.length, 0)} total scenes`,
	);
	console.log(
		`   - ${days.reduce((sum, day) => sum + day.scenes.reduce((sceneSum, scene) => sceneSum + scene.choices.length, 0), 0)} total choices`,
	);
	console.log(`📁 File saved to: ${outputPath}`);

	// Show sample structure
	if (days.length > 0) {
		console.log("\n📝 Sample structure:");
		const sample = {
			days: [days[0]],
		};
		console.log(JSON.stringify(sample, null, 2));
	}

	// Verify all scenes have personality data
	let scenesWithDeltas = 0;
	let totalChoices = 0;
	let choicesWithDeltas = 0;

	for (const day of days) {
		for (const scene of day.scenes) {
			let sceneHasDeltas = false;
			for (const choice of scene.choices) {
				totalChoices++;
				if (choice.deltas) {
					choicesWithDeltas++;
					sceneHasDeltas = true;
				}
			}
			if (sceneHasDeltas) scenesWithDeltas++;
		}
	}

	console.log("\n📈 Data Verification:");
	console.log(
		`   - Scenes with personality data: ${scenesWithDeltas}/${days.reduce((sum, day) => sum + day.scenes.length, 0)}`,
	);
	console.log(
		`   - Choices with personality data: ${choicesWithDeltas}/${totalChoices}`,
	);
	console.log(
		`   - Coverage: ${Math.round((choicesWithDeltas / totalChoices) * 100)}%`,
	);
};

// Run the script
main();
