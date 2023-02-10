import { CoffeeCupIcon, CircleCheckIcon, TargetIcon } from 'components/svg';

export const STATUS_BOOK = {
	reading: 'reading',
	read: 'read',
	wantToRead: 'wantToRead',
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
		'value': STATUS_BOOK.wantToRead,
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

//library
export const LIBRARY_LIMIT = 20;

//type
export const POST_TYPE = 'post';
export const QUOTE_TYPE = 'quote';
export const REVIEW_TYPE = 'review';
export const GROUP_TYPE = 'group';

// share verb
export const POST_VERB = 'miniPost';
export const POST_VERB_SHARE = 'sharePost';
export const QUOTE_VERB_SHARE = 'shareQuote';
export const GROUP_POST_VERB = 'groupPost';
export const GROUP_POST_VERB_SHARE = 'shareGroupPost';
export const READ_TARGET_VERB_SHARE = 'shareTargetRead';
export const READ_TARGET_VERB_SHARE_LV1 = 'shareTargetReadLv1';
export const TOP_BOOK_VERB_SHARE = 'shareTopBookRanking';
export const TOP_BOOK_VERB_SHARE_LV1 = 'shareTopBookLv1';
export const MY_BOOK_VERB_SHARE = 'shareMyBook';
export const TOP_QUOTE_VERB_SHARE = 'shareTopQuoteRanking';
export const TOP_QUOTE_VERB_SHARE_LV1 = 'shareTopQuoteLv1';
export const TOP_USER_VERB_SHARE = 'shareTopUserRanking';
export const TOP_USER_VERB_SHARE_LV1 = 'shareTopUserLv1';
export const REVIEW_VERB_SHARE = 'shareReview';
export const CHART_VERB_SHARE = 'shareChart';
export const GROWTH_CHART_VERB_SHARE = 'growthChart';

// input type number
export const blockInvalidChar = e => {
	return ['e', 'E', '+', '-', '.', ','].includes(e.key) && e.preventDefault();
};

export const urlRegex =
	/(www\.|http(s)?:\/\/)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_\+.~#?&//=]*)([^"<\s]+)(?![^<>]*>|[^"]*?<\/a)/g;

export const hashtagRegex =
	/(^|\B)#(?![0-9_]+\b)[0-9a-z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/gi;

export const BASE_URL = 'https://wisfeed.com';

export const formatNumbers = number => number.toLocaleString('vi');
