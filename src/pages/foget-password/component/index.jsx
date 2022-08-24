import Logo from 'assets/images/Logo 2.png';
import '../forget-password.scss';
import ImgForget from 'assets/images/quen-mk 1.png';
import ForgetpasswordFormComponent from './ForgetPasswordFormComponent';
import CreateNewPasswordForm from './CreateNewPasswordForm';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Storage from 'helpers/Storage';
import PropTypes from 'prop-types';

function ForgetPassWordComponent({ type }) {
	const key = useSelector(state => state.forgetPasswordSliceReducer.keyChange);
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
					<img src={ImgForget} alt='' />
				</div>
				{key ? <CreateNewPasswordForm /> : <ForgetpasswordFormComponent type={type} />}
			</div>
		</div>
	);
}

ForgetPassWordComponent.defaultProps = {
	type: 'default',
};

ForgetPassWordComponent.propTypes = {
	type: PropTypes.string,
};

export default ForgetPassWordComponent;
