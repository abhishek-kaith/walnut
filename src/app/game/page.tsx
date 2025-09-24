"use client";

import type { Deltas, GameData, GameState, UserScores } from "@/types/game";
import { useEffect, useState } from "react";
import { GameDayComplete } from "./_components/game-day-complete";
import { GameIntro } from "./_components/game-intro";
import { GameProfile } from "./_components/game-profile";
import { GameResults } from "./_components/game-results";
import { GameScene } from "./_components/game-scene";

export default function GamePage() {
	const [gameData, setGameData] = useState<GameData | null>(null);
	const [gameState, setGameState] = useState<GameState>("profile");
	const [currentDay, setCurrentDay] = useState(0);
	const [currentScene, setCurrentScene] = useState(0);
	const [scores, setScores] = useState<UserScores>({
		disc: { D: 0, I: 0, S: 0, C: 0 },
		ocean: { O: 0, C: 0, E: 0, A: 0, N: 0 },
		enneagram: {
			type1: 0,
			type2: 0,
			type3: 0,
			type4: 0,
			type5: 0,
			type6: 0,
			type7: 0,
			type8: 0,
			type9: 0,
		},
	});
	const [totalPoints, setTotalPoints] = useState(0);
	const [dayPointsEarned, setDayPointsEarned] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchGameData = async () => {
			try {
				const response = await fetch("/api/game-data");
				if (!response.ok) throw new Error("Failed to fetch game data");
				const data: GameData = await response.json();
				setGameData(data);
			} catch (error) {
				console.error("Failed to load game data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchGameData();
	}, []);

	const [userProfile, setUserProfile] = useState<{
		name: string;
		age: number;
		occupation: string;
	} | null>(null);

	const handleProfileComplete = (profile: {
		name: string;
		age: number;
		occupation: string;
	}) => {
		setUserProfile(profile);
		setGameState("intro");
	};

	const handleStartGame = () => {
		setGameState("playing");
	};

	const handleSkipIntro = () => {
		setGameState("playing");
	};

	const handleChoice = (choiceId: string, deltas: Deltas) => {
		// Update scores based on choice deltas
		setScores((prev) => ({
			disc: {
				D: prev.disc.D + (deltas.disc.D || 0),
				I: prev.disc.I + (deltas.disc.I || 0),
				S: prev.disc.S + (deltas.disc.S || 0),
				C: prev.disc.C + (deltas.disc.C || 0),
			},
			ocean: {
				O: prev.ocean.O + (deltas.ocean.O || 0),
				C: prev.ocean.C + (deltas.ocean.C || 0),
				E: prev.ocean.E + (deltas.ocean.E || 0),
				A: prev.ocean.A + (deltas.ocean.A || 0),
				N: prev.ocean.N + (deltas.ocean.N || 0),
			},
			enneagram: {
				type1: prev.enneagram.type1 + (deltas.enneagram.type1 || 0),
				type2: prev.enneagram.type2 + (deltas.enneagram.type2 || 0),
				type3: prev.enneagram.type3 + (deltas.enneagram.type3 || 0),
				type4: prev.enneagram.type4 + (deltas.enneagram.type4 || 0),
				type5: prev.enneagram.type5 + (deltas.enneagram.type5 || 0),
				type6: prev.enneagram.type6 + (deltas.enneagram.type6 || 0),
				type7: prev.enneagram.type7 + (deltas.enneagram.type7 || 0),
				type8: prev.enneagram.type8 + (deltas.enneagram.type8 || 0),
				type9: prev.enneagram.type9 + (deltas.enneagram.type9 || 0),
			},
		}));

		// Add points for completing the scene
		const points = Math.floor(Math.random() * 50) + 10; // 10-59 points
		setTotalPoints((prev) => prev + points);
		setDayPointsEarned((prev) => prev + points);

		// Progress to next scene or complete day
		if (
			gameData?.days[currentDay] &&
			currentScene < gameData.days[currentDay].scenes.length - 1
		) {
			setCurrentScene((prev) => prev + 1);
		} else {
			setGameState("dayComplete");
		}
	};

	const handleContinueDay = () => {
		setDayPointsEarned(0);

		if (gameData && currentDay < gameData.days.length - 1) {
			setCurrentDay((prev) => prev + 1);
			setCurrentScene(0);
			setGameState("playing");
		} else {
			setGameState("results");
		}
	};

	const handleRestart = () => {
		setCurrentDay(0);
		setCurrentScene(0);
		setScores({
			disc: { D: 0, I: 0, S: 0, C: 0 },
			ocean: { O: 0, C: 0, E: 0, A: 0, N: 0 },
			enneagram: {
				type1: 0,
				type2: 0,
				type3: 0,
				type4: 0,
				type5: 0,
				type6: 0,
				type7: 0,
				type8: 0,
				type9: 0,
			},
		});
		setTotalPoints(0);
		setDayPointsEarned(0);
		setUserProfile(null);
		setGameState("profile");
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[var(--color-rpg-dark)]">
				<div className="rpg-card p-8">
					<div className="text-center font-bold text-[var(--color-rpg-gold)] text-xl">
						Loading your adventure...
					</div>
				</div>
			</div>
		);
	}

	if (!gameData) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[var(--color-rpg-dark)]">
				<div className="rpg-card p-8">
					<div className="text-center font-bold text-red-400 text-xl">
						Failed to load game data. Please refresh and try again.
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[var(--color-rpg-dark)]">
			{gameState === "profile" && (
				<GameProfile onComplete={handleProfileComplete} />
			)}

			{gameState === "intro" && (
				<GameIntro
					intro={gameData.intro}
					userProfile={userProfile}
					onStart={handleStartGame}
					onSkip={handleSkipIntro}
				/>
			)}

			{gameState === "playing" &&
				gameData.days[currentDay]?.scenes[currentScene] && (
					<GameScene
						scene={gameData.days[currentDay].scenes[currentScene]}
						dayNumber={currentDay + 1}
						sceneNumber={currentScene + 1}
						totalDays={gameData.days.length}
						totalScenes={gameData.days[currentDay].scenes.length}
						totalPoints={totalPoints}
						onChoice={handleChoice}
						onRestart={handleRestart}
					/>
				)}

			{gameState === "dayComplete" && gameData.days[currentDay] && (
				<GameDayComplete
					dayNumber={currentDay + 1}
					dayTitle={gameData.days[currentDay].title}
					pointsEarned={dayPointsEarned}
					totalPoints={totalPoints}
					scores={scores}
					isLastDay={currentDay >= gameData.days.length - 1}
					onContinue={handleContinueDay}
				/>
			)}

			{gameState === "results" && (
				<GameResults
					scores={scores}
					totalPoints={totalPoints}
					onRestart={handleRestart}
				/>
			)}
		</div>
	);
}
