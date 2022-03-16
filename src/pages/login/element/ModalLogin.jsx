import React from 'react';
import PropTypes from 'prop-types';
import { SuccessIcon, WrongIcon, CloseButtonIcon } from 'components/svg';
import './modalLogin.scss';

export default function ModalLogin({ data, handleChange }) {
	return (
		<div className='modal__container'>
			<div className='modal__closeButton' onClick={() => handleChange()}>
				<button>
					<CloseButtonIcon />
				</button>
			</div>
			<div className='modal__body'>
				<div className='modal__title'>
					<span>
						{data?.title} <br />
						{data?.title2}
					</span>
				</div>
				<div className='modal__icon'>{data.isShowIcon ? <SuccessIcon /> : <WrongIcon />}</div>
				<div className='modal__subcribe'>
					<span>
						{data.scribe} <br />
						{data.scribe2}
					</span>
				</div>
				<div className='modal__button-acept'>
					<button onClick={() => handleChange()}>Xác nhận</button>
				</div>
			</div>
		</div>
	);
}

ModalLogin.defaulProps = {
	data: {
		title: 'Đăng nhập',
		title2: 'thất bại',
		isShowIcon: false,
		scribe: 'Vui lòng kiểm tra lại tài khoản,',
		scribe2: 'mật khẩu và thử đăng nhập lại',
	},
};

ModalLogin.propTypes = {
	data: PropTypes.object,
	handleChange: PropTypes.func,
};
