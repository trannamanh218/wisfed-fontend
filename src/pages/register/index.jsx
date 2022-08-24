import { useState, useEffect } from 'react';
import './register.scss';
import Logo from 'assets/images/Logo 2.png';
import Subtract from 'assets/images/Subtract.png';
import ImgRegister from 'assets/images/anh-1 1.png';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { registerValidate } from 'helpers/Validation';
import { useDispatch } from 'react-redux';
import ModalLogin from 'pages/login/element/ModalLogin';
import { register } from 'reducers/redux-utils/auth';
import Circle from 'shared/loading/circle';
import { Link, useNavigate } from 'react-router-dom';
import Storage from 'helpers/Storage';
import EyeIcon from 'shared/eye-icon';

function Register() {
	const dispatch = useDispatch();
	const [showImagePopover, setShowImagePopover] = useState(false);
	const [isShow, setIsShow] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [isPublic, setIsPublic] = useState(false);
	const [isPublicConfirm, setIsPublicConfirm] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async data => {
		const newData = {
			email: data.email,
			password: data.password,
			confirm_password: data.password,
			firstName: data.firstname,
			lastName: data.lastname,
		};
		if (newData) {
			try {
				setIsLoading(true);
				const infoUser = await dispatch(register(newData)).unwrap();
				if (infoUser) {
					const newdata = {
						title: 'Tạo tài khoản',
						title2: 'thành công',
						isShowIcon: true,
						scribe: 'Tài khoản Wisfeed của bạn là,',
						scribe2: `${newData.email}`,
						pathname: '/login',
					};
					setIsLoading(false);
					setDataModal(newdata);
					setIsShow(true);
					localStorage.setItem('registerEmailFill', newData.email);
				}
			} catch {
				setIsLoading(false);
				setIsShow(true);
				const newdata = {
					title: 'Tạo tài khoản',
					title2: 'thất bại',
					isShowIcon: false,
					scribe: 'vui lòng kiểm tra lại thông tin và',
					scribe2: 'thử lại',
				};
				setDataModal(newdata);
			}
		}
	};

	const handleClose = () => {
		setIsShow(false);
	};

	useEffect(() => {
		if (Storage.getAccessToken()) {
			navigate('/');
		}
	}, []);

	const handleChangeIcon = () => {
		setIsPublic(!isPublic);
	};

	const handleChangeIconComfirm = () => {
		setIsPublicConfirm(!isPublicConfirm);
	};

	return (
		<div className='register__container'>
			<Circle loading={isLoading} />
			<Link to='/login'>
				<div className='register__header'>
					<img src={Logo} alt='logo' />
				</div>
			</Link>
			{isShow ? (
				<div className='register__container-modal'>
					<ModalLogin data={dataModal} handleClose={handleClose} />
				</div>
			) : (
				''
			)}
			<div className='register__body'>
				<div className='register__body-img'>
					<img src={ImgRegister} />
				</div>
				<div className='register__form'>
					<div className='register__box'>
						<Formik
							initialValues={{ firstname: '', lastname: '', email: '', password: '' }}
							onSubmit={handleSubmit}
							validationSchema={registerValidate}
						>
							<Form className='register__form-register'>
								<div className='register__form-title'>
									<span>
										Tạo tài khoản <br /> nhanh chóng và dễ dàng
									</span>
								</div>
								<div className='register__name'>
									<Field name='firstname'>
										{({ field, meta }) => {
											return (
												<div
													className={classNames('register__form__field name', {
														'error': meta.error && meta.touched,
													})}
												>
													<input
														className='register__form__input-name'
														type='text'
														placeholder='Họ'
														{...field}
														value={field.value}
														autoComplete='false'
														style={meta.error ? { width: '90%' } : { width: '100%' }}
													/>
													<div
														className={classNames('error--text', {
															'show': meta.error,
														})}
													>
														{meta.touched && meta.error && (
															<div
																className='login__form__error'
																onMouseOver={() => setShowImagePopover(1)}
																onMouseLeave={() => setShowImagePopover(0)}
															>
																<img
																	src={Subtract}
																	alt='img'
																	data-tip
																	data-for='registerTip'
																/>
																<div
																	className={classNames(
																		'login__form__error__popover-container',
																		{
																			'show': showImagePopover === 1,
																		}
																	)}
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
														)}
													</div>
												</div>
											);
										}}
									</Field>
									<Field name='lastname'>
										{({ field, meta }) => {
											return (
												<div
													className={classNames('register__form__field name', {
														'error': meta.error && meta.touched,
													})}
												>
													<input
														className='register__form__input-name'
														type='text'
														placeholder='Tên'
														{...field}
														value={field.value}
														autoComplete='false'
														style={meta.error ? { width: '90%' } : { width: '100%' }}
													/>
													<div
														className={classNames('error--text', {
															'show': meta.error,
														})}
													>
														{meta.touched && meta.error && (
															<div
																className='login__form__error'
																onMouseOver={() => setShowImagePopover(2)}
																onMouseLeave={() => setShowImagePopover(0)}
															>
																<img
																	src={Subtract}
																	alt='img'
																	data-tip
																	data-for='registerTip'
																/>
																<div
																	className={classNames(
																		'login__form__error__popover-container',
																		{
																			'show': showImagePopover === 2,
																		}
																	)}
																>
																	<div>
																		<div className='error--textbox'>
																			<div className='error--textbox--logo'></div>
																			<div className='error--textbox--error'></div>
																		</div>
																		<div className='Login__form__error__popover'>
																			{meta.touched && meta.error && (
																				<div>{meta.error}</div>
																			)}
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
								</div>

								<Field name='email'>
									{({ field, meta }) => {
										return (
											<div
												className={classNames('register__form__field', {
													'error': meta.error && meta.touched,
												})}
											>
												<input
													className='register__form__input'
													type='email'
													placeholder='Số điện thoại hoặc Email'
													{...field}
													value={field.value}
													autoComplete='false'
													style={meta.error ? { width: '93%' } : { width: '100%' }}
												/>
												<div
													className={classNames('error--text', {
														'show': meta.error,
													})}
												>
													{meta.touched && meta.error && (
														<div
															className='login__form__error'
															onMouseOver={() => setShowImagePopover(3)}
															onMouseLeave={() => setShowImagePopover(0)}
														>
															<img
																src={Subtract}
																alt='img'
																data-tip
																data-for='registerTip'
															/>
															<div
																className={classNames(
																	'login__form__error__popover-container',
																	{
																		'show': showImagePopover === 3,
																	}
																)}
															>
																<div>
																	<div className='error--textbox'>
																		<div className='error--textbox--logo'></div>
																		<div className='error--textbox--error'></div>
																	</div>
																	<div className='Login__form__error__popover'>
																		{meta.touched && meta.error && (
																			<div>{meta.error}</div>
																		)}
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

								<Field name='password'>
									{({ field, meta }) => (
										<div
											className={classNames('register__form__field', {
												'error': meta.error && meta.touched,
											})}
										>
											<input
												className='register__form__input'
												type={isPublic ? 'text' : 'password'}
												placeholder='Mật khẩu'
												{...field}
												value={field.value}
												autoComplete='new-password'
												style={meta.error ? { width: '93%' } : { width: '100%' }}
											/>
											<EyeIcon isPublic={isPublic} handlePublic={handleChangeIcon} />
											<div
												className={classNames('error--text', {
													'show': meta.error,
												})}
											>
												{meta.touched && meta.error && (
													<div
														className='login__form__error'
														onMouseOver={() => setShowImagePopover(4)}
														onMouseLeave={() => setShowImagePopover(0)}
													>
														<img src={Subtract} alt='img' data-tip data-for='registerTip' />
														<div
															className={classNames(
																'login__form__error__popover-container',
																{
																	'show': showImagePopover === 4,
																}
															)}
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
												)}
											</div>
											<div></div>
										</div>
									)}
								</Field>

								<Field name='confirmPassword'>
									{({ field, meta }) => (
										<div
											className={classNames('register__form__field', {
												'error': meta.error && meta.touched,
											})}
										>
											<input
												className='register__form__input'
												type={isPublicConfirm ? 'text' : 'password'}
												placeholder='Xác nhận mật khẩu'
												{...field}
												value={field.value}
												// autoComplete='new-password'
												style={meta.error ? { width: '93%' } : { width: '100%' }}
											/>
											<EyeIcon
												isPublic={isPublicConfirm}
												handlePublic={handleChangeIconComfirm}
											/>
											<div
												className={classNames('error--text', {
													'show': meta.error,
												})}
											>
												{meta.touched && meta.error && (
													<div
														className='login__form__error'
														onMouseOver={() => setShowImagePopover(5)}
														onMouseLeave={() => setShowImagePopover(0)}
													>
														<img src={Subtract} alt='img' data-tip data-for='registerTip' />
														<div
															className={classNames(
																'login__form__error__popover-container',
																{
																	'show': showImagePopover === 5,
																}
															)}
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
												)}
											</div>
										</div>
									)}
								</Field>

								<button className='register__form__btn'>Tạo tài khoản</button>
							</Form>
						</Formik>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;
