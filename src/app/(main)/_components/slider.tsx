"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Feature {
	title: string;
	subtitle: string;
	description: string;
}

export default function Slider() {
	const features: Feature[] = [
		{
			title: "Certified Coaches",
			subtitle: "World-Class Coaches. Personally Matched.",
			description:
				"Get coached by ICF-certified PCC and MCC coaches, the gold standard in professional coaching. Backed by global expertise, our coaches are handpicked and algorithm-matched to fit your unique growth journey.",
		},
		{
			title: "Task-Based Reward System",
			subtitle: "Grow. Earn. Redeem.",
			description:
				"With Walnut, every coaching task you complete earns you walnuts, your in-app currency to unlock exclusive rewards. Progress isn’t just measured here, it’s celebrated.",
		},
		{
			title: "Gamified Assessment",
			subtitle: "Play. Discover. Evolve.",
			description:
				"Our gamified personality assessments bring OCEAN, MBTI, and Enneagram frameworks to life through an interactive game. It’s not just a test, it is a journey of playful self-discovery with real, actionable insights.",
		},
		{
			title: "Gamified Coaching",
			subtitle: "Learn by Playing. Grow by Doing.",
			description:
				"Walnut turns coaching into an immersive game. Practice real-world leadership skills through mental model games and interactive challenges that make growth hands-on, engaging, and unforgettable.",
		},
		{
			title: "Skill Tree Mapping",
			subtitle: "Your Growth. Your Roadmap.",
			description:
				"Design your own learning journey with Walnut’s skill tree. Choose the behavioural skills you want to develop and build a personalised growth map that evolves as you do.",
		},
	];

	return <EmblaCarousel slides={features} />;
}

interface DotButtonProps {
	selected: boolean;
	onClick: () => void;
}

const DotButton: React.FC<DotButtonProps> = ({ selected, onClick }) => (
	<button
		className={`mx-1 h-3 w-3 rounded-full transition-colors duration-300 ${
			selected ? "bg-white" : "bg-white/40"
		}`}
		type="button"
		onClick={onClick}
		aria-label="Go to slide"
	/>
);

interface PrevNextButtonProps {
	enabled: boolean;
	onClick: () => void;
	isNext?: boolean;
}

const PrevNextButton: React.FC<PrevNextButtonProps> = ({
	enabled,
	onClick,
	isNext = false,
}) => (
	<button
		className="transform text-white transition-opacity duration-300 active:scale-90 disabled:text-white/30"
		onClick={onClick}
		disabled={!enabled}
		aria-label={isNext ? "Next slide" : "Previous slide"}
		type="button"
	>
		{isNext ? <ChevronRight size={32} /> : <ChevronLeft size={32} />}
	</button>
);

interface EmblaCarouselProps {
	slides: Feature[];
}

const EmblaCarousel: React.FC<EmblaCarouselProps> = ({ slides }) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
	const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
	const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
	const scrollTo = useCallback(
		(index: number) => emblaApi?.scrollTo(index),
		[emblaApi],
	);

	useEffect(() => {
		if (!emblaApi) return;

		const onSelect = () => {
			setSelectedIndex(emblaApi.selectedScrollSnap());
			setPrevBtnEnabled(emblaApi.canScrollPrev());
			setNextBtnEnabled(emblaApi.canScrollNext());
		};

		setScrollSnaps(emblaApi.scrollSnapList());
		emblaApi.on("select", onSelect);
		emblaApi.on("reInit", onSelect);
		onSelect();

		return () => {
			emblaApi.off("select", onSelect);
			emblaApi.off("reInit", onSelect);
		};
	}, [emblaApi]);

	return (
		<div className="container mx-auto mb-8  bg-[#17312D] md:mb-12">
			<div className="embla overflow-hidden" ref={emblaRef}>
				<div className="embla__container flex gap-4 py-8 md:py-12">
					{slides.map((f, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={i}
							className="embla__slide min-w-0 flex-[0_0_90%] pl-4 sm:flex-[0_0_50%] md:flex-[0_0_40%] lg:flex-[0_0_33.33%]"
						>
							<div className="relative h-[378px] w-full rounded-lg bg-[linear-gradient(318.35deg,rgba(24,99,53,0)_39.58%,#30C96B_96.91%)] p-[2px] before:absolute before:inset-0 before:m-[2px] before:rounded-lg before:bg-[#17312D] before:content-[''] before:[-webkit-mask-composite:xor] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:exclude] before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]">
								<div className="relative z-10 flex h-full flex-col justify-center space-y-4 p-6 text-white">
									<p className="font-semibold text-2xl">{f.title}</p>
									<p className="font-semibold text-white/80 text-xl">
										{f.subtitle}
									</p>
									<p className="font-medium text-lg text-white/70">
										{f.description}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="flex items-center justify-between px-4 pb-8 sm:px-8">
				<div className="flex items-center">
					<PrevNextButton onClick={scrollPrev} enabled={prevBtnEnabled} />
					<PrevNextButton
						onClick={scrollNext}
						enabled={nextBtnEnabled}
						isNext
					/>
				</div>
				<div className="flex items-center">
					{scrollSnaps.map((_, index) => (
						<DotButton
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							selected={index === selectedIndex}
							onClick={() => scrollTo(index)}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
