import * as yup from 'yup';
export const titleBookShelve = yup.object().shape({
	title: yup
		.string()
		.transform(currentValue => {
			return currentValue.replace(/  +/g, ' ').trim();
		})
		.max(20, 'Trường này không vượt quá 20 kí tự'),
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

	email() {
		return yup.object().shape({
			email: yup
				.string()
				.email('*Email không chính xác')
				.max(200, '*Email không vượt quá 200 ký tự')
				.required('*Vui lòng điền đầy đủ thông tin'),
		});
	}

	register() {
		return yup.object().shape({
			fullname: yup
				.string()
				.max(30, '*Họ và tên không nhập quá 30 ký tự')
				.required('*Vui lòng điền đầy đủ thông tin'),
			password: yup
				.string()
				.matches(
					/^(?=.{1,}$)(?=.*?[a-z])(?=.*?[0-9])(?=.*?\W).*$/,
					'Mặt khẩu bao gồm kí tự, chữ cái, số. Vui lòng kiểm tra lại'
				)
				.min(8, '*Mật khẩu từ 8-15 kí tự. Vui lòng kiểm tra lại')
				.max(15, '*Mật khẩu từ 8-15 kí tự. Vui lòng kiểm tra lại')
				.required('*Vui lòng điền đầy đủ thông tin'),
			password_confirm: yup
				.string()
				.when('password', {
					is: val => (val && val.length > 0 ? true : false),
					then: yup.string().oneOf([yup.ref('password')], '*Mật khẩu không trùng khớp'),
				})
				.required('*Vui lòng điền đầy đủ thông tin'),
		});
	}

	resetPasswordValidate() {
		return yup.object().shape({
			otp: yup
				.string()
				.matches(/^\+?[0-9]{6}$/g, '*Mã xác nhận không hợp lệ')
				.required('*Vui lòng điền đầy đủ thông tin'),
			password: yup
				.string()
				.matches(
					/^(?=.{1,}$)(?=.*?[a-z])(?=.*?[0-9])(?=.*?\W).*$/,
					'Mặt khẩu bao gồm kí tự, chữ cái, số. Vui lòng kiểm tra lại'
				)
				.min(6, '*Mật khẩu từ 6-15 kí tự. Vui lòng kiểm tra lại')
				.max(15, '*Mật khẩu từ 6-15 kí tự. Vui lòng kiểm tra lại')
				.required('*Vui lòng điền đầy đủ thông tin'),
			password_confirm: yup
				.string()
				.when('password', {
					is: val => (val && val.length > 0 ? true : false),
					then: yup.string().oneOf([yup.ref('password')], '*Mật khẩu không trùng khớp'),
				})
				.required('*Vui lòng điền đầy đủ thông tin'),
		});
	}

	changePasswordValidate() {
		return yup.object().shape({
			password: yup
				.string()
				.matches(
					/^\S*$/,
					'Mật khẩu bao gồm kí tự, chữ cái, số, không bao gồm khoảng trắng. Vui lòng kiểm tra lại'
				)
				.min(6, '*Mật khẩu từ 6-15 kí tự. Vui lòng kiểm tra lại')
				.max(15, '*Mật khẩu từ 6-15 kí tự. Vui lòng kiểm tra lại')
				.required('*Vui lòng điền đầy đủ thông tin'),
			password_confirm: yup
				.string()
				.when('password', {
					is: val => (val && val.length > 0 ? true : false),
					then: yup.string().oneOf([yup.ref('password')], '*Mật khẩu không trùng khớp'),
				})
				.required('*Vui lòng điền đầy đủ thông tin'),
		});
	}

	profileTimerSchedule() {
		return yup.object().shape({
			hours: yup.string().test('hours', '*Định dạng giờ không đúng', val => {
				const rex = /\d\d/;
				const isValid = rex.test(val);

				if (isValid) {
					const newValue = parseInt(val);
					if (newValue <= 0 || newValue > 23) {
						return false;
					}
					return true;
				}

				return false;
			}),
			minutes: yup.string().test('minutes', '*Định dạng phút không đúng', val => {
				const rex = /\d\d/;
				const isValid = rex.test(val);

				if (isValid) {
					const newValue = parseInt(val);
					if (newValue <= 0 || newValue > 59) {
						return false;
					}
					return true;
				}

				return false;
			}),
		});
	}

	updateInfoValidate() {
		return yup.object().shape({
			fullname: yup
				.string()
				.max(30, '*Họ và tên không nhập quá 30 ký tự')
				.required('*Vui lòng điền đầy đủ thông tin'),
			birthday: yup.string().nullable().required('*Vui lòng điền đầy đủ thông tin'),
			phone: yup
				.string()
				.matches(/^[0-9]*$/, '*Số điện thoại không phù hợp')
				.required('*Vui lòng điền đầy đủ thông tin'),
		});
	}
	updateInfoValidateCart() {
		return yup.object().shape({
			fullname: yup
				.string()
				.matches(/^[a-zA-Z\s\W]*$/, 'Tên không hợp lệ')
				.required('Vui lòng điền đầy đủ thông tin'),
			phone: yup
				.string()
				.matches(/^[0-9]*$/, 'Số điện thoại không phù hợp')
				.required('Vui lòng điền đầy đủ thông tin'),
			address: yup.string().required('Vui lòng điền đầy đủ thông tin'),
			city: yup.string().required('Vui lòng điền đầy đủ thông tin'),
			district: yup.string().required('Vui lòng điền đầy đủ thông tin'),
		});
	}
}

export default new Validation();
