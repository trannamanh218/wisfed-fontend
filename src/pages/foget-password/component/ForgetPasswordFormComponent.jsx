import { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import ModalLogin from 'pages/login/element/ModalLogin';
import { changeKey } from 'reducers/redux-utils/forget-password';
import Circle from 'shared/loading/circle';
import { emailValidate } from 'helpers/Validation';
import Subtract from 'assets/images/Subtract.png';
import { forgotPassword, handleDataToResetPassword, forgotPasswordAdmin } from 'reducers/redux-utils/auth';
import PropTypes from 'prop-types';

function ForgetpasswordFormComponent({ type }) {
	const [isShow, setIsShow] = useState(false);
	const [dataModal, setDatamodal] = useState({});
	const [showImagePopover, setShowImagePopover] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();

	const handleChangeModal = () => {
		setIsShow(false);
		if (type === 'default') {
			dispatch(changeKey(true));
		}
	};

	const handleSubmit = async data => {
		if (!isShow) {
			setIsLoading(true);
			try {
				if (type === 'default') {
					const dataToResetPassword = await dispatch(forgotPassword(data)).unwrap();
					dispatch(handleDataToResetPassword({ email: dataToResetPassword.userEmail }));
				} else {
					await dispatch(forgotPasswordAdmin(data)).unwrap();
				}
				setIsShow(true);
				setDatamodal({
					title: 'Đã gửi mã',
					title2: 'Xác Nhận',
					isShowIcon: true,
					scribe: 'Vui lòng kiểm tra hòm thư ',
					scribe2: `${data.email}`,
				});
			} catch (err) {
				setIsShow(true);
				setIsLoading(false);
				setDatamodal({
					title: 'Lấy lại mật khẩu',
					title2: 'thất bại',
					isShowIcon: false,
					scribe: `${err.errorCode === 303 ? 'Tài khoản của bạn chưa tồn tại.' : ''}`,
					scribe2: `${err.errorCode === 303 ? 'Vui lòng đăng kí tài khoản' : ''}`,
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<div className='forget__form__email'>
			<Circle loading={isLoading} />
			{isShow && dataModal && (
				<div className='forgot__modal__container'>
					<ModalLogin data={dataModal} handleClose={handleChangeModal} />
				</div>
			)}
			<Formik initialValues={{ email: '' }} onSubmit={handleSubmit} validationSchema={emailValidate}>
				<Form className='forgetPassword__form'>
					<div className='forget__name-title'>
						<span>Quên mật khẩu</span>
					</div>
					<div className='forget__subcribe'>
						<span>
							Nhập vào Email bạn đã đăng ký tài khoản <br />
							để lấy lại mật khẩu
						</span>
					</div>
					<Field name='email'>
						{({ field, meta }) => {
							return (
								<div
									className={classNames('forgetPassword__form__field', {
										'error': meta.touched && meta.error,
									})}
								>
									<input
										className='forgetPassword__form__input'
										type='text'
										name='email'
										placeholder='Email đăng ký'
										{...field}
										value={field.value}
										autoComplete='false'
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
					<button className='forgetPassword__form__btn'>Lấy lại mật khẩu</button>
				</Form>
			</Formik>
		</div>
	);
}

ForgetpasswordFormComponent.defaultProps = {
	type: 'default',
};

ForgetpasswordFormComponent.propTypes = {
	type: PropTypes.string,
};

export default ForgetpasswordFormComponent;
