import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { resetPassword, forgotPassword } from 'reducers/redux-utils/auth';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import ModalLogin from 'pages/login/element/ModalLogin';
import { resetPasswordValidate } from 'helpers/Validation';
import { Circle } from 'shared/loading';
import { toast } from 'react-toastify';

function CreatNewPasswordForm() {
	const isFetching = useSelector(state => state.auth.isFetching);
	const dispatch = useDispatch();
	const [isShow, setIsShow] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const newEmail = JSON.parse(localStorage.getItem('emailForgot'));
	const [seconds, setSeconds] = useState(180);
	const [secondsEffect, setSecondsEffect] = useState(300);
	const [isShowBtn, setIsShowBtn] = useState(false);
	const [valuePassword2, setValuePassword2] = useState('');
	const [valueOtp, setValueOtp] = useState('');
	const [valuePassword, setValuePassword] = useState('');

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
				scribe: 'Vui lòng đăng nhập lại',
				scribe2: 'với mật khẩu mới',
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

	useEffect(() => {
		const countDown = setInterval(() => {
			if (seconds > 0) {
				setSeconds(seconds - 1);
			}
			return;
		}, 1000);

		const countDownEffect = setTimeout(() => {
			if (secondsEffect > 0) {
				setSecondsEffect(secondsEffect - 1);
			}
			// else {
			// 	setIsModalError(true);
			// }
			return;
		}, 1000);

		return () => {
			clearInterval(countDown);
			clearTimeout(countDownEffect);
		};
	});

	const handleResendOTP = async () => {
		const data = {
			email: newEmail,
		};
		try {
			await dispatch(forgotPassword(data)).unwrap();
			setSeconds(180);
			setDataModal({
				title: 'Đã gửi mã',
				title2: 'Xác Nhận',
				isShowIcon: true,
				scribe: 'Vui lòng kiểm tra hòm thư ',
				scribe2: `${data.email}`,
			});
			setTimeout(() => {
				setIsShow(true);
			}, 500);
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	const handleChangeModal = () => {
		setIsShow(false);
	};

	useEffect(() => {
		if (valueOtp && valuePassword && valuePassword2) {
			setIsShowBtn(true);
		} else if (valueOtp === '' || valuePassword === '' || valuePassword2 === '') {
			setIsShowBtn(false);
		}
	}, [valueOtp, valuePassword, valuePassword2]);

	return (
		<div className='forget__form__email'>
			<Circle loading={isFetching} />
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
							setValueOtp(field.value);
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
						<span className={seconds === 0 ? '' : 'disabled-bnt'} onClick={handleResendOTP}>
							Không nhận được mã? Gửi lại
						</span>
						<span className={seconds !== 0 ? 'timer' : 'timer disabled-span'}>{formatTime(seconds)}</span>
					</div>
					<hr />
					<Field name='newPassword'>
						{({ field, meta }) => {
							setValuePassword(field.value);
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
							setValuePassword2(field.value);
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
					<button
						className={
							isShowBtn
								? 'forgetPassword__form__btn-otp'
								: 'forgetPassword__form__btn-otp disabled-bnt-forgot'
						}
					>
						Lấy lại mật khẩu
					</button>
				</Form>
			</Formik>
		</div>
	);
}

export default CreatNewPasswordForm;
