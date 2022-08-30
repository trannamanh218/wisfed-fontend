import { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { resetPassword, forgotPassword } from 'reducers/redux-utils/auth';
import { useDispatch, useSelector } from 'react-redux';
import ModalLogin from 'pages/login/element/ModalLogin';
import { resetPasswordValidate } from 'helpers/Validation';
import Circle from 'shared/loading/circle';
import { changeKey } from 'reducers/redux-utils/forget-password';
import { NotificationError } from 'helpers/Error';
import Subtract from 'assets/images/Subtract.png';
import EyeIcon from 'shared/eye-icon';

function CreateNewPasswordForm() {
	const [isFetching, setIsFetching] = useState(false);
	const dispatch = useDispatch();
	const [isShow, setIsShow] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const [seconds, setSeconds] = useState(180);
	const [isShowBtn, setIsShowBtn] = useState(false);
	const [valueOtp, setValueOtp] = useState('');
	const [valuePassword, setValuePassword] = useState('');
	const [valuePassword2, setValuePassword2] = useState('');
	const [showImagePopover, setShowImagePopover] = useState(0);
	const [isShowNewPassword, setIsShowNewPassword] = useState(false);
	const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

	const dataToResetPassword = useSelector(state => state.auth.dataToResetPassword);

	const handleSubmit = async data => {
		if (!isShow) {
			setIsFetching(true);
			try {
				const newData = {
					email: dataToResetPassword.email,
					...data,
					OTP: data.OTP.toString(),
				};
				await dispatch(resetPassword(newData)).unwrap();

				setIsShow(true);
				setDataModal({
					title: 'Tạo mật khẩu',
					title2: 'mới thành công',
					isShowIcon: true,
					scribe: 'Vui lòng đăng nhập lại với mật khẩu mới',
					scribe2: '',
					pathname: '/login',
				});
			} catch (err) {
				setIsShow(true);
				setIsFetching(false);
				setDataModal({
					title: 'Tạo mật khẩu',
					title2: ' mới thất bại',
					isShowIcon: false,
					scribe: 'Vui lòng kiểm tra và thử lại',
					scribe2: '',
				});
			} finally {
				setIsFetching(false);
			}
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
		}, 1000);

		return () => {
			clearInterval(countDown);
		};
	}, [seconds]);

	const handleResendOTP = async () => {
		const data = {
			email: dataToResetPassword.email,
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
			setIsShow(true);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleChangeModal = () => {
		setIsShow(false);
		if (dataModal.icon === true) {
			dispatch(changeKey(false));
		}
	};

	useEffect(() => {
		if (valueOtp && valuePassword && valuePassword2) {
			setIsShowBtn(true);
		} else {
			setIsShowBtn(false);
		}
	}, [valueOtp, valuePassword, valuePassword2]);

	return (
		<div className='forget__form__email create-new-password'>
			<Circle loading={isFetching} />
			{isShow && (
				<div className='forgot__modal__container'>
					<ModalLogin data={dataModal} handleClose={handleChangeModal} />
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
							Nhập mã xác nhận 08 chữ số vừa được gửi <br /> về Email đã đăng ký của bạn. Sau đó <br />
							tạo mật khẩu mới
						</span>
					</div>
					<Field name='OTP'>
						{({ field, meta }) => {
							setValueOtp(field.value);
							return (
								<div
									className={classNames('forgetPassword__form__field', {
										'error': meta.touched && meta.error,
									})}
								>
									<input
										className='forgetPassword__form__input'
										type='number'
										placeholder='Nhập mã OTP'
										{...field}
										value={field.value}
									/>
									<div
										className={classNames('error--text', {
											'show': meta.touched && meta.error,
										})}
									>
										<div className='login__form__error'>
											<img
												src={Subtract}
												alt='img'
												onMouseOver={() => setShowImagePopover(1)}
												onMouseLeave={() => setShowImagePopover(0)}
											/>
											<div
												className={classNames('login__form__error__popover-container', {
													'show': showImagePopover === 1,
												})}
											>
												<div>
													<div className='error--textbox'>
														<div className='error--textbox--logo'></div>
														<div className='error--textbox--error'></div>
													</div>
													<div className='Login__form__error__popover'>
														<div>{meta.error}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						}}
					</Field>
					<div className='forget__send-otp__link'>
						<span
							className={seconds === 0 ? 'forget__send-otp__link__get-otp-again' : 'disabled-link'}
							onClick={handleResendOTP}
						>
							Không nhận được mã? Gửi lại
						</span>
						<span className={seconds !== 0 ? 'timer' : 'hide-timer'}>{formatTime(seconds)}</span>
					</div>
					<hr />
					<Field name='newPassword'>
						{({ field, meta }) => {
							setValuePassword(field.value);
							return (
								<div
									className={classNames('forgetPassword__form__field', {
										'error': meta.touched && meta.error,
									})}
								>
									<input
										className='forgetPassword__form__input'
										type={isShowNewPassword ? 'text' : 'password'}
										placeholder='Mật khẩu mới'
										{...field}
										value={field.value}
										autoComplete='new-password'
									/>
									<div>
										<EyeIcon
											isPublic={isShowNewPassword}
											handlePublic={() => setIsShowNewPassword(!isShowNewPassword)}
										/>
									</div>
									<div
										className={classNames('error--text', {
											'show': meta.touched && meta.error,
										})}
									>
										<div className='login__form__error'>
											<img
												src={Subtract}
												alt='img'
												onMouseOver={() => setShowImagePopover(2)}
												onMouseLeave={() => setShowImagePopover(0)}
											/>
											<div
												className={classNames('login__form__error__popover-container', {
													'show': showImagePopover === 2,
												})}
											>
												<div>
													<div className='error--textbox'>
														<div className='error--textbox--logo'></div>
														<div className='error--textbox--error'></div>
													</div>
													<div className='Login__form__error__popover'>
														<div>{meta.error}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						}}
					</Field>
					<Field name='confirmPassword'>
						{({ field, meta }) => {
							setValuePassword2(field.value);
							return (
								<div
									className={classNames('forgetPassword__form__field', {
										'error': meta.touched && meta.error,
									})}
								>
									<input
										className='forgetPassword__form__input'
										type={isShowConfirmPassword ? 'text' : 'password'}
										placeholder='Xác nhận lại mật khẩu mới'
										{...field}
										value={field.value}
										autoComplete='new-password'
									/>
									<div>
										<EyeIcon
											isPublic={isShowConfirmPassword}
											handlePublic={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
										/>
									</div>
									<div
										className={classNames('error--text', {
											'show': meta.touched && meta.error,
										})}
									>
										<div className='login__form__error'>
											<img
												src={Subtract}
												alt='img'
												onMouseOver={() => setShowImagePopover(3)}
												onMouseLeave={() => setShowImagePopover(0)}
											/>
											<div
												className={classNames('login__form__error__popover-container', {
													'show': showImagePopover === 3,
												})}
											>
												<div>
													<div className='error--textbox'>
														<div className='error--textbox--logo'></div>
														<div className='error--textbox--error'></div>
													</div>
													<div className='Login__form__error__popover'>
														<div>{meta.error}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
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

export default CreateNewPasswordForm;
