import React from 'react';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';

function CreatNewPasswordForm() {
	return (
		<div className='forget__form__email'>
			<Formik initialValues={{ otp: '', password: '', password2: '' }}>
				<Form className='forgetPassword__form'>
					<div className='forget__name-title'>
						<span>Xác nhận mật khẩu mới</span>
					</div>
					<div className='forget__subcribe'>
						<span>
							Nhập mã xác nhận 06 chữ số vừa được gửi <br /> về Email đã đăng ký của bạn. Sau đó <br />
							tạo mật khẩu mới
						</span>
					</div>
					<Field name='otp'>
						{({ field, meta }) => {
							return (
								<div className='forgetPassword__form__field'>
									<div
										className={classNames('forgetPassword__form__group', {
											'error': meta.touched && meta.error,
										})}
									>
										<input
											className='forgetPassword__form__input'
											type='text'
											placeholder='Nhập mã OTP'
											{...field}
											value={field.value}
											autoComplete='false'
										/>
									</div>
									{meta.touched && meta.error && (
										<small className='error-message'>{meta.error}</small>
									)}
								</div>
							);
						}}
					</Field>
					<div className='forget__send-otp__link'>
						<span>Không nhận được mã? Gửi lại</span>
					</div>
					<hr />
					<Field name='pasword'>
						{({ field, meta }) => {
							return (
								<div className='forgetPassword__form__field'>
									<div
										className={classNames('forgetPassword__form__group', {
											'error': meta.touched && meta.error,
										})}
									>
										<input
											className='forgetPassword__form__input-password input-1'
											type='text'
											placeholder='Mật khẩu mới'
											{...field}
											value={field.value}
											autoComplete='false'
										/>
									</div>
									{meta.touched && meta.error && (
										<small className='error-message'>{meta.error}</small>
									)}
								</div>
							);
						}}
					</Field>
					<Field name='password2'>
						{({ field, meta }) => {
							return (
								<div className='forgetPassword__form__field'>
									<div
										className={classNames('forgetPassword__form__group', {
											'error': meta.touched && meta.error,
										})}
									>
										<input
											className='forgetPassword__form__input-password'
											type='text'
											placeholder='Xác nhận lại mật khẩu mới'
											{...field}
											value={field.value}
											autoComplete='false'
										/>
									</div>
									{meta.touched && meta.error && (
										<small className='error-message'>{meta.error}</small>
									)}
								</div>
							);
						}}
					</Field>
					<button className='forgetPassword__form__btn-otp'>Lấy lại mật khẩu</button>
				</Form>
			</Formik>
		</div>
	);
}

export default CreatNewPasswordForm;
