import { useState } from 'react';
import Logo from 'assets/images/Logo 2.png';
import ImageLogin from 'assets/images/cover-sign 1.png';
import { Formik, Field, Form } from 'formik';
import './login.scss';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Validation from 'helpers/Validation';
import { FaceBookIcon, GmailIcon } from 'components/svg';
import { toast } from 'react-toastify';
import { login, getCheckJwt } from 'reducers/redux-utils/auth';
import { useDispatch } from 'react-redux';
import ModalLogin from './element/ModalLogin';
import { useNavigate } from 'react-router-dom';
import EyeIcon from 'shared/eye-icon';
import Subtract from 'assets/images/Subtract.png';
import _ from 'lodash';
import { useEffect } from 'react';
import Storage from 'helpers/Storage';

function Login() {
	const [showImagePopover, setShowImagePopover] = useState(false);
	const [isShow, setIsShow] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const [isPublic, setIsPublic] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [registerEmailFill, setRegisterEmailFill] = useState('');

	const handleSubmit = async data => {
		const dataSend = {
			email: data.email.toLowerCase(),
			password: data.password,
		};
		try {
			const infoUserLogin = await dispatch(login(dataSend)).unwrap();
			if (infoUserLogin) {
				const actionCheckJwt = await dispatch(getCheckJwt()).unwrap();
				const customId = 'custom-id-Login';
				toast.success('Đăng nhập thành công', { toastId: customId });
				if (!_.isEmpty(actionCheckJwt?.favoriteCategory)) {
					navigate('/');
				} else {
					navigate('/choose-topic');
				}
			}
		} catch {
			const newdata = {
				title: 'Đăng nhập',
				title2: 'thất bại',
				isShowIcon: false,
				scribe: 'Vui lòng kiểm tra lại tài khoản,',
				scribe2: 'mật khẩu và thử đăng nhập lại',
			};
			setDataModal(newdata);
			setIsShow(true);
		}
	};

	useEffect(() => {
		if (Storage.getAccessToken()) {
			navigate('/');
		}
		const registerEmailFillLocalStorage = localStorage.getItem('registerEmailFill');
		if (registerEmailFillLocalStorage) {
			setRegisterEmailFill(registerEmailFillLocalStorage);
		}
	}, []);

	const handleChangeIcon = () => {
		setIsPublic(!isPublic);
	};

	const handleClose = () => {
		setIsShow(false);
	};

	return (
		<div className='login__container'>
			{isShow && dataModal && (
				<div className='login__container-modal'>
					<ModalLogin data={dataModal} handleClose={handleClose} />
				</div>
			)}
			<div>
				<Link to='/'>
					<div className='login__header'>
						<img src={Logo} alt='logo' />
					</div>
				</Link>
				<div className='login__body'>
					<div>
						<span className='login__body-text1'>
							Khám phá mạng xã hội chia sẻ sách và sáng tạo nội dung
							<br /> đầu tiên tại Việt Nam
						</span>
					</div>
					<div>
						<span className='login__body-text2'>
							You're in the right place. Tell us what titles <br />
							or genres you've enjoyed in the past, and <br /> we'll give you surprisingly insightful
							<br /> recommendations.
						</span>
					</div>
				</div>
				<div className='login__footer'>
					<img src={ImageLogin} alt='img' />
				</div>
			</div>

			<div className='login__login-box'>
				<div>
					<span className='login__login-box__title'>Đăng nhập và Khám phá</span>
				</div>
				<a href='https://wisfeed.tecinus.vn/api/v1/auth/facebook'>
					<div className='login-facebook'>
						<FaceBookIcon className='login__fbIcon' />
						<button>Đăng nhập bằng Facebook</button>
					</div>
				</a>
				<a href='https://wisfeed.tecinus.vn/api/v1/auth/google'>
					<div className='login-gmail'>
						<GmailIcon className='GmailIcon' />
						<button>Đăng nhập bằng Gmail</button>
					</div>
				</a>
				<hr style={{ opacity: '0.05' }} />
				<div>
					<div>
						<span className='login__form-title'>Đăng nhập tài khoản Wisfeed</span>
					</div>
					<Formik
						initialValues={{ email: '', password: '' }}
						onSubmit={handleSubmit}
						validationSchema={Validation.login()}
					>
						<Form className='login__form'>
							<Field name='email'>
								{({ field, meta }) => {
									return (
										<div
											className={classNames('login__form__field', {
												'error': meta.error && meta.touched,
											})}
										>
											<input
												className='login__form__input'
												type='email'
												placeholder='Email'
												{...field}
												value={registerEmailFill || field.value}
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
														onMouseOver={() => setShowImagePopover(1)}
														onMouseLeave={() => setShowImagePopover(0)}
													>
														<img src={Subtract} alt='img' data-tip data-for='registerTip' />
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

							<Field name='password'>
								{({ field, meta }) => (
									<div
										className={classNames('login__form__field', {
											'error': meta.error && meta.touched,
										})}
									>
										<input
											className='login__form__input'
											type={isPublic ? 'text' : 'password'}
											placeholder='Mật khẩu'
											{...field}
											value={field.value}
											autoComplete='new-password'
											style={meta.error ? { width: '93%' } : { width: '100%' }}
										/>
										<div>
											<EyeIcon isPublic={isPublic} handlePublic={handleChangeIcon} />
										</div>
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
													<img src={Subtract} alt='img' data-tip data-for='registerTip' />
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
											)}
										</div>
									</div>
								)}
							</Field>
							<button className='login__form__btn'>Đăng nhập</button>
						</Form>
					</Formik>
					<div className='login__form__link'>
						<Link to='/forget-password'>Quên mật khẩu ?</Link>
					</div>
					<hr style={{ opacity: '0.05' }} />
					<Link className='login__register' to='/register'>
						Tạo tài khoản
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Login;
