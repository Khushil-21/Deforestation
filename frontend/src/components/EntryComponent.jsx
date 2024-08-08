import React from "react";
import { motion } from "framer-motion";
import {
	CompanyName,
	CompanyTagline,
	EntryPageDuration,
	TaglineAnimationDuration,
	TitleAnimationDuration,
} from "../utils/StaticData";

const containerVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1, transition: { duration: EntryPageDuration } },
	exit: { opacity: 0, transition: { duration: 0.5 } },
};

const titleVariants = {
	initial: { y: -100, opacity: 0 },
	animate: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 50,
			duration: TitleAnimationDuration,
		},
	},
	exit: { y: -100, opacity: 0, transition: { duration: 0.5 } },
};

const taglineVariants = {
	initial: { x: 100, opacity: 0 },
	animate: {
		x: 0,
		opacity: 1,
		transition: { type: "tween", duration: TaglineAnimationDuration },
	},
	exit: { x: 100, opacity: 0, transition: { duration: 0.5 } },
};

export default function EntryComponent() {
	return (
		<motion.div
			className="flex flex-col gap-10 items-center justify-center h-screen"
			variants={containerVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			style={{
				background:
					"black url(http://fc01.deviantart.net/fs71/f/2012/160/b/9/stars_by_paulinemoss-d52un4e.jpg)",
				animation: "stars 205s linear alternate",
			}}
		>
			<motion.h1
				className="text-8xl font-bold text-white"
				variants={titleVariants}
			>
				{CompanyName}
			</motion.h1>
			<motion.p className="text-3xl text-white" variants={taglineVariants}>
				{CompanyTagline}
			</motion.p>
			<div id="box"></div>
			<motion.p
				className="text-3xl text-white animate-pulse"
				variants={taglineVariants}
			>
				Press Enter to continue
			</motion.p>
		</motion.div>
	);
}
