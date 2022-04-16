import './my-friends.scss';
import FriendsItem from 'shared/friends';
import { getFriendList } from 'reducers/redux-utils/user';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';
import _ from 'lodash';

const MyFriends = ({ activeTabs }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [getMyListFriend, setGetMyListFriend] = useState([]);

	const dispatch = useDispatch();
	useEffect(async () => {
		const param = {
			userId: userInfo.id,
		};
		try {
			if (!_.isEmpty(userInfo)) {
				const friendList = await dispatch(getFriendList(param)).unwrap();
				setGetMyListFriend(friendList.rows);
			}
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch]);

	return (
		<div className='myfriends__container'>
			<div className='myfriends__title'>
				({getMyListFriend.length}) Bạn bè của{' '}
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
				{getMyListFriend.map(item => (
					<FriendsItem key={item.id} list={item} keyTabs={activeTabs} />
				))}
			</div>
		</div>
	);
};
MyFriends.propTypes = {
	activeTabs: PropTypes.string,
};

export default MyFriends;
