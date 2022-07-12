import { CloseX } from 'components/svg';
import PropTypes from 'prop-types';
import React from 'react';
import { Modal } from 'react-bootstrap';
import './modalUnfriend.scss';
import Button from 'shared/button';

const ModalUnFriend = ({ setModalUnfriends, toggleModalUnFriends, handleUnfriend, list, getListFollower }) => {
	const toggleModal = () => {
		setModalUnfriends(!toggleModalUnFriends);
	};
	const renderName = () => {
		if (getListFollower) {
			return list.userOne.fullName ? (
				list.userOne.fullName
			) : (
				<>
					<span>{list.userOne.firstName}</span>&nbsp;
					<span>{list.userOne.lastName}</span>
				</>
			);
		} else {
			return list.userTwo?.fullName ? (
				list.userTwo?.fullName
			) : (
				<>
					<span>{list.userTwo?.firstName}</span>&nbsp;
					<span>{list.userTwo?.lastName}</span>
				</>
			);
		}
	};
	return (
		<Modal className='friends__unFriends__container' show={true} onHide={toggleModal}>
			<Modal.Body>
				<div className='friends__unFriend__close'>
					<CloseX onClick={toggleModal} />
				</div>
				<div className='friends__unFriend__content'>Xác nhận hủy kết bạn</div>
				<div className='friends__unFriend__title'>
					Bạn có chắc chắn muốn xóa {renderName()} khỏi danh sách bạn bè không?
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
	list: PropTypes.object,
	getListFollower: PropTypes.array,
};
export default ModalUnFriend;
