import Image from "next/image";
import EmblaCarousel from "./_components/slider";

export default async function HomePage() {
	return (
		<div>
			<div className="relative">
				<div className="flex min-h-[calc(100dvh-60px)] flex-col items-center justify-center py-8 text-center font-semibold md:py-12">
					<h1 className="text-[#17312D] text-[40px] md:text-[80px]">Walnut</h1>
					<p className="text-[#17312D] text-[20px] md:text-[40px]">
						<span className="text-[#DA7414]">The</span> gamified coaching
						platform
					</p>
					<Image
						alt="Iphone"
						src={"/hero-phone.png"}
						height={900}
						width={500}
						className="top-[3%] right-0 hidden h-[500px] object-contain object-right md:absolute md:block md:h-full"
					/>
					<Image
						alt="Iphone"
						src={"/hero-mobile.png"}
						height={900}
						width={500}
						className="h-auto w-full md:hidden"
					/>
				</div>
			</div>
			<div className="container pb-8 md:pb-12">
				<div className="mx-auto max-w-[1039px] space-y-8 font-semibold text-[40px] leading-none md:space-y-12 md:text-[80px]">
					<div>
						<p className="text-left text-[#17312D]">
							Ready to level <br /> up,
						</p>
						<p className="-mt-4.5 ml-auto text-right text-[#17312D]">
							Where growth <br /> meets play.
						</p>
					</div>
					<button
						className="mx-auto block rounded-lg bg-[#17312D] p-1 text-[24px] text-white md:text-[48px]"
						type="button"
					>
						Let’s level up!
					</button>
					<p className="mt-8 text-[#17312D] text-[40px] md:mt-12 md:text-[80px]">
						At Walnut, we turn learning into an adventure for individuals and
						organisations alike.
					</p>
				</div>
			</div>
			<div className="container mt-8 h-[300px] bg-[#17312D] md:mt-12 md:h-[500px]">
				<div className="flex h-full items-center justify-center text-center">
					<div className="font-semibold text-[64px] md:text-[128px]">
						<h2 className="text-white">How We Help You</h2>
						<h3 className="text-[#186358] italic">Level-Up!</h3>
					</div>
				</div>
			</div>
      <EmblaCarousel />
			<div className="container py-8 md:py-12">
				<div className="mx-auto max-w-[1039px]">
					<p className="font-medium text-[24px] leading-tight md:text-[48px]">
						Through gamified assessments, customisable skill trees,
						algorithm-based coach matching, and reward-based coaching tasks,
						Walnut delivers a fully personalised, immersive growth experience.
						Supported by ICF-certified PCC/MCC coaches, our platform makes
						coaching interactive, measurable, and engaging. Whether you're
						building yourself or building your team.
					</p>
				</div>
			</div>
			<div className="container">
				<div className="relative mx-auto h-[670px] max-w-[1039px] rounded-2xl bg-[radial-gradient(circle_at_center,_#22c55e_0%,_rgba(18,151,31,0.8)_70%,_rgba(18,151,31,1)_100%)] p-4 md:p-8">
					<Image
						height={250}
						width={250}
						src={"/top-frame.png"}
						alt="Frame"
						className="absolute top-0 left-0 object-contain"
					/>
					<Image
						height={250}
						width={250}
						src={"/bottom-frame.png"}
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
						<p className="font-medium text-[20px] text-white md:text-[32px]">
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
			<div className="container py-8 md:py-12">
				<div className="relative mx-auto h-[670px] max-w-[1039px] rounded-2xl bg-[#186358] p-4 md:p-8">
					<Image
						height={250}
						width={250}
						src={"/top-frame.png"}
						alt="Frame"
						className="absolute top-0 left-0 object-contain"
					/>
					<Image
						height={250}
						width={250}
						src={"/bottom-frame.png"}
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
						<p className="font-medium text-[20px] text-white md:text-[32px]">
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
			</div>
		</div>
	);
}
