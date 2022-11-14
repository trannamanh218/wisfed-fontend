import { CloseX } from 'components/svg';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import './modalUnfriend.scss';
import Button from 'shared/button';

const ModalUnFriend = ({ showModalUnfriends, toggleModal, handleUnfriend, data, type, isFollower }) => {
	const renderName = () => {
		if (isFollower || type === 'following') {
			return data?.userOne?.fullName;
		} else {
			return (
				data?.userTwo?.fullName ||
				data?.userOne?.fullName ||
				data?.fullName ||
				data?.firstName + ' ' + data?.lastName
			);
		}
	};

	return (
		<Modal className='friends__unFriends__container' show={showModalUnfriends} onHide={toggleModal}>
			<Modal.Body>
				<div className='friends__unFriend__close'>
					<CloseX onClick={toggleModal} />
				</div>
				<div className='friends__unFriend__content'>Xác nhận hủy kết bạn</div>
				<div className='friends__unFriend__title'>
					Bạn có chắc chắn muốn xóa <span style={{ fontWeight: '700' }}>{renderName()}</span> khỏi danh sách
					bạn bè không?
				</div>
				<div className='friends__unFriend__main'>
					<Button
						onClick={handleUnfriend}
						className='friends__unFriend__button'
						isOutline={false}
						name='Accept'
					>
						<span className='myfriends__button__content'>Xác nhận</span>
					</Button>
					<div onClick={toggleModal} className='friends__unFriend__cancel'>
						Hủy
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

ModalUnFriend.propTypes = {
	setModalUnfriends: PropTypes.func,
	toggleModalUnFriends: PropTypes.bool,
	handleUnfriend: PropTypes.func,
	data: PropTypes.object,
	toggleModal: PropTypes.func,
	showModalUnfriends: PropTypes.bool,
	type: PropTypes.string,
	isFollower: PropTypes.bool,
};

export default ModalUnFriend;
