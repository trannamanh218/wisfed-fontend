import React from 'react';
import Logo from 'assets/images/Logo 2.png';
import '../forget-password.scss';
import ImgForget from 'assets/images/quen-mk 1.png';
import CreatNewPasswordAdminForm from './CreatNewPassword';

function AdminCreateNewPassword() {
	return (
		<div className='forget__container'>
			<div className='login__header'>
				<img src={Logo} alt='logo' />
			</div>
			<div className='forget__body'>
				<div className='forget__form__img'>
					<img src={ImgForget} alt='' />
				</div>
				<CreatNewPasswordAdminForm />
			</div>
		</div>
	);
}

export default AdminCreateNewPassword;
