import './my-friends.scss';
import FriendsItem from 'shared/friends';
import { checkListFriend, getFriendList } from 'reducers/redux-utils/user';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { generateQuery } from 'helpers/Common';

const MyFriends = ({ activeTabs, inputSearch, filter }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [getMyListFriend, setGetMyListFriend] = useState([]);
	const dispatch = useDispatch();

	const isFriend = useSelector(state => state.user.isFriend);

	useEffect(async () => {
		const query = generateQuery(0, 10, filter);
		const userId = userInfo.id;
		try {
			if (!_.isEmpty(userInfo)) {
				if (inputSearch.length > 0) {
					const friendList = await dispatch(getFriendList({ userId, query })).unwrap();
					setGetMyListFriend(friendList.rows);
				} else {
					const friendList = await dispatch(getFriendList({ userId })).unwrap();
					setGetMyListFriend(friendList.rows);
				}
			}
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch, filter]);

	useEffect(() => {
		if (!getMyListFriend.length) {
			dispatch(checkListFriend(true));
		} else {
			dispatch(checkListFriend(false));
		}
	}, [getMyListFriend, isFriend]);

	return (
		<div className='myfriends__container'>
			<div className='myfriends__title'>
				({getMyListFriend?.length}) Bạn bè của{' '}
				{userInfo.fullName ? (
					userInfo.fullName
				) : (
					<>
						{userInfo.firstName}
						<span>{userInfo.lastName}</span>
					</>
				)}
			</div>

			<div className='myfriends__layout__container'>
				{getMyListFriend?.map(item => (
					<FriendsItem key={item.id} data={item} keyTabs={activeTabs} />
				))}
			</div>
		</div>
	);
};
MyFriends.propTypes = {
	activeTabs: PropTypes.string,
	inputSearch: PropTypes.string,
	filter: PropTypes.string,
};

export default MyFriends;
