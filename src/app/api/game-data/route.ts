import { NextResponse } from "next/server";
import gameData from "../../../../data/final-game-data.json";

export async function GET() {
	try {
		return NextResponse.json(gameData);
	} catch (error) {
		console.error("Failed to load game data:", error);
		return NextResponse.json(
			{ error: "Failed to load game data" },
			{ status: 500 },
		);
	}
}
