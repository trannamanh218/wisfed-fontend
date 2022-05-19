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
	const [listFriend, setListFriend] = useState([]);
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
		const listId = listFriendSelect?.map(item => item?.userIdTwo);

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
		setListFriendSelect([...listFriendSelect, e]);
		const checkItem = listFriend.filter(item => item !== e);
		setListFriend(checkItem);
	};
	const handleRemoveFriend = e => {
		setListFriend([...listFriend, e]);
		const checkItem = listFriendSelect.filter(item => item !== e);
		setListFriendSelect(checkItem);
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
					{listFriend?.map(item => {
						return (
							<>
								<div className='friend-item' key={item?.userTwo?.id}>
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
										onClick={() => handleSelectFriend(item)}
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
									<span>{item?.userTwo?.fullName}</span>
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
