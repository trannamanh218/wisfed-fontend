import { CloseIconX, CloseX } from 'components/svg';
import React, { useEffect, useState } from 'react';
import SearchField from 'shared/search-field';
import PropTypes from 'prop-types';
import './style.scss';
import { getFriendList } from 'reducers/redux-utils/user';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { getInviteFriend } from 'reducers/redux-utils/group';
import { useParams } from 'react-router-dom';

const PopupInviteFriend = ({ handleClose }) => {
	const [listFiend, setListFriend] = useState([]);
	const [listFriendSelect, setListFriendSelect] = useState([]);
	const dispatch = useDispatch();
	const { id = '' } = useParams();
	const { userInfo } = useSelector(state => state.auth);

	const getListFriend = async () => {
		const params = {
			userId: userInfo.id,
		};
		try {
			const actionGetList = await dispatch(getFriendList(params)).unwrap();
			setListFriend(actionGetList.rows);
		} catch (error) {
			NotificationError(error);
		}
	};

	const inViteFriend = async () => {
		const listId = listFriendSelect.map(item => `${item.id}`);
		const params = {
			id: id,
			userIds: listId,
		};
		try {
			await dispatch(getInviteFriend(params)).unwrap();
		} catch (err) {
			NotificationError(err);
		} finally {
			handleClose();
		}
	};

	useEffect(() => {
		getListFriend();
	}, [userInfo]);

	const handleSelectFriend = e => {
		const itemCheck = listFriendSelect.filter(item => item === e);
		if (listFriendSelect.length === 0) {
			setListFriendSelect([...listFriendSelect, e]);
		}
		if (itemCheck.length >= 1) {
			const newList = listFriendSelect.filter(item => item !== e);
			setListFriendSelect(newList);
		} else {
			setListFriendSelect([...listFriendSelect, e]);
		}
	};
	const handleRemoveFriend = e => {
		const itemCheck = listFriendSelect.filter(item => item === e);
		if (itemCheck.length >= 1) {
			const newList = listFriendSelect.filter(item => item !== e);
			setListFriendSelect(newList);
		}
	};

	return (
		<div className='popup-invite-friend-container'>
			<div className='title-popup'>
				<button onClick={handleClose}>
					<CloseIconX />
				</button>
				<h3>Mời bạn bè tham gia nhóm</h3>
			</div>
			<hr />
			<div className='search-friend'>
				<SearchField />
				<button onClick={() => inViteFriend()}>Xong</button>
			</div>

			<div className='main-action'>
				<div className='list-friend'>
					<h4>Danh sách bạn bè</h4>
					{listFiend?.map(item => {
						const data = item?.userTwo;

						return (
							<>
								<div className='friend-item' key={data?.id}>
									<img
										src={item?.userTwo?.avatarImage}
										alt=''
										onError={e =>
											e.target.setAttribute(
												'src',
												'https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
											)
										}
									/>
									<label htmlFor='1'>{item?.userTwo?.fullName}</label>
									<input
										type='checkbox'
										id={item?.userTwo.id}
										onClick={() => handleSelectFriend(item?.userTwo)}
										checked={listFriendSelect.filter(obj => item.userTwo.id === obj.id).length > 0}
									/>
								</div>
							</>
						);
					})}
				</div>
				<div className='list-friend-select'>
					<h4>Danh sách đã chọn</h4>
					{listFriendSelect.map(item => {
						return (
							<>
								<div className='friend-item'>
									<img
										src={item?.userTwo?.avatarImage}
										alt=''
										onError={e =>
											e.target.setAttribute(
												'src',
												'https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
											)
										}
									/>
									<span>{item?.fullName}</span>
									<button>
										<CloseX onClick={() => handleRemoveFriend(item)} />
									</button>
								</div>
							</>
						);
					})}
				</div>
			</div>
		</div>
	);
};

PopupInviteFriend.propTypes = {
	handleClose: PropTypes.func,
};

export default PopupInviteFriend;
