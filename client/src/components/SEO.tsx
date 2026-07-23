import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
	title: string;
	description?: string;
	image?: string;
	url?: string;
}

export default function SEO({
	title,
	description = "MARSAI - Festival International de Films Générés par l'IA",
	image = "/og-image.jpg",
	url = "https://marsai-festival.vercel.app",
}: SEOProps) {
	return (
		<Helmet>
			<title>{title} | MARSAI Festival</title>
			<meta name="description" content={description} />

			{/* Open Graph / Facebook */}
			<meta property="og:type" content="website" />
			<meta property="og:url" content={url} />
			<meta property="og:title" content={`${title} | MARSAI Festival`} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />

			{/* Twitter */}
			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content={url} />
			<meta property="twitter:title" content={`${title} | MARSAI Festival`} />
			<meta property="twitter:description" content={description} />
			<meta property="twitter:image" content={image} />
		</Helmet>
	);
}
