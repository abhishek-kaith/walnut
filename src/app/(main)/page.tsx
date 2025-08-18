import Image from "next/image";

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
				<div className="mx-auto max-w-[1039px] font-semibold text-[40px] leading-none md:text-[80px] space-y-8 md:space-y-12">
					<div>
						<p className="text-left text-[#17312D]">
							Ready to level <br /> up,
						</p>
						<p className="-mt-4.5 ml-auto text-right text-[#17312D]">
							Where growth <br /> meets play.
						</p>
					</div>
					<button
						className="mx-auto block rounded-lg bg-[#17312D] py-1 px-3 text-[24px] text-white md:text-[48px]"
						type="button"
					>
						Let’s level up!
					</button>
					<p className="text-[40px] md:text-[80px] mt-8 md:mt-12 text-[#17312D]">
						At Walnut, we turn learning into an adventure for individuals and
						organisations alike.
					</p>
				</div>
			</div>
			<div className="container bg-[#17312D] h-[300px] md:h-[600px] lg:h-[800px] my-8 md:my-12">
				<div className="h-full flex items-center justify-center text-center">
					<div className="text-[34px] md:text-[64px] lg:text-[128px] font-semibold">
						<h2 className="text-white">How We Help You</h2>
						<h3 className="text-[#186358] italic">Level-Up!</h3>
					</div>
				</div>
			</div>
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
		</div>
	);
}
