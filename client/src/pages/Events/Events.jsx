import { useEffect, useMemo, useRef, useState } from "react";

import projectionsImg from "@/assets/projections-ia.png";
import conferencesImg from "@/assets/conferences-ia.png";
import awardsImg from "@/assets/remises-prix-ia.png";

import CategorySection from "./components/CategorySection";

const EVENT_CATEGORIES = [
	{
		key: "projections",
		title: "🎬 Projections",
		subtitle: "Festival du film réalisés en IA",
		image: projectionsImg,
		items: [
			{
				id: "p1",
				title: "Film IA – Génération narrative",
				time: "18:00",
				place: "Salle 1",
			},
			{
				id: "p2",
				title: "Sélection Courts Métrages IA",
				time: "19:30",
				place: "Salle 2",
			},
		],
	},
	{
		key: "conferences",
		title: "🎤 Conférences",
		subtitle: "Rencontres et talks autour de l’IA et du cinéma",
		image: conferencesImg,
		items: [
			{
				id: "c1",
				title: "L’IA dans le cinéma de demain",
				time: "14:00",
				place: "Auditorium",
			},
			{
				id: "c2",
				title: "Créer un film avec l’IA : workflow",
				time: "16:00",
				place: "Auditorium",
			},
		],
	},
	{
		key: "awards",
		title: "🏆 Remises de prix",
		subtitle: "Célébration des meilleures créations IA",
		image: awardsImg,
		items: [
			{
				id: "a1",
				title: "Prix du Meilleur Film IA",
				time: "21:30",
				place: "Grande Salle",
			},
			{
				id: "a2",
				title: "Prix Innovation IA",
				time: "22:00",
				place: "Grande Salle",
			},
		],
	},
];

function prefersReducedMotion() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const FestivalEvents = () => {
	const sectionRef = useRef(null);
	const [started, setStarted] = useState(false);
	const [visibleCount, setVisibleCount] = useState(0);

	const flatEvents = useMemo(
		() => EVENT_CATEGORIES.flatMap((category) => category.items),
		[]
	);
	const total = flatEvents.length;
	const progress = total === 0 ? 0 : Math.min(1, visibleCount / total);

	const categoryStartIndex = useMemo(() => {
		const result = {};
		let cursor = 0;

		for (const category of EVENT_CATEGORIES) {
			result[category.key] = cursor;
			cursor += category.items.length;
		}

		return result;
	}, []);

	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return undefined;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setStarted(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.2 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!started) return undefined;

		if (prefersReducedMotion()) {
			setVisibleCount(total);
			return undefined;
		}

		setVisibleCount(0);

		const interval = setInterval(() => {
			setVisibleCount((prev) => {
				const next = prev + 1;
				if (next >= total) {
					clearInterval(interval);
					return total;
				}
				return next;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [started, total]);

	return (
		<section ref={sectionRef} className="relative overflow-hidden py-20">
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-[#020617]" />
				<div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-black to-black" />
				<div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
			</div>

			<div className="mx-auto max-w-5xl px-4 text-white">
				<h2 className="text-3xl font-bold tracking-tight">Programme du Festival</h2>
	

				<div className="relative mt-12 space-y-14 pl-14">
					<div className="pointer-events-none absolute left-6 top-0 h-full w-px bg-white/10" />

					<div
						className="pointer-events-none absolute left-6 top-0 w-px"
						style={{ height: `${progress * 100}%` }}
					>
						<div className="h-full w-px bg-gradient-to-b from-indigo-400/70 via-cyan-300/40 to-purple-400/60" />
						<div className="absolute inset-0 w-px blur-[2px] bg-indigo-400/40" />

						<div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.95)]" />
						<div className="absolute -bottom-6 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-2xl" />
					</div>

					{EVENT_CATEGORIES.map((category) => (
						<CategorySection
							key={category.key}
							category={category}
							startIndex={categoryStartIndex[category.key]}
							visibleCount={visibleCount}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default FestivalEvents;
