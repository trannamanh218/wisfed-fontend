import { CoffeeCupIcon, CircleCheckIcon, TargetIcon } from 'components/svg';
export const STATUS_BOOK = {
	reading: 'reading',
	read: 'read',
	liked: 'liked',
};

export const readingStatus = [
	{
		'name': 'Đang đọc',
		'value': STATUS_BOOK.reading,
		'icon': CoffeeCupIcon,
	},
	{
		'name': 'Đã đọc',
		'value': STATUS_BOOK.read,
		'icon': CircleCheckIcon,
	},
	{
		'name': 'Muốn đọc',
		'value': STATUS_BOOK.liked,
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
