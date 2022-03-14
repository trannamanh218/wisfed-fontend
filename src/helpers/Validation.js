import * as yup from 'yup';
export const nameBookShelve = yup.object().shape({
	name: yup
		.string()
		.transform(currentValue => {
			return currentValue.replace(/  +/g, ' ').trim();
		})
		.max(20, 'Trường này không vượt quá 20 kí tự'),
});
