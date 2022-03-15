import React from 'react';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import { changeKey } from 'reducers/redux-utils/forget-password';

function ForgetpasswordFormComponent() {
	const dispatch = useDispatch();

	const handleChange = () => {
		dispatch(changeKey(true));
	};

	const RenderForm = () => {
		return (
			<div className='forget__form__email'>
				<Formik initialValues={{ email: '' }}>
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
												placeholder='Số điện thoại hoặc Email đăng ký'
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
						<button
							onClick={() => {
								handleChange();
							}}
							className='forgetPassword__form__btn'
						>
							Lấy lại mật khẩu
						</button>
					</Form>
				</Formik>
			</div>
		);
	};

	return (
		<div>
			<RenderForm />
		</div>
	);
}

export default ForgetpasswordFormComponent;
