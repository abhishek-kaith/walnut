"use client";

import { useState } from "react";

interface Profile {
	name: string;
	age: number;
	occupation: string;
	interests: string[];
}

interface GameProfileProps {
	onComplete: (profile: {
		name: string;
		age: number;
		occupation: string;
	}) => void;
}

export function GameProfile({ onComplete }: GameProfileProps) {
	const [profile, setProfile] = useState<Profile>({
		name: "",
		age: 25,
		occupation: "",
		interests: [],
	});
	const [currentStep, setCurrentStep] = useState(0);
	const [interestInput, setInterestInput] = useState("");

	const steps = [
		{ title: "What's your name?", field: "name", icon: "👤" },
		{ title: "How old are you?", field: "age", icon: "🎂" },
		{ title: "What do you do?", field: "occupation", icon: "💼" },
		{ title: "What are your interests?", field: "interests", icon: "🎯" },
	];

	const commonInterests = [
		"Reading",
		"Gaming",
		"Coding",
		"Music",
		"Travel",
		"Photography",
		"Cooking",
		"Sports",
		"Art",
		"Movies",
	];

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onComplete({
			name: profile.name,
			age: profile.age,
			occupation: profile.occupation,
		});
	};

	const handleNext = () => {
		if (!isStepComplete()) return;

		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			onComplete({
				name: profile.name,
				age: profile.age,
				occupation: profile.occupation,
			});
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const toggleInterest = (interest: string) => {
		setProfile((prev) => ({
			...prev,
			interests: prev.interests.includes(interest)
				? prev.interests.filter((i) => i !== interest)
				: [...prev.interests, interest],
		}));
	};

	const addCustomInterest = () => {
		if (
			interestInput.trim() &&
			!profile.interests.includes(interestInput.trim())
		) {
			setProfile((prev) => ({
				...prev,
				interests: [...prev.interests, interestInput.trim()],
			}));
			setInterestInput("");
		}
	};

	const removeInterest = (interest: string) => {
		setProfile((prev) => ({
			...prev,
			interests: prev.interests.filter((i) => i !== interest),
		}));
	};

	const isStepComplete = () => {
		switch (steps[currentStep]?.field) {
			case "name":
				return profile.name.trim().length > 0;
			case "age":
				return profile.age >= 16 && profile.age <= 100;
			case "occupation":
				return profile.occupation.trim().length > 0;
			case "interests":
				return profile.interests.length > 0;
			default:
				return true;
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-[var(--color-background-white)] p-4">
			<div className="w-full max-w-lg space-y-6">
				<div className="mb-6">
					<div className="mb-3 flex items-center justify-between">
						<span className="font-semibold text-[var(--color-primary)] text-sm">
							Create Your Profile
						</span>
						<span className="font-semibold text-[var(--color-primary)] text-sm">
							{currentStep + 1}/{steps.length}
						</span>
					</div>
					<div className="h-3 w-full rounded-full bg-gray-200">
						<div
							className="h-3 rounded-full bg-[var(--color-accent)] transition-all duration-300"
							style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
						/>
					</div>
				</div>

				<div className="rounded-2xl bg-[var(--color-primary)] p-6">
					<div className="mb-6 text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-accent)] text-2xl">
							{steps[currentStep]?.icon || "👤"}
						</div>
						<h2 className="mb-2 font-bold text-[24px] text-white">
							{steps[currentStep]?.title || "Profile Setup"}
						</h2>
						<p className="text-sm text-white/80">
							This helps us personalize your journey
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						{steps[currentStep]?.field === "name" && (
							<div>
								<input
									type="text"
									value={profile.name}
									onChange={(e) =>
										setProfile({ ...profile, name: e.target.value })
									}
									className="w-full rounded-lg border-2 border-gray-200 bg-[var(--color-white)] px-4 py-3 text-center text-[var(--color-primary)] text-lg placeholder-[var(--color-primary)]/60 transition-colors focus:border-[var(--color-accent)] focus:outline-none"
									placeholder="Enter your name"
									required
								/>
							</div>
						)}

						{steps[currentStep]?.field === "age" && (
							<div>
								<input
									type="number"
									value={profile.age}
									onChange={(e) =>
										setProfile({
											...profile,
											age: Number.parseInt(e.target.value) || 25,
										})
									}
									className="w-full rounded-lg border-2 border-gray-200 bg-[var(--color-white)] px-4 py-3 text-center text-[var(--color-primary)] text-lg placeholder-[var(--color-primary)]/60 transition-colors focus:border-[var(--color-accent)] focus:outline-none"
									min="16"
									max="100"
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
						)}

						{steps[currentStep]?.field === "occupation" && (
							<div>
								<input
									type="text"
									value={profile.occupation}
									onChange={(e) =>
										setProfile({ ...profile, occupation: e.target.value })
									}
									className="w-full rounded-lg border-2 border-gray-200 bg-[var(--color-white)] px-4 py-3 text-center text-[var(--color-primary)] text-lg placeholder-[var(--color-primary)]/60 transition-colors focus:border-[var(--color-accent)] focus:outline-none"
									placeholder="What do you do?"
									required
								/>
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
											onClick={() =>
												setProfile({ ...profile, occupation: job })
											}
											className="rounded-lg bg-[var(--color-primary-light)] px-3 py-2 text-sm text-white transition-colors hover:bg-[var(--color-primary)]"
										>
											{job}
										</button>
									))}
								</div>
							</div>
						)}

						{steps[currentStep]?.field === "interests" && (
							<div>
								<div className="mb-4 grid grid-cols-2 gap-2">
									{commonInterests.map((interest) => (
										<button
											key={interest}
											type="button"
											onClick={() => toggleInterest(interest)}
											className={`rounded-lg px-3 py-2 text-sm transition-colors ${
												profile.interests.includes(interest)
													? "bg-[var(--color-accent)] text-white"
													: "bg-[var(--color-primary-light)] text-white hover:bg-[var(--color-primary)]"
											}`}
										>
											{interest}
										</button>
									))}
								</div>

								<div className="mb-4 flex space-x-2">
									<input
										type="text"
										value={interestInput}
										onChange={(e) => setInterestInput(e.target.value)}
										className="flex-1 rounded-lg border-2 border-gray-200 bg-[var(--color-white)] px-4 py-2 text-[var(--color-primary)] placeholder-[var(--color-primary)]/60 transition-colors focus:border-[var(--color-accent)] focus:outline-none"
										placeholder="Add custom interest"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												addCustomInterest();
											}
										}}
									/>
									<button
										type="button"
										onClick={addCustomInterest}
										className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-white transition-colors hover:bg-[var(--color-accent)]/80"
									>
										Add
									</button>
								</div>

								{profile.interests.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{profile.interests.map((interest) => (
											<span
												key={interest}
												className="inline-flex items-center rounded-full bg-[var(--color-success)] px-3 py-1 text-sm text-white"
											>
												{interest}
												<button
													type="button"
													onClick={() => removeInterest(interest)}
													className="ml-2 hover:text-white/80"
												>
													×
												</button>
											</span>
										))}
									</div>
								)}
							</div>
						)}

						<div className="flex justify-between space-x-3">
							<button
								type="button"
								onClick={handleBack}
								disabled={currentStep === 0}
								className="flex-1 rounded-lg bg-[var(--color-primary-light)] px-4 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
							>
								Back
							</button>
							<button
								type="button"
								onClick={handleNext}
								disabled={!isStepComplete()}
								className="flex-1 rounded-lg bg-[var(--color-accent)] px-4 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-accent)]/80 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{currentStep === steps.length - 1 ? "Begin Quest!" : "Next"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
