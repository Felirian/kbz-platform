'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SectionLayout.module.scss';
import { useGSAP } from '@gsap/react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	list: React.ReactNode;
	listGap: 20 | 40;
}

gsap.registerPlugin(ScrollTrigger);

const SectionLayout = ({ title, list, listGap, ...props }: Props) => {
	const sectionRef = useRef<HTMLElement | null>(null);
	const titleRef = useRef<HTMLHeadingElement | null>(null);

	useGSAP(() => {
		if (!titleRef.current || !sectionRef.current) return;

		gsap.set(titleRef.current, { backgroundPositionX: '0%' });

		const ctx = gsap.context(() => {
			gsap.to(titleRef.current, {
				backgroundPositionX: '-100%',
				ease: 'none',
				scrollTrigger: {
					trigger: sectionRef.current,
					start: 'top center',
					end: 'bottom center',
					scrub: true,
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			className={styles.section}
			style={{ '--list-gap': `${listGap}px` } as React.CSSProperties}
			{...props}
		>
			<div className={styles.sticky}>
				<h2 ref={titleRef}>{title}</h2>
			</div>

			{list}
		</section>
	);
};

export default SectionLayout;
