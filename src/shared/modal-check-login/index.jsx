import { Modal } from 'react-bootstrap';
import './modal-check-login.scss';
import Button from 'shared/button';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { CloseX, SuccessIcon } from 'components/svg';
import { useNavigate } from 'react-router-dom';

const ModalCheckLogin = ({ routerLogin, modalShow, setModalShow }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleClose = () => {
		dispatch(checkUserLogin(false));
		setModalShow(false);
	};

	const handleLinkLogin = () => {
		navigate('/login');
		dispatch(checkUserLogin(false));
	};

	return (
		<Modal
			className='modal__check__login__container'
			show={modalShow ? modalShow : routerLogin}
			onHide={handleClose}
			keyboard={false}
			centered
		>
			<Modal.Body className='modal__check__login'>
				<div>
					<div onClick={handleClose} className='modal__login__close'>
						<CloseX />
					</div>
					<div className='modal__login__title'>Yêu cầu đăng nhập</div>
					<div className='modal__login__icon'>
						<SuccessIcon />
					</div>
					<div className='modal__login__decription'>Đăng nhập để sử dụng tính năng này</div>
					<div className='modal__login__button'>
						<Button>
							<div onClick={handleLinkLogin}>Đăng nhập</div>
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};
ModalCheckLogin.propTypes = {
	routerLogin: PropTypes.bool,
	modalShow: PropTypes.bool,
	setModalShow: PropTypes.func,
};
export default ModalCheckLogin;
