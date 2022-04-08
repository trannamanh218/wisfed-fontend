import './my-friends.scss';
import FriendsItem from 'shared/friends';
import { getFriendList } from 'reducers/redux-utils/user';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
const MyFriends = () => {
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
				const newArrFriend = friendList.rows.map(item => {
					return { ...item, checkFolow: false, checkUnfollow: false, checkUnfriend: true };
				});
				setGetMyListFriend(newArrFriend);
			}
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch]);

	const list = Array.from(Array(10)).fill({
		createdAt: '2022-04-01T09:34:48.487Z',
		id: 34,
		isFriends: true,
		isFollow: true,
		updatedAt: '2022-04-01T09:34:48.487Z',
		userIdOne: 'ed6b3eaf-5008-4b48-9c37-37cceea4f9a3',
		userIdTwo: 'ba755e87-f714-4542-a768-363bd0976215',
		userOne: {
			avatarImage: 'http://192.168.3.10:31989/api/v1/files/streaming/images/file-1648785882792.png',
			email: 'register@gmail.com',
			firstName: 'Văn',
			fullName: 'Văn User',
			id: 'ed6b3eaf-5008-4b48-9c37-37cceea4f9a3',
			lastName: 'User',
		},
		userTwo: {
			avatarImage: null,
			email: 'hungngonzai@gmail.com',
			firstName: 'Hùng',
			fullName: 'Hùng Điếc',
			id: 'ba755e87-f714-4542-a768-363bd0976215',
			lastName: 'Điếc',
		},
	});

	return (
		<div className='myfriends__container'>
			<div className='myfriends__title'>
				({getMyListFriend.length}) Bạn bè của
				{userInfo.fullName ? (
					userInfo.fullName
				) : (
					<>
						{userInfo.firstName}
						<span>{userInfo.lastName}</span>
					</>
				)}{' '}
			</div>
			<div className='myfriends__layout__container'>
				{list.map(item => (
					<FriendsItem key={item.id} list={item} />
				))}
			</div>
		</div>
	);
};

export default MyFriends;
