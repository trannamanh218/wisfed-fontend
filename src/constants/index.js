import { CoffeeCupIcon, CircleCheckIcon, TargetIcon } from 'components/svg';

export const readingStatus = [
	{
		'title': 'Đang đọc',
		'value': 'reading',
		'icon': CoffeeCupIcon,
	},
	{
		'title': 'Đã đọc',
		'value': 'readAlready',
		'icon': CircleCheckIcon,
	},
	{
		'title': 'Muốn đọc',
		'value': 'wantRead',
		'icon': TargetIcon,
	},
];

export const colorVarients = ['primary', 'secondary', 'success', 'success-dark', 'warning', 'info', 'light', 'dark'];
export const DEFAULT_TOGGLE_ROWS = 3;
export const NUMBER_ROWS = 10;
