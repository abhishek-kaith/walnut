export interface GameData {
	intro: {
		title: string;
		description: string[];
		imageUrl: string;
	};
	days: Day[];
}

export interface Day {
	id: string;
	title: string;
	scenes: Scene[];
}

export interface Scene {
	id: string;
	title: string;
	description: string[];
	choices: Choice[];
	imageUrl: string;
}

export interface Choice {
	id: string;
	text: string;
	deltas: Deltas;
}

export interface Deltas {
	disc: Disc;
	ocean: Ocean;
	enneagram: Enneagram;
}

export interface Disc {
	D?: number;
	I?: number;
	C?: number;
	S?: number;
}

export interface Ocean {
	C?: number;
	N?: number;
	E?: number;
	O?: number;
	A?: number;
}

export interface Enneagram {
	type1?: number;
	type3?: number;
	type5?: number;
	type2?: number;
	type9?: number;
	type6?: number;
	type8?: number;
	type4?: number;
	type7?: number;
}
