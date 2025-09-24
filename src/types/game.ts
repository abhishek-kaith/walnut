// Re-export existing game data types
export * from "../../types/game-data";
export type {
	GameData,
	Day,
	Scene,
	Choice,
	Deltas,
	Disc,
	Ocean,
	Enneagram,
} from "../../types/game-data";

// Import types for use in this file
import type { Disc, Enneagram, Ocean } from "../../types/game-data";

// Additional types for game state management
export interface UserScores {
	disc: Required<Disc>;
	ocean: Required<Ocean>;
	enneagram: Required<Enneagram>;
}

export interface GameProgress {
	currentDay: number;
	currentScene: number;
	totalPoints: number;
	scores: UserScores;
}

export type GameState =
	| "login"
	| "profile"
	| "intro"
	| "playing"
	| "dayComplete"
	| "results";

// Personality trait descriptions
export interface TraitDescription {
	name: string;
	description: string;
}

export interface PersonalityResults {
	disc: {
		dominant: keyof Required<Disc>;
		traits: Record<keyof Required<Disc>, TraitDescription>;
	};
	ocean: {
		traits: Record<keyof Required<Ocean>, TraitDescription>;
	};
	enneagram: {
		dominant: keyof Required<Enneagram>;
		motivations: Record<keyof Required<Enneagram>, TraitDescription>;
	};
}

// Trait definitions for results
export const DISC_TRAITS: Record<keyof Required<Disc>, TraitDescription> = {
	D: {
		name: "Dominance",
		description: "Direct, decisive, problem-solving, results-oriented",
	},
	I: {
		name: "Influence",
		description: "Enthusiastic, optimistic, people-oriented, talkative",
	},
	S: {
		name: "Steadiness",
		description: "Patient, predictable, deliberate, stable",
	},
	C: {
		name: "Conscientiousness",
		description: "Precise, analytical, systematic, diplomatic",
	},
};

export const OCEAN_TRAITS: Record<keyof Required<Ocean>, TraitDescription> = {
	O: {
		name: "Openness",
		description: "Creativity, curiosity, willingness to try new things",
	},
	C: {
		name: "Conscientiousness",
		description: "Organization, responsibility, dependability",
	},
	E: {
		name: "Extraversion",
		description: "Sociability, assertiveness, talkativeness",
	},
	A: { name: "Agreeableness", description: "Cooperation, trust, empathy" },
	N: {
		name: "Neuroticism",
		description: "Emotional instability, anxiety, stress sensitivity",
	},
};

export const ENNEAGRAM_MOTIVATIONS: Record<
	keyof Required<Enneagram>,
	TraitDescription
> = {
	type1: {
		name: "Type 1",
		description: "Desire to be good/right, fear of being corrupt/wrong",
	},
	type2: {
		name: "Type 2",
		description: "Desire to be loved/needed, fear of being unloved/unwanted",
	},
	type3: {
		name: "Type 3",
		description: "Desire to be valuable/worthwhile, fear of being worthless",
	},
	type4: {
		name: "Type 4",
		description: "Desire to find self/significance, fear of having no identity",
	},
	type5: {
		name: "Type 5",
		description:
			"Desire to be competent/understand, fear of being useless/overwhelmed",
	},
	type6: {
		name: "Type 6",
		description:
			"Desire for security/support, fear of being without support/guidance",
	},
	type7: {
		name: "Type 7",
		description:
			"Desire to maintain happiness/satisfaction, fear of being trapped in pain/deprivation",
	},
	type8: {
		name: "Type 8",
		description:
			"Desire to be self-reliant/in control, fear of being controlled/vulnerable",
	},
	type9: {
		name: "Type 9",
		description:
			"Desire to maintain inner/outer peace, fear of loss of connection/fragmentation",
	},
};
