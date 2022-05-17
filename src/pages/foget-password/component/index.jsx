import React from 'react';
import Logo from 'assets/images/Logo 2.png';
import '../forget-password.scss';
import ImgForget from 'assets/images/quen-mk 1.png';
import ForgetpasswordFormComponent from './ForgetPasswordFormComponent';
import CreateNewPasswordForm from './CreateNewPasswordForm';
import { useSelector } from 'react-redux';
function ForgetPassWordComponet() {
	const key = useSelector(state => state.forgetPasswordSliceReducer.keyChange);

	return (
		<div className='forget__container'>
			<div className='login__header'>
				<img src={Logo} alt='logo' />
			</div>
			<div className='forget__body'>
				<div className='forget__form__img'>
					<img src={ImgForget} alt='' />
				</div>
				{key ? <CreateNewPasswordForm /> : <ForgetpasswordFormComponent />}
			</div>
		</div>
	);
}

export default ForgetPassWordComponet;
