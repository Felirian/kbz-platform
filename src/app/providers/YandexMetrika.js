'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const YM_COUNTER_ID = 105959544;

export default function YandexMetrika() {
	const pathname = usePathname();

	useEffect(() => {
		if (window.ym && pathname) {
			window.ym(YM_COUNTER_ID, 'hit', pathname);
		}
	}, [pathname]);

	return (
		<>
			<Script
				id="ym-init"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              k=e.createElement(t),a=e.getElementsByTagName(t)[0];
              k.async=1;k.src=r;a.parentNode.insertBefore(k,a)
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${YM_COUNTER_ID}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });
          `,
				}}
			/>
		</>
	);
}

