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
export const MAX_PER_PAGE = 20;
export const NUMBER_OF_BOOKS = 16;

export const DEFAULT_TOGGLE_SINGLE_COLUMN_ROW = 6;
export const YEAR_LIMIT = 1904;

// status
export const STATUS_LOADING = 'LOADING';
export const STATUS_IDLE = 'IDLE';
export const STATUS_SUCCESS = 'SUCCESS';
