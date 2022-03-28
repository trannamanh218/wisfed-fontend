import * as yup from 'yup';
export const nameBookShelve = yup.object().shape({
	name: yup
		.string()
		.transform(currentValue => {
			return currentValue.replace(/  +/g, ' ').trim();
		})
		.max(20, 'Trường này không vượt quá 20 kí tự'),
});

export const progressReadingSchema = status => {
	const currentStatus = status || 'default';
	const progressSchema = {
		'reading': yup.object().shape({
			progress: yup
				.string()
				.matches(/^[0-9]*$/, 'Vui lòng nhập số')
				.required('Vui lòng nhập số'),
		}),
		'default': yup.object().shape({
			progress: yup
				.string()
				.matches(/^[0-9]*$/, 'Vui lòng nhập số')
				.required('Vui lòng nhập số'),
		}),
	};

	return progressSchema[currentStatus] || progressSchema.default;
};
