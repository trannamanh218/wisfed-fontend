import './direct-link-alert-modal.scss';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

function DirectLinkALertModal({ modalShow, handleAcept, handleCancel }) {
	return (
		<Modal className='direct-link-alert-modal' show={modalShow} onHide={handleCancel} keyboard={false} centered>
			<Modal.Body>
				<p>
					Bạn đang chuyển hướng tới một liên kết bên ngoài, chúng tôi sẽ không chịu trách nhiệm với liên kết
					bạn điều hướng tới. Bạn có muốn tiếp tục không?
				</p>
				<div className='direct-link-alert-modal__buttons'>
					<button className='direct-link-alert-modal__button acept' onClick={handleAcept}>
						Tiếp tục
					</button>
					<button className='direct-link-alert-modal__button cancel' onClick={handleCancel}>
						Hủy bỏ
					</button>
				</div>
			</Modal.Body>
		</Modal>
	);
}

DirectLinkALertModal.defaultProps = {
	modalShow: false,
};

DirectLinkALertModal.propTypes = {
	modalShow: PropTypes.bool,
	handleAcept: PropTypes.func,
	handleCancel: PropTypes.func,
};

export default DirectLinkALertModal;
