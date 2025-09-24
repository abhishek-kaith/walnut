"use client";

import { useEffect, useState } from "react";

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
	const [formProgress, setFormProgress] = useState(0);
	const [isFocused, setIsFocused] = useState("");

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

	// Calculate form completion progress
	useEffect(() => {
		let progress = 0;
		if (profile.name.trim()) progress += 40;
		if (profile.age >= 16 && profile.age <= 100) progress += 30;
		if (profile.occupation.trim()) progress += 30;
		setFormProgress(progress);
	}, [profile]);

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
		<div className="flex min-h-screen items-center justify-center bg-[var(--color-rpg-dark)] p-3 md:p-4">
			<div className="rpg-card w-full max-w-md p-5 md:p-6">
				{/* Header */}
				<div className="mb-5 text-center">
					<h1 className="mb-2 font-bold text-2xl text-[var(--color-rpg-gold)] md:text-3xl">
						Create Your Profile
					</h1>
					<p className="text-gray-300 text-sm">
						Tell us about yourself to personalize your assessment
					</p>
				</div>

				{/* Progress Bar */}
				<div className="mb-6 bg-[var(--color-rpg-border)] p-0.5">
					<div
						className="h-1.5 bg-[var(--color-accent)] transition-all duration-300"
						style={{ width: `${formProgress}%` }}
					/>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
						{/* Avatar */}
						<div className="flex-shrink-0">
							<div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-rpg-border)]">
								{profile.name ? (
									<span className="font-bold text-2xl text-gray-400">
										{profile.name[0]?.toUpperCase()}
									</span>
								) : (
									<svg
										className="h-10 w-10 text-gray-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Icon</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								)}
							</div>
						</div>

						{/* Name Input */}
						<div className="flex-1">
							<label
								htmlFor="name"
								className="mb-1.5 block font-medium text-gray-300 text-sm"
							>
								Full Name
							</label>
							<input
								id="name"
								type="text"
								value={profile.name}
								onChange={(e) =>
									setProfile({ ...profile, name: e.target.value })
								}
								className="w-full rounded-lg border border-[var(--color-rpg-border)] bg-[var(--color-rpg-border)] px-3 py-2.5 text-white placeholder-gray-400 transition-colors focus:border-[var(--color-accent)] focus:outline-none"
								placeholder="Enter your name"
								required
								autoComplete="name"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="age"
							className="mb-1.5 block font-medium text-gray-300 text-sm"
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
							className="w-full rounded-lg border border-[var(--color-rpg-border)] bg-[var(--color-rpg-border)] px-3 py-2.5 text-white placeholder-gray-400 transition-colors focus:border-[var(--color-accent)] focus:outline-none"
							placeholder="Enter your age"
							required
						/>
						<div className="mt-2 flex flex-wrap justify-center gap-1.5">
							{[18, 25, 30, 35, 40].map((age) => (
								<button
									key={age}
									type="button"
									onClick={() => setProfile({ ...profile, age })}
									className={`rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
										profile.age === age
											? "bg-[var(--color-accent)] text-white"
											: "bg-[var(--color-primary-light)] text-gray-300 hover:bg-[var(--color-primary)]"
									}`}
								>
									{age}
								</button>
							))}
						</div>
					</div>

					<div>
						<label
							htmlFor="occupation"
							className="mb-1.5 block font-medium text-gray-300 text-sm"
						>
							Occupation
						</label>
						<select
							id="occupation"
							value={profile.occupation}
							onChange={(e) =>
								setProfile({ ...profile, occupation: e.target.value })
							}
							className="w-full rounded-lg border border-[var(--color-rpg-border)] bg-[var(--color-rpg-border)] px-3 py-2.5 text-white transition-colors focus:border-[var(--color-accent)] focus:outline-none"
							required
						>
							<option value="">Select your occupation...</option>
							{occupationOptions.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
						<div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
							{[
								"Developer",
								"Designer",
								"Student",
								"Manager",
								"Teacher",
								"Other",
							].map((job) => (
								<button
									key={job}
									type="button"
									onClick={() => setProfile({ ...profile, occupation: job })}
									className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
										profile.occupation === job
											? "bg-[var(--color-accent)] font-medium text-white"
											: "bg-[var(--color-primary-light)] text-gray-300 hover:bg-[var(--color-primary)]"
									}`}
								>
									{job}
								</button>
							))}
						</div>
					</div>

					<button
						type="submit"
						disabled={!profile.name.trim() || !profile.occupation.trim()}
						className={`rpg-button w-full py-3 font-medium text-base transition-all ${
							profile.name.trim() && profile.occupation.trim()
								? "hover:bg-[var(--color-primary-light)]"
								: "cursor-not-allowed opacity-50"
						}`}
					>
						Continue
					</button>
				</form>
			</div>
		</div>
	);
}
