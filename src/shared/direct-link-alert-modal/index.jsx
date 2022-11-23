import './direct-link-alert-modal.scss';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

function DirectLinkALertModal({
	modalShow,
	handleAccept,
	handleCancel,
	className,
	message,
	yesBtnMsg,
	noBtnMsg,
	centered,
}) {
	return (
		<Modal className={className} show={modalShow} onHide={handleCancel} keyboard={false} centered={centered}>
			<Modal.Body>
				<p>{message}</p>
				<div className='direct-link-alert-modal__buttons'>
					<button className='direct-link-alert-modal__button acept' onClick={handleAccept}>
						{yesBtnMsg}
					</button>
					<button className='direct-link-alert-modal__button cancel' onClick={handleCancel}>
						{noBtnMsg}
					</button>
				</div>
			</Modal.Body>
		</Modal>
	);
}

DirectLinkALertModal.defaultProps = {
	modalShow: false,
	message:
		'Bạn đang chuyển hướng tới một liên kết bên ngoài, chúng tôi sẽ không chịu trách nhiệm với liên kết bạn điều hướng tới. Bạn có muốn tiếp tục không?',
	yesBtnMsg: 'Tiếp tục',
	noBtnMsg: 'Hủy bỏ',
	centered: true,
	className: 'direct-link-alert-modal',
};

DirectLinkALertModal.propTypes = {
	modalShow: PropTypes.bool,
	handleAccept: PropTypes.func,
	handleCancel: PropTypes.func,
	message: PropTypes.string,
	yesBtnMsg: PropTypes.string,
	noBtnMsg: PropTypes.string,
	centered: PropTypes.bool,
	className: PropTypes.string,
};

export default DirectLinkALertModal;
