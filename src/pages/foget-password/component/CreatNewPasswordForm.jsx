import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { resetPassword } from 'reducers/redux-utils/auth';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import ModalLogin from 'pages/login/element/ModalLogin';
import { resetPasswordValidate } from 'helpers/Validation';
import { forgotPassword } from 'reducers/redux-utils/auth';

function CreatNewPasswordForm() {
	const isFetching = useSelector(state => state.auth.isFetching);
	const dispatch = useDispatch();
	const [isShow, setIsShow] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const newEmail = JSON.parse(localStorage.getItem('emailForgot'));
	const [seconds, setSeconds] = useState(120);

	const handleSubmit = async data => {
		try {
			const newData = {
				email: newEmail,
				...data,
			};
			await dispatch(resetPassword(newData)).unwrap();

			setIsShow(true);
			setDataModal({
				title: 'Tạo mật khẩu',
				title2: 'mới thành công',
				isShowIcon: true,
				scribe: 'Mật khẩu mới của bạn là',
				scribe2: `${data.newPassword}`,
			});
		} catch (err) {
			setIsShow(true);
			setDataModal({
				title: 'Tạo mật khẩu',
				title2: ' mới thất bại',
				isShowIcon: false,
				scribe: 'Vui lòng kiểm tra vào thử lại',
				scribe2: '',
			});
		}
	};

	const formatTime = number => {
		const mins = Math.floor(number / 60)
			.toString()
			.padStart(2, '0');
		const secondRemain = Math.floor(number % 60)
			.toString()
			.padStart(2, '0');
		return `${mins}:${secondRemain}`;
	};

	const handleResendOTP = async () => {
		await dispatch(forgotPassword(newEmail)).unwrap();
	};

	const renderResendOTP = () => {
		if (seconds) {
			return (
				<>
					<span>Gửi lại mã trong</span>
					<span className='timer'>{formatTime(seconds)}</span>
				</>
			);
		}
		return (
			<span className='resend' onClick={handleResendOTP}>
				Gửi lại mã xác nhận
			</span>
		);
	};

	const handleChangeModal = () => {
		setIsShow(false);
	};

	return (
		<div className='forget__form__email'>
			{isShow && (
				<div>
					<ModalLogin data={dataModal} handleChange={handleChangeModal} />
				</div>
			)}
			<Formik
				initialValues={{ OTP: '', newPassword: '', confirmPassword: '' }}
				onSubmit={handleSubmit}
				validationSchema={resetPasswordValidate}
			>
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
					<Field name='OTP'>
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
					<Field name='newPassword'>
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
											type='password'
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
					<Field name='confirmPassword'>
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
											type='password'
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
