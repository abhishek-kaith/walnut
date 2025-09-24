import * as fs from "node:fs";
import * as path from "node:path";

interface ScoreEntry {
	Day: number;
	Scene: number;
	Option: string;
	"DISC Delta": string;
	"OCEAN Delta": string;
	"Enneagram Delta": string;
	"": string;
}

interface MarkdownScene {
	day: number;
	scene: number;
	title: string;
	description: string[];
	choices: string[];
}

const auditMarkdownStructure = (
	filePath: string,
): Map<string, MarkdownScene> => {
	const content = fs.readFileSync(filePath, "utf-8");
	const lines = content.split("\n");

	const scenes = new Map<string, MarkdownScene>();
	let currentDay = 0;
	let currentScene = 0;
	let currentTitle = "";
	let currentDescription: string[] = [];
	let currentChoices: string[] = [];
	let inDescription = false;
	let inChoices = false;

	const finalizeScene = () => {
		if (currentDay > 0 && currentScene > 0 && currentTitle) {
			const key = `${currentDay}-${currentScene}`;
			scenes.set(key, {
				day: currentDay,
				scene: currentScene,
				title: currentTitle,
				description: currentDescription.filter((line) => line.trim() !== ""),
				choices: currentChoices,
			});
		}
		currentDescription = [];
		currentChoices = [];
		currentTitle = "";
		inDescription = false;
		inChoices = false;
	};

	for (const line of lines) {
		const trimmed = line.trim();

		// Day header
		if (trimmed.match(/^## Day (\d+)/)) {
			finalizeScene();
			const match = trimmed.match(/^## Day (\d+)/);
			if (match && match[1]) {
				currentDay = Number.parseInt(match[1]);
				currentScene = 0;
			}
			continue;
		}

		// Scene header
		if (trimmed.match(/^### Scene (\d+):/)) {
			finalizeScene();
			const match = trimmed.match(/^### Scene (\d+): (.+)/);
			if (match && match[1] && match[2]) {
				currentScene = Number.parseInt(match[1]);
				currentTitle = `Scene ${currentScene}: ${match[2]}`;
				inDescription = true;
				inChoices = false;
			}
			continue;
		}

		// Skip separators and question prompts
		if (trimmed === "---" || trimmed === "" || trimmed === "What do you do?") {
			continue;
		}

		// Choice options
		if (trimmed.match(/^\* [A-Z]\./)) {
			if (!inChoices) {
				inChoices = true;
				inDescription = false;
			}
			currentChoices.push(trimmed);
			continue;
		}

		// Description lines
		if (inDescription && !inChoices && trimmed !== "") {
			currentDescription.push(trimmed);
		}
	}

	finalizeScene(); // Final scene
	return scenes;
};

const auditScoreData = (filePath: string): Map<string, ScoreEntry[]> => {
	const data: ScoreEntry[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	const scoreMap = new Map<string, ScoreEntry[]>();

	for (const entry of data) {
		const key = `${entry.Day}-${entry.Scene}`;
		if (!scoreMap.has(key)) {
			scoreMap.set(key, []);
		}
		scoreMap.get(key)?.push(entry);
	}

	return scoreMap;
};

const main = () => {
	console.log("=== COMPREHENSIVE DATA AUDIT ===\n");

	const projectRoot = path.join(__dirname, "..");
	const markdownPath = path.join(projectRoot, "data", "day-scene.md");
	const scorePath = path.join(projectRoot, "data", "score.json");

	// Audit markdown
	console.log("📖 Analyzing markdown structure...");
	const markdownScenes = auditMarkdownStructure(markdownPath);

	// Audit score data
	console.log("📊 Analyzing score data...");
	const scoreData = auditScoreData(scorePath);

	// Generate comprehensive report
	console.log("\n=== AUDIT RESULTS ===\n");

	// 1. Overall coverage
	console.log("📊 OVERALL COVERAGE:");
	console.log(`Markdown scenes: ${markdownScenes.size}`);
	console.log(`Score data scenes: ${scoreData.size}`);
	console.log(
		`Total unique scenes: ${new Set([...markdownScenes.keys(), ...scoreData.keys()]).size}`,
	);

	// 2. Day-by-day analysis
	console.log("\n📅 DAY-BY-DAY ANALYSIS:");
	for (let day = 1; day <= 14; day++) {
		const markdownScenesForDay = Array.from(markdownScenes.keys()).filter(
			(key) => key.startsWith(`${day}-`),
		);
		const scoreScenesForDay = Array.from(scoreData.keys()).filter((key) =>
			key.startsWith(`${day}-`),
		);

		console.log(`\nDay ${day}:`);
		console.log(
			`  Markdown scenes: ${markdownScenesForDay.length} (${markdownScenesForDay.join(", ")})`,
		);
		console.log(
			`  Score scenes: ${scoreScenesForDay.length} (${scoreScenesForDay.join(", ")})`,
		);

		// Check for missing scenes
		const allScenesForDay = new Set([
			...markdownScenesForDay,
			...scoreScenesForDay,
		]);
		for (const sceneKey of allScenesForDay) {
			const hasMarkdown = markdownScenes.has(sceneKey);
			const hasScore = scoreData.has(sceneKey);

			if (!hasMarkdown || !hasScore) {
				console.log(
					`    ⚠️  ${sceneKey}: markdown=${hasMarkdown}, score=${hasScore}`,
				);
			}
		}
	}

	// 3. Choice analysis
	console.log("\n🎯 CHOICE ANALYSIS:");
	let totalChoicesInMarkdown = 0;
	let totalChoicesInScore = 0;

	for (const [, scene] of markdownScenes) {
		totalChoicesInMarkdown += scene.choices.length;
	}

	for (const entries of scoreData.values()) {
		totalChoicesInScore += entries.length;
	}

	console.log(`Total choices in markdown: ${totalChoicesInMarkdown}`);
	console.log(`Total choices in score data: ${totalChoicesInScore}`);

	// 4. Missing data analysis
	console.log("\n🔍 MISSING DATA ANALYSIS:");

	// Scenes in score but missing from markdown
	const missingFromMarkdown: string[] = [];
	for (const [key, entries] of scoreData) {
		if (!markdownScenes.has(key)) {
			missingFromMarkdown.push(key);
		}
	}

	// Scenes in markdown but missing from score
	const missingFromScore: string[] = [];
	for (const [key, scene] of markdownScenes) {
		if (!scoreData.has(key)) {
			missingFromScore.push(key);
		}
	}

	if (missingFromMarkdown.length > 0) {
		console.log(
			`❌ Scenes missing from markdown (${missingFromMarkdown.length}):`,
		);
		for (const key of missingFromMarkdown) {
			console.log(`   ${key}`);
		}
	}

	if (missingFromScore.length > 0) {
		console.log(
			`❌ Scenes missing from score data (${missingFromScore.length}):`,
		);
		for (const key of missingFromScore) {
			console.log(`   ${key}`);
		}
	}

	if (missingFromMarkdown.length === 0 && missingFromScore.length === 0) {
		console.log("✅ All scenes have both markdown content and score data!");
	}

	// 5. Field completeness in score data
	console.log("\n📋 SCORE DATA FIELDS:");
	const scoreEntries: ScoreEntry[] = JSON.parse(
		fs.readFileSync(scorePath, "utf-8"),
	);
	const fieldStats = {
		Day: 0,
		Scene: 0,
		Option: 0,
		"DISC Delta": 0,
		"OCEAN Delta": 0,
		"Enneagram Delta": 0,
		"": 0,
	};

	for (const entry of scoreEntries) {
		for (const field of Object.keys(fieldStats)) {
			if (
				entry[field as keyof ScoreEntry] &&
				entry[field as keyof ScoreEntry] !== ""
			) {
				fieldStats[field as keyof typeof fieldStats]++;
			}
		}
	}

	for (const [field, count] of Object.entries(fieldStats)) {
		const percentage = Math.round((count / scoreEntries.length) * 100);
		console.log(
			`  ${field || "(empty field)"}: ${count}/${scoreEntries.length} (${percentage}%)`,
		);
	}

	// 6. Choice pattern analysis
	console.log("\n🔤 CHOICE PATTERN ANALYSIS:");
	const choicePatterns = new Map<string, number>();

	for (const entries of scoreData.values()) {
		const pattern = entries
			.map((e) => e.Option.charAt(0))
			.sort()
			.join("");
		choicePatterns.set(pattern, (choicePatterns.get(pattern) || 0) + 1);
	}

	console.log("Choice patterns found:");
	for (const [pattern, count] of choicePatterns) {
		console.log(`  ${pattern}: ${count} scenes`);
	}

	console.log("\n✅ Audit complete!");
};

main();
