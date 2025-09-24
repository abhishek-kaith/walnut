"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MenuItem {
	label: string;
	href: string;
}

interface DropdownMenuProps {
	items: MenuItem[];
	isActive: boolean;
	onItemClick: () => void;
}

type DropdownType = "corporate" | "individual" | null;

const Header: React.FC = () => {
	const router = useRouter();
	const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);

	const corporateSolutions: MenuItem[] = [{ label: "Todo", href: "#todo1" }];

	const individualSolutions: MenuItem[] = [{ label: "Todo", href: "#todo2" }];

	const handleMouseEnter = (dropdown: DropdownType): void => {
		setActiveDropdown(dropdown);
	};

	const handleMouseLeave = (): void => {
		setActiveDropdown(null);
	};

	const handleNavigation = (path: string): void => {
		router.push(path);
	};

	const DropdownMenu: React.FC<DropdownMenuProps> = ({
		items,
		isActive,
		onItemClick,
	}) => (
		<div
			style={{
				position: "absolute",
				top: "100%",
				left: 0,
				display: isActive ? "block" : "none",
				background: "white",
				border: "1px solid #ccc",
			}}
		>
			{items.map((item: MenuItem, index: number) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<Link key={index} href={item.href} onClick={onItemClick}>
					{item.label}
				</Link>
			))}
		</div>
	);

	return (
		<header className="container hidden py-2 lg:block">
			<nav className="flex justify-between lg:text-[26px] lg:leading-[26px]">
				<div>
					<div
						style={{
							position: "relative",
							display: "inline-block",
							marginRight: "20px",
						}}
						onMouseEnter={() => handleMouseEnter("corporate")}
						onMouseLeave={handleMouseLeave}
					>
						{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
						<button>
							<span>Corporate Solutions</span>
							<ChevronDown
								style={{
									display: "inline-block",
									marginLeft: "5px",
									transition: "transform 0.2s",
									transform:
										activeDropdown === "corporate" ? "rotate(180deg)" : "none",
								}}
							/>
						</button>
						<DropdownMenu
							items={corporateSolutions}
							isActive={activeDropdown === "corporate"}
							onItemClick={() => setActiveDropdown(null)}
						/>
					</div>

					<div
						style={{
							position: "relative",
							display: "inline-block",
							marginRight: "20px",
						}}
						onMouseEnter={() => handleMouseEnter("individual")}
						onMouseLeave={handleMouseLeave}
					>
						{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
						<button>
							<span>Individual Solutions</span>
							<ChevronDown
								style={{
									display: "inline-block",
									marginLeft: "5px",
									transition: "transform 0.2s",
									transform:
										activeDropdown === "individual" ? "rotate(180deg)" : "none",
								}}
							/>
						</button>
						<DropdownMenu
							items={individualSolutions}
							isActive={activeDropdown === "individual"}
							onItemClick={() => setActiveDropdown(null)}
						/>
					</div>
				</div>

				<div className="space-x-4">
					<Link href="/resources">Resources</Link>{" "}
					<Link href="/contact">Contact</Link>{" "}
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						className="rounded-lg bg-accent px-2 py-1 text-white"
						onClick={() => handleNavigation("/login")}
					>
						Login
					</button>
				</div>
			</nav>
		</header>
	);
};

export default Header;
