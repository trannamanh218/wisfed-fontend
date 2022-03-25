import React from 'react';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { FaceBookIcon, GmailIcon } from 'components/svg';

const LoginBox = () => {
	return (
		<div className='login__login-box'>
			<div>
				<span className='login__login-box__title'>Đăng nhập và Khám phá</span>
			</div>
			<div className='login-facebook'>
				<FaceBookIcon className='login__fbIcon' /> <button>Đăng nhập bằng Facebook</button>
			</div>
			<div className='login-gmail'>
				<GmailIcon className='GmailIcon' /> <button>Đăng nhập bằng Gmail</button>
			</div>
			<hr />
			<div>
				<div>
					<span className='login__form-title'>Đăng nhập tài khoản Wisfeed</span>
				</div>
				<Formik initialValues={{ username: '', password: '' }}>
					<Form className='login__form'>
						<Field name='username'>
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
								<div className='login__form__field'>
									<div
										className={classNames('login__form__group', {
											'error': meta.touched && meta.error,
										})}
									>
										<input
											className='login__form__input'
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

						<button className='login__form__btn'>Đăng nhập</button>
					</Form>
				</Formik>
				<div className='login__form__link'>
					<Link to='/foget-password'>Quên mật khẩu ?</Link>
				</div>
				<div className='login__register'>
					<Link to='/register'>
						<button>Tạo tài khoản</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginBox;
