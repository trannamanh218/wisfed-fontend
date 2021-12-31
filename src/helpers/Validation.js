import * as yup from 'yup';
class Validation {
	titleBookShelve() {
		return yup.object().shape({
			title: yup.string().max(20, 'Trường này không vượt quá 20 kí tự'),
		});
	}
}

export default new Validation();
