import type React from "react";
import Footer from "./footer";
import Header from "./header";
export default function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-dvh flex-col">
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
