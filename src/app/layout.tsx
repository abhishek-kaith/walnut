import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import type { Metadata } from "next";
import { Wix_Madefor_Display } from "next/font/google";

export const metadata: Metadata = {
	title: "Walnut",
	description: "The gamified coaching platform",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const wix = Wix_Madefor_Display({
	subsets: ["latin"],
	variable: "--font-wix",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${wix.variable}`}>
			<body>
				<TRPCReactProvider>{children}</TRPCReactProvider>
			</body>
		</html>
	);
}
