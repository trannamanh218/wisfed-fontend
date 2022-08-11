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

const PopupInviteFriend = ({ handleClose, showRef, groupMembers }) => {
	const [listFriendsNotInGroup, setListFriendsNotInGroup] = useState([]);
	const [listFriendSelect, setListFriendSelect] = useState([]);
	const dispatch = useDispatch();
	const { id = '' } = useParams();
	const { userInfo } = useSelector(state => state.auth);
	const [inputSearch, setInputSearch] = useState('');

	const getListFriend = async () => {
		const params = {
			userId: userInfo.id,
		};
		try {
			const actionGetList = await dispatch(getFriendList(params)).unwrap();
			const friendList = actionGetList.rows;

			// Lọc ra danh sách bạn bè không có trong group (lấy code trên mạng chứ hiểu quái gì đâu)
			const newArr = friendList.filter(({ id: id1 }) => !groupMembers.some(({ id: id2 }) => id2 === id1));

			// Lọc danh sách bạn bè theo ô search
			setListFriendsNotInGroup(
				newArr.filter(
					x =>
						x.firstName.toLocaleLowerCase().includes(inputSearch.toLocaleLowerCase()) ||
						x.lastName.toLocaleLowerCase().includes(inputSearch.toLocaleLowerCase())
				)
			);
		} catch (error) {
			NotificationError(error);
		}
	};

	const inViteFriend = async () => {
		const listId = listFriendSelect?.map(item => item.id);
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
	}, [userInfo, inputSearch]);

	const handleSelectFriend = e => {
		setListFriendSelect([...listFriendSelect, e]);
		const checkItem = listFriendsNotInGroup.filter(item => item !== e);
		setListFriendsNotInGroup(checkItem);
	};
	const handleRemoveFriend = e => {
		setListFriendsNotInGroup([...listFriendsNotInGroup, e]);
		const checkItem = listFriendSelect.filter(item => item !== e);
		setListFriendSelect(checkItem);
	};

	return (
		<div className='popup-invite-friend-container' ref={showRef}>
			<div className='title-popup'>
				<button onClick={handleClose}>
					<CloseIconX />
				</button>
				<h3>Mời bạn bè tham gia nhóm</h3>
			</div>
			<hr />
			<div className='search-friend'>
				<SearchField value={inputSearch} handleChange={e => setInputSearch(e.target.value)} />
				<button onClick={() => inViteFriend()}>Xong</button>
			</div>

			<div className='main-action'>
				<div className='list-friend'>
					<h4>Danh sách bạn bè</h4>
					{listFriendsNotInGroup.map(item => {
						return (
							<div className='friend-item' key={item.id}>
								<img
									src={item.avatarImage}
									alt=''
									onError={e =>
										e.target.setAttribute(
											'src',
											'https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
										)
									}
								/>
								<label htmlFor='1'>{item.fullName}</label>
								<input type='checkbox' id={item.id} onClick={() => handleSelectFriend(item)} />
							</div>
						);
					})}
				</div>
				<div className='list-friend-select'>
					<h4>Danh sách đã chọn</h4>
					{listFriendSelect.map((item, index) => {
						return (
							<div className='friend-item' key={index}>
								<img
									src={item.avatarImage}
									alt=''
									onError={e =>
										e.target.setAttribute(
											'src',
											'https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
										)
									}
								/>
								<span>{item.fullName}</span>
								<button>
									<CloseX onClick={() => handleRemoveFriend(item)} />
								</button>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

PopupInviteFriend.propTypes = {
	handleClose: PropTypes.func,
	showRef: PropTypes.any,
	groupMembers: PropTypes.array,
};

export default PopupInviteFriend;
