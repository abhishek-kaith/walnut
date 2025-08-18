"use client"
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const CoachingSection = () => {
	// Controls for the animation
	const controls = useAnimation();

	// Hook to detect when the element is in view
	const { ref, inView } = useInView({
		threshold: 0.3, // Trigger animation when 30% of the element is visible
		triggerOnce: true, // Only trigger the animation once
	});

	// Animation variants
	const sectionVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut",
			},
		},
	};

	// Start animation when the element is in view
	useEffect(() => {
		if (inView) {
			controls.start("visible");
		}
	}, [controls, inView]);

	return (
		<div className="bg-white font-sans">
			{/* First Section */}
			<div className="container mx-auto px-4">
				<div className="relative mx-auto h-[670px] max-w-[1039px] rounded-2xl bg-[radial-gradient(circle_at_center,_#22c55e_0%,_rgba(18,151,31,0.8)_70%,_rgba(18,151,31,1)_100%)] p-4 md:p-8 my-8 md:my-12">
					<Image
						height={250}
						width={250}
						src="https://placehold.co/250x250/transparent/transparent?text="
						alt="Frame"
						className="absolute top-0 left-0 object-contain"
					/>
					<Image
						height={250}
						width={250}
						src="https://placehold.co/250x250/transparent/transparent?text="
						alt="Frame"
						className="absolute right-0 bottom-0 object-contain"
					/>
					<div className="relative flex h-full flex-col items-stretch justify-between leading-snug">
						<div>
							<p className="font-bold text-[20px] text-white md:text-[32px]">
								Individual Coaching
							</p>
							<h3 className="font-medium text-[40px] text-white md:text-[64px]">
								Designed just for you
							</h3>
						</div>
						<p className="font-medium text-[20px] text-white md:text-[32px] max-w-4xl">
							Uncover your personality through engaging, game-based assessments
							that go beyond boring surveys. Powered by OCEAN, MBTI, and
							Enneagram models, Walnut’s interactive assessments make
							self-discovery fun, fast and deeply accurate, so you can
							confidently map your growth journey.
						</p>
						<div className="flex flex-col items-start gap-3">
							<button
								className="flex cursor-pointer items-center gap-1 text-[20px] text-white"
								type="button"
							>
								<span className="underline underline-offset-5">Learn More</span>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<title>Arrow</title>
									<path
										d="M5.8335 14.1666L14.1668 5.83325"
										stroke="#FEFEFE"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M5.8335 5.83325H14.1668V14.1666"
										stroke="#FEFEFE"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
							<button
								className="-ml-[2px] cursor-pointer rounded-xl bg-[#17312D] px-4 py-2 text-[24px] text-white"
								type="button"
							>
								Get Started
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Second Section (Animated) */}
			<motion.div
				ref={ref}
				initial="hidden"
				animate={controls}
				variants={sectionVariants}
				className="container mx-auto px-4 py-8 md:py-12"
			>
				<div className="relative mx-auto h-[670px] max-w-[1039px] rounded-2xl bg-[#186358] p-4 md:p-8">
					<Image
						height={250}
						width={250}
						src="https://placehold.co/250x250/transparent/transparent?text="
						alt="Frame"
						className="absolute top-0 left-0 object-contain"
					/>
					<Image
						height={250}
						width={250}
						src="https://placehold.co/250x250/transparent/transparent?text="
						alt="Frame"
						className="absolute right-0 bottom-0 object-contain"
					/>
					<div className="relative flex h-full flex-col items-stretch justify-between leading-snug">
						<div>
							<p className="font-bold text-[20px] text-white md:text-[32px]">
								Corporate Coaching
							</p>
							<h3 className="font-medium text-[40px] text-white md:text-[64px]">
								Growth that works for your organisation
							</h3>
						</div>
						<p className="font-medium text-[20px] text-white md:text-[32px] max-w-4xl">
							Every organisation is unique, so your coaching should be too.
							Walnut designs custom coaching journeys tailored to your company’s
							goals, culture, and leadership needs, ensuring learning that
							sticks and delivers real results.{" "}
						</p>
						<div className="flex flex-col items-start gap-3">
							<button
								className="flex cursor-pointer items-center gap-1 text-[20px] text-white"
								type="button"
							>
								<span className="underline underline-offset-5">Learn More</span>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<title>Arrow</title>
									<path
										d="M5.8335 14.1666L14.1668 5.83325"
										stroke="#FEFEFE"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M5.8335 5.83325H14.1668V14.1666"
										stroke="#FEFEFE"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
							<button
								className="-ml-[2px] cursor-pointer rounded-xl bg-[#17312D] px-4 py-2 text-[24px] text-white"
								type="button"
							>
								Get Started
							</button>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default CoachingSection;
