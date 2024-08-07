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
		>
			<motion.h1 className="text-8xl font-bold" variants={titleVariants}>
				{CompanyName}
			</motion.h1>
			<motion.p className="text-3xl" variants={taglineVariants}>
				{CompanyTagline}
			</motion.p>
		</motion.div>
	);
}
