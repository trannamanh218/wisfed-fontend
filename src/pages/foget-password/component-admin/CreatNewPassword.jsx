import { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';
import { resetPasswordAdmin } from 'reducers/redux-utils/auth';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import ModalLogin from 'pages/login/element/ModalLogin';
import { resetPasswordValidateAdmin } from 'helpers/Validation';
import Circle from 'shared/loading/circle';

function CreatNewPasswordAdminForm() {
	const isFetching = useSelector(state => state.auth.isFetching);
	const dispatch = useDispatch();
	const [isShow, setIsShow] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const newEmail = JSON.parse(localStorage.getItem('emailForgot'));
	const [isShowBtn, setIsShowBtn] = useState(false);
	const [valuePassword2, setValuePassword2] = useState('');
	const [valuePassword, setValuePassword] = useState('');

	const checkData = useSelector(state => state.auth.infoForgot.data);

	const handleSubmit = async data => {
		try {
			const newData = {
				email: newEmail,
				OTP: checkData.otp,
				...data,
			};
			await dispatch(resetPasswordAdmin(newData)).unwrap();

			setIsShow(true);
			setDataModal({
				title: 'Tạo mật khẩu',
				title2: 'mới thành công',
				isShowIcon: true,
				scribe: 'Vui lòng đăng nhập lại với mật khẩu mới',
				scribe2: '',
				pathname: '/login',
			});
		} catch (err) {
			setIsShow(true);
			setDataModal({
				title: 'Tạo mật khẩu',
				title2: ' mới thất bại',
				isShowIcon: false,
				scribe: 'Vui lòng kiểm tra và thử lại',
				scribe2: '',
			});
		}
	};

	const handleChangeModal = () => {
		setIsShow(false);
	};

	useEffect(() => {
		if (valuePassword && valuePassword2) {
			setIsShowBtn(true);
		} else if (valuePassword === '' || valuePassword2 === '') {
			setIsShowBtn(false);
		}
	}, [valuePassword, valuePassword2]);

	return (
		<div className='forget__form__email'>
			<Circle loading={isFetching} />
			{isShow && (
				<div>
					<ModalLogin data={dataModal} handleChange={handleChangeModal} />
				</div>
			)}
			<Formik
				initialValues={{ newPassword: '', confirmPassword: '' }}
				onSubmit={handleSubmit}
				validationSchema={resetPasswordValidateAdmin}
			>
				<Form className='forgetPassword__form'>
					<div className='forget__name-title'>
						<span>Xác nhận mật khẩu mới</span>
					</div>

					<Field name='newPassword'>
						{({ field, meta }) => {
							setValuePassword(field.value);
							return (
								<div className='forgetPassword__form__field'>
									<div
										className={classNames('forgetPassword__form__group', {
											'error': meta.touched && meta.error,
										})}
									>
										<input
											className='forgetPassword__form__input-password input-1'
											type='password'
											placeholder='Mật khẩu mới'
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
					<Field name='confirmPassword'>
						{({ field, meta }) => {
							setValuePassword2(field.value);
							return (
								<div className='forgetPassword__form__field'>
									<div
										className={classNames('forgetPassword__form__group', {
											'error': meta.touched && meta.error,
										})}
									>
										<input
											className='forgetPassword__form__input-password'
											type='password'
											placeholder='Xác nhận lại mật khẩu mới'
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
						type='submit'
						className={
							isShowBtn
								? 'forgetPassword__form__btn-otp'
								: 'forgetPassword__form__btn-otp disabled-bnt-forgot'
						}
					>
						Lấy lại mật khẩu
					</button>
				</Form>
			</Formik>
		</div>
	);
}

export default CreatNewPasswordAdminForm;
