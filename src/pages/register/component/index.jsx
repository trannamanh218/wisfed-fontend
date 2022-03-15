import React from 'react';
import '../register.scss';
import Logo from 'assets/images/Logo 2.png';
import ImgRegister from 'assets/images/anh-1 1.png';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';

function RegisterComponent() {
	return (
		<div className='register__container'>
			<div className='register__header'>
				<img src={Logo} alt='logo' />
			</div>
			<div className='register__body'>
				<div className='register__body-img'>
					<img src={ImgRegister} />
				</div>
				<div className='register__form'>
					<div className='register__box'>
						{' '}
						<Formik initialValues={{ fistname: '', lastname: '', username: '', password: '' }}>
							<Form className='register__form'>
								<div className='register__form-title'>
									<span>
										Tạo tài khoản <br /> nhanh chóng và dễ dàng
									</span>
								</div>
								<div className='register__name'>
									{' '}
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
													</div>
													{meta.touched && meta.error && (
														<small className='error-message'>{meta.error}</small>
													)}
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
													</div>
													{meta.touched && meta.error && (
														<small className='error-message'>{meta.error}</small>
													)}
												</div>
											);
										}}
									</Field>
								</div>

								<Field name='username'>
									{({ field, meta }) => {
										return (
											<div className='register__form__field'>
												<div
													className={classNames('register__form__group', {
														'error': meta.touched && meta.error,
													})}
												>
													<input
														className='register__form__input'
														type='Số điện thoại hoặc Email'
														placeholder='Số điện thoại hoặc Email'
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
											</div>
											{meta.touched && meta.error && (
												<small className='error-message'>{meta.error}</small>
											)}
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
