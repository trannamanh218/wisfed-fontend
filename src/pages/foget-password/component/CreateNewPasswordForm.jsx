import { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { resetPassword, forgotPassword } from 'reducers/redux-utils/auth';
import { useDispatch } from 'react-redux';
import ModalLogin from 'pages/login/element/ModalLogin';
import { resetPasswordValidate } from 'helpers/Validation';
import Circle from 'shared/loading/circle';
import { changeKey } from 'reducers/redux-utils/forget-password';
import { NotificationError } from 'helpers/Error';
import Subtract from 'assets/images/Subtract.png';

function CreateNewPasswordForm() {
	// const isFetching = useSelector(state => state.auth.isFetching);
	const [isFetching, setIsFetching] = useState(false);
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
	const [showImagePopover, setShowImagePopover] = useState(false);
	const [showImagePopover1, setShowImagePopover1] = useState(false);
	const [showImagePopover2, setShowImagePopover2] = useState(false);

	const handleSubmit = async data => {
		setIsFetching(true);
		try {
			const newData = {
				email: newEmail,
				...data,
			};
			await dispatch(resetPassword(newData)).unwrap();

			setIsShow(true);
			setIsFetching(false);
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
		<div className='forget__form__email'>
			<Circle loading={isFetching} />
			{isShow && (
				<div>
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
								<div className='forgetPassword__form__field'>
									<div
										className={classNames('forgetPassword__form__group', {
											'error': meta.touched && meta.error,
										})}
									>
										<input
											maxLength={8}
											className='forgetPassword__form__input'
											type='text'
											placeholder='Nhập mã OTP'
											{...field}
											value={field.value}
											// autoComplete='off'
										/>
										<div className='error--text'>
											{meta.touched && meta.error && (
												<div
													style={{ top: '18px' }}
													className='login__form__error'
													onMouseOver={() => setShowImagePopover(1)}
													onMouseLeave={() => setShowImagePopover(0)}
												>
													<img src={Subtract} alt='img' data-tip data-for='registerTip' />
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
																{meta.touched && meta.error && <div>{meta.error}</div>}
															</div>
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							);
						}}
					</Field>
					<div className='forget__send-otp__link'>
						<span className={seconds === 0 ? '' : 'disabled-link'} onClick={handleResendOTP}>
							Không nhận được mã? Gửi lại
						</span>
						<span className={seconds !== 0 ? 'timer' : 'timer disabled-span'}>{formatTime(seconds)}</span>
					</div>
					<hr />
					<Field name='newPassword'>
						{({ field, meta }) => {
							setValuePassword(field.value);
							return (
								<div className='forgetPassword__form__field  '>
									<div
										className={classNames('forgetPassword__form__group input-1', {
											'error': meta.touched && meta.error,
										})}
									>
										<input
											className='forgetPassword__form__input-password'
											type='password'
											placeholder='Mật khẩu mới'
											{...field}
											value={field.value}
											autoComplete='new-password'
										/>
										<div className='error--text'>
											{meta.touched && meta.error && (
												<div
													className='login__form__error'
													onMouseOver={() => setShowImagePopover1(1)}
													onMouseLeave={() => setShowImagePopover1(0)}
													style={{ top: '18px', zIndex: '1000' }}
												>
													<img src={Subtract} alt='img' data-tip data-for='registerTip' />
													<div
														className={classNames('login__form__error__popover-container', {
															'show': showImagePopover1 === 1,
														})}
													>
														<div>
															<div className='error--textbox'>
																<div className='error--textbox--logo'></div>
																<div className='error--textbox--error'></div>
															</div>
															<div className='Login__form__error__popover'>
																{meta.touched && meta.error && <div>{meta.error}</div>}
															</div>
														</div>
													</div>
												</div>
											)}
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
											// autoComplete='off'
										/>
										{meta.touched && meta.error && (
											<div className='error--text'>
												<div
													style={{ top: '18px' }}
													className='login__form__error'
													onMouseOver={() => setShowImagePopover2(1)}
													onMouseLeave={() => setShowImagePopover2(0)}
												>
													<img src={Subtract} alt='img' data-tip data-for='registerTip' />
													<div
														className={classNames('login__form__error__popover-container', {
															'show': showImagePopover2 === 1,
														})}
													>
														<div>
															<div className='error--textbox'>
																<div className='error--textbox--logo'></div>
																<div className='error--textbox--error'></div>
															</div>
															<div className='Login__form__error__popover'>
																{meta.touched && meta.error && <div>{meta.error}</div>}
															</div>
														</div>
													</div>
												</div>
											</div>
										)}
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
