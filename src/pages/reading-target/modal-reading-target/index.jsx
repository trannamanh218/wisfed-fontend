import ReadChallenge from 'shared/read-challenge';
import { Modal, ModalBody } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './Modal-read-target.scss';
import { CloseX } from 'components/svg';
import { deleteTargetRead, renderTargetReadingProgress } from 'reducers/redux-utils/chart';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';

const ModalReadTarget = ({ toggleModal, modalOpen, setModalOpen, deleteModal }) => {
	const dispatch = useDispatch();
	const handleDeleteTarget = async () => {
		try {
			const dob = new Date();
			const year = dob.getFullYear();
			const params = {
				year: year,
			};
			dispatch(renderTargetReadingProgress(false));
			await dispatch(deleteTargetRead(params)).unwrap();
		} catch (err) {
			NotificationError(err);
		} finally {
			setModalOpen(false);
		}
	};
	return (
		<div className='Modal__Read__Target__main'>
			<Modal size='md' show={modalOpen} onHide={toggleModal} className='Modal__Read__Target'>
				{deleteModal ? (
					<ModalBody>
						<span className='btn-closeX' onClick={toggleModal}>
							<CloseX />
						</span>
						<ModalBody>
							<h4 className='main-shelves__modal__title'>Bạn có muốn xóa mục tiêu </h4>
							<p className='main-shelves__modal__subtitle'>Bạn sẽ không thể thấy mục tiêu của năm nay</p>
							<button
								className='btn main-shelves__modal__btn-delete btn-danger'
								onClick={handleDeleteTarget}
							>
								Xóa
							</button>
							<button className='btn-cancel' onClick={toggleModal}>
								Không
							</button>
						</ModalBody>
					</ModalBody>
				) : (
					<ModalBody>
						<ReadChallenge modalOpen={modalOpen} setModalOpen={setModalOpen} />
					</ModalBody>
				)}
			</Modal>
		</div>
	);
};
ModalReadTarget.propTypes = {
	toggleModal: PropTypes.func,
	modalOpen: PropTypes.bool,
	setModalOpen: PropTypes.func,
	deleteModal: PropTypes.bool,
};
export default ModalReadTarget;
