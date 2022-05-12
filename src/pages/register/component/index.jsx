import { useState } from 'react';
import '../register.scss';
import Logo from 'assets/images/Logo 2.png';
import Subtract from 'assets/images/Subtract.png';
import ImgRegister from 'assets/images/anh-1 1.png';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { registerValidate } from 'helpers/Validation';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import ModalLogin from 'pages/login/element/ModalLogin';
import { register } from 'reducers/redux-utils/auth';
import Circle from 'shared/loading/circle';
import ReactTooltip from 'react-tooltip';

function RegisterComponent() {
	const dispatch = useDispatch();
	const [isShow, setIsShow] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const isFetching = useSelector(state => state.auth.isFetching);
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
				const actionRegister = await dispatch(register(newData));
				const infoUser = unwrapResult(actionRegister);
				if (infoUser) {
					const newdata = {
						title: 'Tạo tài khoản',
						title2: 'thành công',
						isShowIcon: true,
						scribe: 'Tài khoản Wisfeed của bạn là,',
						scribe2: `${newData.email}`,
						pathname: '/login',
					};
					setDataModal(newdata);
					setIsShow(true);
				}
			} catch {
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

	const handleChange = () => {
		setIsShow(false);
	};

	return (
		<div className='register__container'>
			<Circle loading={isFetching} />
			<div className='register__header'>
				<img src={Logo} alt='logo' />
			</div>
			{isShow ? (
				<div className='register__container-modal'>
					<ModalLogin data={dataModal} handleChange={handleChange} />
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
						{' '}
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
												<div className='register__form__field'>
													<div
														className={classNames('register__form__group', {
															'error': meta.touched && meta.error,
														})}
													>
														<input
															className='register__form__input-name'
															type='text'
															placeholder='Họ'
															{...field}
															value={field.value}
															autoComplete='false'
														/>
														<div className='error--text'>
															{meta.touched && meta.error && (
																<div>
																	<img
																		src={Subtract}
																		alt='img'
																		data-tip
																		data-for='registerTip'
																	/>
																	<ReactTooltip
																		id='registerTip'
																		place='bottom'
																		effect='solid'
																		backgroundColor='#E61B00'
																	>
																		{meta.touched && meta.error && (
																			<div>{meta.error}</div>
																		)}
																	</ReactTooltip>
																</div>
															)}
														</div>
													</div>
												</div>
											);
										}}
									</Field>
									<Field name='lastname'>
										{({ field, meta }) => {
											return (
												<div className='register__form__field'>
													<div
														className={classNames('register__form__group', {
															'error': meta.touched && meta.error,
														})}
													>
														<input
															className='register__form__input-name'
															type='text'
															placeholder='Tên'
															{...field}
															value={field.value}
															autoComplete='false'
														/>
														<div className='error--text'>
															{meta.touched && meta.error && (
																<div>
																	<img
																		src={Subtract}
																		alt='img'
																		data-tip
																		data-for='registerTip'
																	/>
																	<ReactTooltip
																		id='registerTip'
																		place='bottom'
																		effect='solid'
																		backgroundColor='#E61B00'
																	>
																		{meta.touched && meta.error && (
																			<div>{meta.error}</div>
																		)}
																	</ReactTooltip>
																</div>
															)}
														</div>
													</div>
												</div>
											);
										}}
									</Field>
								</div>

								<Field name='email'>
									{({ field, meta }) => {
										return (
											<div className='register__form__field'>
												<div
													className={classNames(
														'register__form__group register_form_group1',
														{
															'error': meta.touched && meta.error,
														}
													)}
												>
													<input
														className='register__form__input'
														type='Số điện thoại hoặc Email'
														placeholder='Số điện thoại hoặc Email'
														{...field}
														value={field.value}
														autoComplete='false'
													/>
													<div className='error--text'>
														{meta.touched && meta.error && (
															<div>
																<img
																	src={Subtract}
																	alt='img'
																	data-tip
																	data-for='registerTip'
																/>
																<ReactTooltip
																	id='registerTip'
																	place='bottom'
																	effect='solid'
																	backgroundColor='#E61B00'
																>
																	{meta.touched && meta.error && (
																		<div>{meta.error}</div>
																	)}
																</ReactTooltip>
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
										<div className='register__form__field'>
											<div
												className={classNames('register__form__group', {
													'error': meta.touched && meta.error,
												})}
											>
												<input
													className='register__form__input'
													type='password'
													placeholder='Mật khẩu'
													{...field}
													value={field.value}
													autoComplete='new-password'
												/>
												<div className='error--text'>
													{meta.touched && meta.error && (
														<div>
															<img
																src={Subtract}
																alt='img'
																data-tip
																data-for='registerTip'
															/>
															<ReactTooltip
																id='registerTip'
																place='bottom'
																effect='solid'
																backgroundColor='#E61B00'
															>
																{meta.touched && meta.error && <div>{meta.error}</div>}
															</ReactTooltip>
														</div>
													)}
												</div>
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

export default RegisterComponent;
