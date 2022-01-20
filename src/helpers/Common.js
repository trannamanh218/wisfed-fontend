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
