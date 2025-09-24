"use client";

import { useState } from "react";

interface GameProfileProps {
	onComplete: (profile: {
		name: string;
		age: number;
		occupation: string;
	}) => void;
}

export function GameProfile({ onComplete }: GameProfileProps) {
	const [profile, setProfile] = useState({
		name: "",
		age: 25,
		occupation: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (profile.name.trim() && profile.occupation.trim()) {
			onComplete({
				name: profile.name,
				age: profile.age,
				occupation: profile.occupation,
			});
		}
	};

	const occupationOptions = [
		"Software Developer",
		"Designer",
		"Product Manager",
		"Marketing Professional",
		"Sales Representative",
		"Engineer",
		"Teacher/Educator",
		"Healthcare Professional",
		"Finance Professional",
		"Consultant",
		"Entrepreneur",
		"Student",
		"Other",
	];

	return (
		<div className="flex min-h-screen items-center justify-center bg-[var(--color-rpg-dark)] p-4">
			<div className="rpg-card w-full max-w-lg p-8">
				<div className="mb-8 text-center">
					<h1 className="mb-4 font-bold text-3xl text-[var(--color-rpg-gold)]">
						⚔️ Create Your Character
					</h1>
					<p className="text-gray-300 text-lg">
						Tell us about yourself to personalize your personality quest
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="name"
							className="mb-2 block font-medium text-gray-300 text-sm"
						>
							Character Name
						</label>
						<input
							id="name"
							type="text"
							value={profile.name}
							onChange={(e) => setProfile({ ...profile, name: e.target.value })}
							className="w-full rounded-lg border border-[var(--color-rpg-border)] bg-[var(--color-rpg-border)] px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--color-rpg-gold)]"
							placeholder="Enter your name"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="age"
							className="mb-2 block font-medium text-gray-300 text-sm"
						>
							Age
						</label>
						<input
							id="age"
							type="number"
							min="16"
							max="100"
							value={profile.age}
							onChange={(e) =>
								setProfile({
									...profile,
									age: Number.parseInt(e.target.value) || 25,
								})
							}
							className="w-full rounded-lg border border-[var(--color-rpg-border)] bg-[var(--color-rpg-border)] px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--color-rpg-gold)]"
							placeholder="Enter your age"
							required
						/>
						<div className="mt-4 flex justify-center space-x-2">
							{[18, 25, 30, 35, 40].map((age) => (
								<button
									key={age}
									type="button"
									onClick={() => setProfile({ ...profile, age })}
									className="rounded-lg bg-[var(--color-primary-light)] px-4 py-2 text-white transition-colors hover:bg-[var(--color-primary)]"
								>
									{age}
								</button>
							))}
						</div>
					</div>

					<div>
						<label
							htmlFor="occupation"
							className="mb-2 block font-medium text-gray-300 text-sm"
						>
							Class/Occupation
						</label>
						<select
							id="occupation"
							value={profile.occupation}
							onChange={(e) =>
								setProfile({ ...profile, occupation: e.target.value })
							}
							className="w-full rounded-lg border border-[var(--color-rpg-border)] bg-[var(--color-rpg-border)] px-4 py-3 text-white transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--color-rpg-gold)]"
							required
						>
							<option value="">Select your class...</option>
							{occupationOptions.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
						<div className="mt-4 grid grid-cols-2 gap-2">
							{[
								"Developer",
								"Designer",
								"Student",
								"Manager",
								"Teacher",
								"Artist",
							].map((job) => (
								<button
									key={job}
									type="button"
									onClick={() => setProfile({ ...profile, occupation: job })}
									className="rounded-lg bg-[var(--color-primary-light)] px-3 py-2 text-sm text-white transition-colors hover:bg-[var(--color-primary)]"
								>
									{job}
								</button>
							))}
						</div>
					</div>

					<button
						type="submit"
						className="rpg-button w-full text-lg"
						disabled={!profile.name.trim() || !profile.occupation.trim()}
					>
						🛡️ Complete Character Creation
					</button>
				</form>

				<div className="mt-6 rounded-lg bg-[var(--color-rpg-border)] p-4 text-center">
					<p className="text-gray-300 text-sm">
						💡 <strong>Tip:</strong> Your responses will help us create a
						personalized personality assessment tailored to your background and
						experiences.
					</p>
				</div>
			</div>
		</div>
	);
}
