"use client";

import { useState } from "react";

interface GameLoginProps {
	onLogin: (email: string, password: string) => void;
}

export function GameLogin({ onLogin }: GameLoginProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (email && password) {
			onLogin(email, password);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="rpg-card w-full max-w-md p-8">
				<div className="mb-8 text-center">
					<h1 className="mb-4 font-bold text-3xl text-[var(--color-rpg-gold)]">
						🏰 Enter the Realm
					</h1>
					<p className="text-gray-300 text-lg">
						Begin your personality quest by signing in to your adventure account
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="mb-2 block font-medium text-gray-300 text-sm"
						>
							Email Address
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded-lg border border-[var(--color-rpg-border)] bg-[var(--color-rpg-border)] px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--color-rpg-gold)]"
							placeholder="adventurer@example.com"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="mb-2 block font-medium text-gray-300 text-sm"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full rounded-lg border border-[var(--color-rpg-border)] bg-[var(--color-rpg-border)] px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--color-rpg-gold)]"
							placeholder="Enter your quest password"
							required
						/>
					</div>

					<button type="submit" className="rpg-button w-full text-lg">
						🗡️ Begin Adventure
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-gray-400 text-sm">
						New adventurer?{" "}
						<button className="text-[var(--color-rpg-gold)] hover:underline">
							Create Account
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
