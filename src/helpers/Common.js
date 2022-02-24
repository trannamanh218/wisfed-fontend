import queryString from 'query-string';
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

export const convertUnitNumberToWord = length => {
	if (length < 4) {
		return '';
	} else if (length < 7) {
		return 'k';
	} else if (length < 10) {
		return 'tr';
	} else if (length < 13) {
		return 'tỉ';
	} else {
		return 'too big';
	}
};

export const formatNumberToWord = data => {
	if (parseInt(data)) {
		const numberArr = data.toString().split('');
		const length = numberArr.length;
		if (length <= 3) {
			return data;
		} else if (length % 3 === 0 && length > 3) {
			const formatData = numberArr.slice(0, 3).join('') + convertUnitNumberToWord(length);
			return formatData;
		}

		const remainNumber = length % 3;
		const formatData = numberArr.slice(0, remainNumber).join('') + convertUnitNumberToWord(length);
		return formatData;
	}

	return 0;
};

export const generateQueryString = query => {
	return queryString.stringify(query);
};

export const parsedQueryString = query => {
	return queryString.parse(query);
};

export const calculateDurationTime = date => {
	const end = new Date();
	const start = new Date(date);
	const duration = (end.getTime() - start.getTime()) / 1000;
	const secondsPerMinute = 60;
	const secondsPerHour = secondsPerMinute * 60;
	const secondsPerDay = secondsPerMinute * 24;

	if (duration < secondsPerMinute) {
		return 'Vừa xong';
	} else if (duration < secondsPerHour) {
		return `${Math.floor(duration / secondsPerMinute)} phút trước`;
	} else if (duration < secondsPerDay) {
		return `${Math.floor(duration / secondsPerHour)} giờ trước`;
	} else {
		return `${moment(start).format('DD MMM')} lúc ${moment(start).format('kk:mm')}`;
	}
};

export const generateQuery = (
	current = 1,
	perPage = 10,
	sort = '[{ "property": "createdAt", direction: "DESC }]',
	filter = '[]'
) => {
	return {
		start: current > 1 ? (current - 1) * perPage : 0,
		limit: perPage,
		sort,
		filter,
	};
};

export const toSlug = str => {
	// Chuyển hết sang chữ thường
	str = str.toLowerCase();

	// xóa dấu
	str = str
		.normalize('NFD') // chuyển chuỗi sang unicode tổ hợp
		.replace(/[\u0300-\u036f]/g, ''); // xóa các ký tự dấu sau khi tách tổ hợp

	// Thay ký tự đĐ
	str = str.replace(/[đĐ]/g, 'd');

	// Xóa ký tự đặc biệt
	str = str.replace(/([^0-9a-z-\s])/g, '');

	// Xóa khoảng trắng thay bằng ký tự -
	str = str.replace(/(\s+)/g, '-');

	// Xóa ký tự - liên tiếp
	str = str.replace(/-+/g, '-');

	// xóa phần dư - ở đầu & cuối
	str = str.replace(/^-+|-+$/g, '');

	// return
	return str;
};
