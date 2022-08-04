import { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import ModalLogin from 'pages/login/element/ModalLogin';
import { forgotPasswordAdmin } from 'reducers/redux-utils/auth';
import { changeKey } from 'reducers/redux-utils/forget-password';
import { useSelector } from 'react-redux';
import Circle from 'shared/loading/circle';
import { emailAdminValidation } from 'helpers/Validation';
import { NotificationError } from 'helpers/Error';

function ForgetpasswordAdminFormComponent() {
	const isFetching = useSelector(state => state.auth.isFetching);
	const dispatch = useDispatch();
	const [isShow, setIsShow] = useState(false);
	const [dataModal, setDatamodal] = useState({});

	const handleChangeModal = () => {
		setIsShow(false);
		dispatch(changeKey(true));
	};

	const handleSubmit = async data => {
		localStorage.setItem('emailForgot', JSON.stringify(data.email));
		try {
			await dispatch(forgotPasswordAdmin(data)).unwrap();
			if (!isFetching) {
				setTimeout(() => {
					setIsShow(true);
				}, 500);
				setDatamodal({
					title: 'Đã gửi mã',
					title2: 'Xác Nhận',
					isShowIcon: true,
					scribe: 'Vui lòng kiểm tra hòm thư ',
					scribe2: `${data.email}`,
				});
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const RenderForm = () => {
		return (
			<div className='forget__form__email'>
				<Circle loading={isFetching} />
				{isShow && dataModal && (
					<div className='forgot__modal__container'>
						<ModalLogin data={dataModal} handleChange={handleChangeModal} />
					</div>
				)}
				<Formik initialValues={{ email: '' }} onSubmit={handleSubmit} validationSchemae={emailAdminValidation}>
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
						<button className='forgetPassword__form__btn'>Lấy lại mật khẩu</button>
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

export default ForgetpasswordAdminFormComponent;
