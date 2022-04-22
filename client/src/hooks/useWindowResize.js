import { useEffect, useState } from 'react';

export const useMediaQuery = scrSize => {
	const sm = '(min-width:576px)';
	const md = '(min-width:768px)';
	const lg = '(min-width:992px)';
	const xl = '(min-width:1200px)';
	const xxl = '(min-width:1400px)';
	const [matches, setMatches] = useState(false);
	useEffect(() => {
		const listener = () => {
			switch (scrSize) {
				case 'sm':
					setMatches(window.matchMedia(sm).matches);
					break;
				case 'md':
					setMatches(window.matchMedia(md).matches);
					break;
				case 'lg':
					setMatches(window.matchMedia(lg).matches);
					break;
				case 'xl':
					setMatches(window.matchMedia(xl).matches);
					break;
				case 'xxl':
					setMatches(window.matchMedia(xxl).matches);
					break;
				default:
					setMatches(true);
					break;
			}
		};
		listener();
		window.addEventListener('resize', listener);
		return () => window.removeEventListener('resize', listener);
	}, [scrSize]);
	return matches;
};
export default useMediaQuery;
