import { CloseIconX, CloseX } from 'components/svg';
import { useEffect, useState, useCallback } from 'react';
import SearchField from 'shared/search-field';
import PropTypes from 'prop-types';
import './style.scss';
import { getFriendList } from 'reducers/redux-utils/user';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { getInviteFriend } from 'reducers/redux-utils/group';
import { useParams } from 'react-router-dom';
import defaultAvatar from 'assets/images/avatar.jpeg';
import _ from 'lodash';

const PopupInviteFriend = ({ handleClose, showRef, groupMembers }) => {
	const [listFriendsNotInGroup, setListFriendsNotInGroup] = useState([]);
	const [listFriendSelect, setListFriendSelect] = useState([]);
	const dispatch = useDispatch();
	const { id = '' } = useParams();
	const { userInfo } = useSelector(state => state.auth);
	const [inputSearch, setInputSearch] = useState('');

	const getListFriend = async inputSearchValue => {
		const params = {
			userId: userInfo.id,
			query: {
				filter: JSON.stringify([
					{ operator: 'search', value: inputSearchValue, property: 'firstName,lastName' },
				]),
			},
		};
		try {
			const actionGetList = await dispatch(getFriendList(params)).unwrap();
			const friendList = actionGetList.rows;
			// Lọc ra danh sách bạn bè không có trong group
			const newArr = friendList.filter(item => !groupMembers.some(user => user.id === item.id));
			setListFriendsNotInGroup(newArr);
		} catch (error) {
			NotificationError(error);
		}
	};

	const inViteFriend = async () => {
		if (listFriendSelect.length) {
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
		}
	};

	useEffect(() => {
		getListFriend('');
	}, []);

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

	const debounceFnc = useCallback(
		_.debounce(value => {
			getListFriend(value);
		}, 700),
		[]
	);

	const handleSearch = e => {
		setInputSearch(e.target.value);
		debounceFnc(e.target.value);
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
			<div style={{ padding: '0 24px' }}>
				<div className='search-friend'>
					<SearchField value={inputSearch} handleChange={handleSearch} />
					<button onClick={() => inViteFriend()}>Gửi</button>
				</div>

				<div className='main-action'>
					<div className='list-friend'>
						<h4>Danh sách bạn bè</h4>
						{listFriendsNotInGroup.length > 0 ? (
							<>
								{listFriendsNotInGroup.map(item => {
									return (
										<div className='friend-item' key={item.id}>
											<div className='friend-item__avatar'>
												<img
													src={item.avatarImage || defaultAvatar}
													alt='image'
													onError={e => e.target.setAttribute('src', defaultAvatar)}
												/>
												<span>{item.fullName}</span>
											</div>
											<input
												type='checkbox'
												id={item.id}
												onClick={() => handleSelectFriend(item)}
											/>
										</div>
									);
								})}
							</>
						) : (
							<p style={{ fontSize: '14px' }}>Không tìm thấy bạn bè phù hợp</p>
						)}
					</div>
					<div className='list-friend-select'>
						<h4>Danh sách đã chọn ({listFriendSelect.length})</h4>
						{listFriendSelect.map((item, index) => {
							return (
								<div className='friend-item' key={index}>
									<div className='friend-item__avatar'>
										<img
											src={item.avatarImage || defaultAvatar}
											alt='image'
											onError={e => e.target.setAttribute('src', defaultAvatar)}
										/>
										<span>{item.fullName}</span>
									</div>
									<button>
										<CloseX onClick={() => handleRemoveFriend(item)} />
									</button>
								</div>
							);
						})}
					</div>
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
