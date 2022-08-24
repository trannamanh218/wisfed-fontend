import Logo from 'assets/images/Logo 2.png';
import '../forget-password.scss';
import ImgForget from 'assets/images/quen-mk 1.png';
import CreateNewPasswordAdminForm from './CreateNewPassword';
import { Link, useNavigate } from 'react-router-dom';
import Storage from 'helpers/Storage';
import { useEffect } from 'react';

function AdminCreateNewPassword() {
	const navigate = useNavigate();

	useEffect(() => {
		if (Storage.getAccessToken()) {
			navigate('/');
		}
	}, []);

	return (
		<div className='forget__container'>
			<div className='login__header'>
				<Link to='/login'>
					<img src={Logo} alt='logo' />
				</Link>
			</div>
			<div className='forget__body'>
				<div className='forget__form__img'>
					<img src={ImgForget} alt='img' />
				</div>
				<CreateNewPasswordAdminForm />
			</div>
		</div>
	);
}

export default AdminCreateNewPassword;
