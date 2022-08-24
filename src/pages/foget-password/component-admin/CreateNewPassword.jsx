import { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { resetPasswordAdmin } from 'reducers/redux-utils/auth';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import ModalLogin from 'pages/login/element/ModalLogin';
import { resetPasswordAdminValidate } from 'helpers/Validation';
import Circle from 'shared/loading/circle';
import Subtract from 'assets/images/Subtract.png';
import EyeIcon from 'shared/eye-icon';

function CreateNewPasswordAdminForm() {
	const [isFetching, setIsFetching] = useState(false);
	const dispatch = useDispatch();
	const [isShow, setIsShow] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const [isShowBtn, setIsShowBtn] = useState(false);
	const [valuePassword2, setValuePassword2] = useState('');
	const [valuePassword, setValuePassword] = useState('');
	const [isShowNewPassword, setIsShowNewPassword] = useState(false);
	const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
	const [showImagePopover, setShowImagePopover] = useState(0);

	const dataToResetPassword = useSelector(state => state.auth.dataToResetPassword);

	const handleSubmit = async data => {
		if (!isShow) {
			setIsFetching(true);
			try {
				const newData = {
					email: dataToResetPassword.email,
					OTP: dataToResetPassword.otp,
					...data,
				};
				await dispatch(resetPasswordAdmin(newData)).unwrap();
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

	const handleChangeModal = () => {
		setIsShow(false);
	};

	useEffect(() => {
		if (valuePassword && valuePassword2) {
			setIsShowBtn(true);
		} else if (valuePassword === '' || valuePassword2 === '') {
			setIsShowBtn(false);
		}
	}, [valuePassword, valuePassword2]);

	return (
		<div className='forget__form__email'>
			<Circle loading={isFetching} />
			{isShow && (
				<div>
					<ModalLogin data={dataModal} handleClose={handleChangeModal} />
				</div>
			)}
			<Formik
				initialValues={{ newPassword: '', confirmPassword: '' }}
				onSubmit={handleSubmit}
				validationSchema={resetPasswordAdminValidate}
			>
				<Form className='forgetPassword__form'>
					<div className='forget__name-title'>
						<span>Xác nhận mật khẩu mới</span>
					</div>
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
														{meta.touched && meta.error && <div>{meta.error}</div>}
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
														{meta.touched && meta.error && <div>{meta.error}</div>}
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
						type='submit'
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

export default CreateNewPasswordAdminForm;
