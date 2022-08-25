import PropTypes from 'prop-types';
import { SuccessIcon, WrongIcon, CloseButtonIcon } from 'components/svg';
import './modalLogin.scss';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function ModalLogin({ data, handleClose }) {
	const location = useLocation();

	return (
		<div className='modal__container'>
			<div className='modal__closeButton'>
				{data.pathname && data.isShowIcon === true ? (
					<Link to={data.pathname}>
						<button>
							<CloseButtonIcon />
						</button>
					</Link>
				) : (
					<button onClick={() => handleClose()}>
						<CloseButtonIcon />
					</button>
				)}
			</div>
			<div className='modal__body'>
				<div className='modal__title'>
					<span>
						{data?.title} <br />
						{data?.title2}
					</span>
				</div>
				<div className='modal__icon'>{data?.isShowIcon ? <SuccessIcon /> : <WrongIcon />}</div>
				<div className='modal__subcribe'>
					<span>{data?.scribe}</span>
					<br />
					{location.pathname !== '/login' && data.isShowIcon === true && data.scribe2 !== '' ? (
						<span style={{ color: '#0576F0' }}>"{data?.scribe2}"</span>
					) : (
						<span>{data?.scribe2}</span>
					)}
				</div>
				<div className='modal__button-acept'>
					{data.pathname && data.isShowIcon === true ? (
						<Link to={data.pathname}>
							<button onClick={() => handleClose()}>Xác nhận</button>
						</Link>
					) : (
						<button onClick={() => handleClose()}>Xác nhận</button>
					)}
				</div>
			</div>
		</div>
	);
}

ModalLogin.propTypes = {
	data: PropTypes.object,
	handleClose: PropTypes.func,
};
