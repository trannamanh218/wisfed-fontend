import React, { useState } from 'react';
import Logo from 'assets/images/Logo 2.png';
import ImageLogin from 'assets/images/cover-sign 1.png';
import { Formik, Field, Form } from 'formik';
import '../login.scss';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Validation from 'helpers/Validation';
import { FaceBookIcon, GmailIcon } from 'components/svg';
import { toast } from 'react-toastify';
import { getLoginFacebook, login } from 'reducers/redux-utils/auth';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import ModalLogin from './ModalLogin';
import { useNavigate } from 'react-router-dom';
import EyeIcon from 'shared/eye-icon';
import _ from 'lodash';

import Subtract from 'assets/images/Subtract.png';

function LoginComponet() {
	const [showImagePopover, setShowImagePopover] = useState(false);
	const [isShow, setIsShow] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const [isPublic, setIsPublic] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleSubmit = async data => {
		try {
			const actionLogin = await dispatch(login(data));
			const infoUser = unwrapResult(actionLogin);
			if (infoUser) {
				toast.success('Đăng nhập thành công');
				if (!_.isEmpty(infoUser?.favoriteCategory)) {
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

	const handleChangeIcon = () => {
		setIsPublic(!isPublic);
	};

	const handleChange = () => {
		setIsShow(false);
	};

	return (
		<div className='login__container'>
			{isShow && dataModal && (
				<div className='login__container-modal'>
					{' '}
					<ModalLogin data={dataModal} handleChange={handleChange} />
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
				<div className='login-facebook'>
					<a href='https://wisfeed.tecinus.vn/api/v1/auth/facebook'>
						<FaceBookIcon className='login__fbIcon' /> <button>Đăng nhập bằng Facebook</button>
					</a>
				</div>
				<a href='https://wisfeed.tecinus.vn/api/v1/auth/google'>
					<div className='login-gmail'>
						<GmailIcon className='GmailIcon' /> <button>Đăng nhập bằng Gmail</button>
					</div>
				</a>
				<hr style={{ opacity: '0.1' }} />
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
										<div className='login__form__field'>
											<div
												className={classNames('login__form__group', {
													'error': meta.touched && meta.error,
												})}
											>
												<input
													className='login__form__input'
													type='email'
													placeholder='Email'
													{...field}
													value={field.value}
													autoComplete='false'
												/>
												<div className='error--text'>
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
										</div>
									);
								}}
							</Field>

							<Field name='password'>
								{({ field, meta }) => (
									<div className='login__form__field'>
										<div
											className={classNames('login__form__group', {
												'error': meta.touched && meta.error,
											})}
										>
											<input
												className='login__form__input'
												type={isPublic ? 'text' : 'password'}
												placeholder='Mật khẩu'
												{...field}
												value={field.value}
												autoComplete='new-password'
											/>
											<div>
												<EyeIcon isPublic={isPublic} handlePublic={handleChangeIcon} />
											</div>
											<div className='error--text'>
												{meta.touched && meta.error && (
													<div
														className='login__form__error'
														onMouseOver={() => setShowImagePopover(2)}
														onMouseLeave={() => setShowImagePopover(0)}
													>
														<img src={Subtract} alt='img' data-tip data-for='registerTip' />
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
									</div>
								)}
							</Field>
							<button className='login__form__btn'>Đăng nhập</button>
						</Form>
					</Formik>
					<div className='login__form__link'>
						<Link to='/forget-password'>Quên mật khẩu ?</Link>
					</div>
					<hr style={{ opacity: '0.1' }} />
					<div className='login__register'>
						<Link to='/register'>
							<button>Tạo tài khoản</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginComponet;