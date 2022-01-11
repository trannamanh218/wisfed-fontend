import * as yup from 'yup';
export const titleBookShelve = yup.object().shape({
	title: yup
		.string()
		.transform(currentValue => {
			return currentValue.replace(/  +/g, ' ').trim();
		})
		.max(20, 'Trường này không vượt quá 20 kí tự'),
});
