export const COLORS = {
	white: '#FFFFFF',
  grey: '#7C7C7C',
  BG: '#313131'
};

const breakpoints = {
	desktopBP: '1919px',
	laptopBP: '1000px',
	mobileBP: '480px',
};

export const BREAKPOINTS = {
	desktop: `(max-width: ${breakpoints.desktopBP})`,
	laptop: `(max-width: ${breakpoints.laptopBP})`,
	mobile: `(max-width: ${breakpoints.mobileBP})`,
};
