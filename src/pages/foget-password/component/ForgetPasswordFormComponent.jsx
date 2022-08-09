import { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import ModalLogin from 'pages/login/element/ModalLogin';
import { forgotPassword } from 'reducers/redux-utils/auth';
import { changeKey } from 'reducers/redux-utils/forget-password';
import { useSelector } from 'react-redux';
import Circle from 'shared/loading/circle';
import { emailValidate } from 'helpers/Validation';
import Subtract from 'assets/images/Subtract.png';

function ForgetpasswordFormComponent() {
	const isFetching = useSelector(state => state.auth.isFetching);
	const dispatch = useDispatch();
	const [isShow, setIsShow] = useState(false);
	const [dataModal, setDatamodal] = useState({});
	const [showImagePopover, setShowImagePopover] = useState(false);
	const [checkUser, setCheckUser] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleChangeModal = () => {
		setIsShow(false);
		if (checkUser === true) {
			dispatch(changeKey(true));
		}
	};

	const handleSubmit = async data => {
		setIsLoading(true);
		try {
			localStorage.setItem('emailForgot', JSON.stringify(data.email));
			await dispatch(forgotPassword(data)).unwrap();
			setCheckUser(true);
			setIsShow(true);
			setIsLoading(false);
			setDatamodal({
				title: 'Đã gửi mã',
				title2: 'Xác Nhận',
				isShowIcon: true,
				scribe: 'Vui lòng kiểm tra hòm thư ',
				scribe2: `${data.email}`,
			});
		} catch (err) {
			setIsShow(true);
			setDatamodal({
				title: 'Lấy lại mật khẩu',
				title2: 'thất bại',
				isShowIcon: false,
				scribe: `${err.errorCode === 303 ? 'Tài khoản của bạn chưa tồn tại.' : ''}`,
				scribe2: `${err.errorCode === 303 ? 'Vui lòng đăng kí tài khoản' : ''}`,
			});
		}
	};

	return (
		<div className='forget__form__email'>
			<Circle loading={isLoading} />
			{isShow && dataModal && (
				<div className='forgot__modal__container'>
					<ModalLogin data={dataModal} handleChange={handleChangeModal} />
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
								<div className='forgetPassword__form__field'>
									<div
										className={classNames('forgetPassword__form__group', {
											'error': meta.touched && meta.error,
										})}
									>
										<input
											className='forgetPassword__form__input'
											type='email'
											placeholder='Email đăng ký'
											{...field}
											value={field.value}
											autoComplete='false'
										/>
										{meta.touched && meta.error && (
											<div
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
							);
						}}
					</Field>
					<button className='forgetPassword__form__btn'>Lấy lại mật khẩu</button>
				</Form>
			</Formik>
		</div>
	);
}

export default ForgetpasswordFormComponent;
