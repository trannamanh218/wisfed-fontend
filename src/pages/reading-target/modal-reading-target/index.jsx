import ReadChallenge from 'shared/read-challenge';
import { Modal, ModalBody } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './Modal-read-target.scss';
import { CloseX } from 'components/svg';
import { deleteTargetRead, setMyTargetReading } from 'reducers/redux-utils/chart';
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
			dispatch(setMyTargetReading([]));
			await dispatch(deleteTargetRead(params)).unwrap();
		} catch (err) {
			NotificationError(err);
		} finally {
			setModalOpen(false);
		}
	};

	return (
		<Modal
			size='md'
			show={modalOpen}
			onHide={toggleModal}
			centered
			className={`main-shelves__modal ${!deleteModal && 'read-target'}`}
		>
			{deleteModal ? (
				<>
					<span className='btn-closeX' onClick={toggleModal}>
						<CloseX />
					</span>
					<ModalBody>
						<h4 className='main-shelves__modal__title'>Bạn có muốn xóa mục tiêu?</h4>
						<p className='main-shelves__modal__subtitle'>
							Bạn sẽ không thể thấy mục tiêu <p>của năm nay</p>
						</p>
						<button className='btn main-shelves__modal__btn-delete btn-danger' onClick={handleDeleteTarget}>
							Xóa
						</button>
						<button className='btn-cancel' onClick={toggleModal}>
							Không
						</button>
					</ModalBody>
				</>
			) : (
				<ModalBody>
					<ReadChallenge modalOpen={modalOpen} setModalOpen={setModalOpen} />
				</ModalBody>
			)}
		</Modal>
	);
};
ModalReadTarget.propTypes = {
	toggleModal: PropTypes.func,
	modalOpen: PropTypes.bool,
	setModalOpen: PropTypes.func,
	deleteModal: PropTypes.bool,
};
export default ModalReadTarget;
