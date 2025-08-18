import Link from "next/link";

export default function Footer() {
	return (
		<>
			<div className="container">
				<div className="mx-auto max-w-[1039px] pb-8 md:pb-[120px]">
					<p className="font-medium text-[40px] leading-[40px] md:text-[80px] md:leading-[80px]">
						With Walnut, you don’t just grow —{" "}
						<span className="text-[#DA7414]">you level up!</span>
					</p>
				</div>
			</div>
			<footer className="container space-y-8 py-4 pb-8 md:space-y-12 md:pb-12">
				<div>
					<p className="text-[20px] leading-[20px] md:text-[40px] md:leading-[40px]">
						Let’s make something happen
					</p>
					<p className="text-[40px] leading-[40px] md:text-[80px] md:leading-[80px]">
						hello@walnut.in
					</p>
				</div>
				<div className="grid grid-cols-2 border-black border-b-[1px] pb-8 text-[20px] md:grid-cols-4 md:pb-12 md:text-[40px]">
					<div>
						<Link href="#">LinkedIn</Link>
					</div>
					<div>
						<Link href="#">Twitter X</Link>
					</div>
					<div>
						<Link href="#">Facebook</Link>
					</div>
					<div>
						<Link href="#">Instagram</Link>
					</div>
				</div>
			</footer>
		</>
	);
}
