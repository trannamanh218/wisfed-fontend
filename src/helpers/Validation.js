import * as yup from 'yup';
export const titleBookShelve = yup.object().shape({
	title: yup
		.string()
		.transform(currentValue => {
			return currentValue.replace(/  +/g, ' ').trim();
		})
		.max(20, 'Trường này không vượt quá 20 kí tự'),
});

export const registerValidate = yup.object().shape({
	firstname: yup.string().max(30, '*Họ và tên không nhập quá 30 ký tự').required('*Vui lòng điền đầy đủ thông tin'),
	lastname: yup.string().max(30, '*Họ và tên không nhập quá 30 ký tự').required('*Vui lòng điền đầy đủ thông tin'),
	email: yup
		.string()
		.max(200, '*Email không vượt quá 200 ký tự')
		.email('*Email không đúng định dạng')
		.required('*Vui lòng điền đầy đủ thông tin'),
	password: yup
		.string()
		.min(8, '*Mật khẩu từ 8-15 kí tự. Vui lòng kiểm tra lại')
		.max(15, '*Mật khẩu từ 8-15 kí tự. Vui lòng kiểm tra lại')
		.required('*Vui lòng điền đầy đủ thông tin'),
});

export const emialValidate = yup.object().shape({
	email: yup
		.string()
		.max(200, '*Email không vượt quá 200 ký tự')
		.email('*Email không đúng định dạng')
		.required('*Vui lòng điền đầy đủ thông tin'),
});

export const resetPasswordValidate = yup.object().shape({
	OTP: yup.string().required('*Vui lòng điền mã OTP'),
	newPassword: yup
		.string()
		.min(6, '*Mật khẩu từ 6-15 kí tự. Vui lòng kiểm tra lại')
		.max(15, '*Mật khẩu từ 6-15 kí tự. Vui lòng kiểm tra lại')
		.required('*Vui lòng điền đầy đủ thông tin'),
	confirmPassword: yup
		.string()
		.when('newPasword', {
			is: val => (val && val.length > 0 ? true : false),
			then: yup.string().oneOf([yup.ref('newPasword')], '*Mật khẩu không trùng khớp'),
		})
		.required('*Vui lòng điền đầy đủ thông tin'),
});

class Validation {
	login() {
		return yup.object().shape({
			email: yup
				.string()
				.email('*Email không đúng định dạng')
				.max(200, '*Email không vượt quá 200 ký tự')
				.required('*Vui lòng điền đầy đủ thông tin'),
			password: yup
				.string()
				.min(6, '*Mật khẩu từ 6-15 kí tự. Vui lòng kiểm tra lại')
				.max(15, '*Mật khẩu từ 6-15 kí tự. Vui lòng kiểm tra lại')
				.required('*Vui lòng điền đầy đủ thông tin'),
		});
	}
}

export default new Validation();
