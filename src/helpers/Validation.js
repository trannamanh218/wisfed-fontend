import * as yup from 'yup';
export const nameBookShelve = yup.object().shape({
	name: yup
		.string()
		.transform(currentValue => {
			return currentValue.replace(/  +/g, ' ').trim();
		})
		.max(20, 'Trường này không vượt quá 20 kí tự'),
});

export const registerValidate = yup.object().shape({
	firstname: yup
		.string()
		.max(30, '*Họ và tên không nhập quá 30 ký tự')
		.matches(
			/^[0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+$/i,
			'Không được viết kí tự đặc biệt'
		)
		.required('*Vui lòng điền đầy đủ thông tin'),
	lastname: yup
		.string()
		.max(30, '*Họ và tên không nhập quá 30 ký tự')
		.matches(
			/^[0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+$/i,
			'Không được viết kí tự đặc biệt'
		)
		.required('*Vui lòng điền đầy đủ thông tin'),
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
	confirmPassword: yup
		.string()
		.when('password', {
			is: val => (val && val.length > 0 ? true : false),
			then: yup.string().oneOf([yup.ref('password')], '*Mật khẩu không trùng khớp'),
		})
		.required('*Vui lòng điền đầy đủ thông tin'),
});

export const emailValidate = yup.object().shape({
	email: yup
		.string()
		.max(200, '*Email không vượt quá 200 ký tự')
		.email('*Email không đúng định dạng')
		.required('*Vui lòng điền đầy đủ thông tin'),
});

export const resetPasswordValidate = yup.object().shape({
	OTP: yup
		.string()
		.required('*Vui lòng điền mã OTP')
		.min(8, '*Mã OTP tối thiểu 8 kí tự. Vui lòng kiểm tra lại')
		.matches('^[0-9]*$', {
			message: 'Vui lòng nhập số',
			excludeEmptyString: true,
		}),
	newPassword: yup
		.string()
		.min(8, '*Mật khẩu từ 8-15 kí tự. Vui lòng kiểm tra lại')
		.max(15, '*Mật khẩu từ 8-15 kí tự. Vui lòng kiểm tra lại')
		.required('*Vui lòng điền đầy đủ thông tin'),
	confirmPassword: yup
		.string()
		.when('newPassword', {
			is: val => (val && val.length > 0 ? true : false),
			then: yup.string().oneOf([yup.ref('newPassword')], '*Mật khẩu không trùng khớp'),
		})
		.required('*Vui lòng điền đầy đủ thông tin'),
});

export const resetPasswordAdminValidate = yup.object().shape({
	newPassword: yup
		.string()
		.min(8, '*Mật khẩu từ 8-15 kí tự. Vui lòng kiểm tra lại')
		.max(15, '*Mật khẩu từ 8-15 kí tự. Vui lòng kiểm tra lại')
		.required('*Vui lòng điền đầy đủ thông tin'),
	confirmPassword: yup
		.string()
		.when('newPassword', {
			is: val => (val && val.length > 0 ? true : false),
			then: yup.string().oneOf([yup.ref('newPassword')], '*Mật khẩu không trùng khớp'),
		})
		.required('*Vui lòng điền đầy đủ thông tin'),
});

class Validation {
	login() {
		return yup.object().shape({
			email: yup
				.string()
				.trim()
				.email('*Email không đúng định dạng')
				.max(200, '*Email không vượt quá 200 ký tự')
				.required('*Vui lòng điền đầy đủ thông tin'),
			password: yup
				.string()
				.min(6, '*Mật khẩu từ 8-15 kí tự. Vui lòng kiểm tra lại')
				.max(15, '*Mật khẩu từ 8-15 kí tự. Vui lòng kiểm tra lại')
				.required('*Vui lòng điền đầy đủ thông tin'),
		});
	}
}

export default new Validation();

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
