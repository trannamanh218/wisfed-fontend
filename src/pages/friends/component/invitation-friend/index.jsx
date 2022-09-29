import { Link } from 'react-router-dom';
import FriendsItem from 'shared/friends';
import PropTypes from 'prop-types';
import { getListReqFriendsToMe } from 'reducers/redux-utils/user';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';

const InvitationFriend = ({ activeTabs }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [getMyListFriendReq, setGetMyListFriendReq] = useState([]);
	const dispatch = useDispatch();

	useEffect(async () => {
		const param = {
			userId: userInfo.id,
			start: 0,
			limit: 10,
		};
		try {
			if (!_.isEmpty(userInfo)) {
				const friendList = await dispatch(getListReqFriendsToMe(param)).unwrap();
				setGetMyListFriendReq(friendList.rows);
			}
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch]);

	const newData = Array.from(Array(5)).fill({
		createdAt: '2022-04-01T09:34:48.487Z',
		id: 34,
		isFriends: true,
		isFollow: true,
		isStar: true,
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
			{getMyListFriendReq.length > 0 ? (
				<>
					<div className='myfriends__container__content'>
						<div className='myfriends__title__addfriend'>Lời mời kết bạn</div>
						<Link to={'/friends/invitation'} className='myfriends__title__all'>
							Xem tất cả
						</Link>
					</div>
					<div className='myfriends__layout__container'>
						{getMyListFriendReq.map(item => (
							<FriendsItem
								key={item.id}
								data={item}
								keyTabs={activeTabs}
								getMyListFriendReq={getMyListFriendReq}
							/>
						))}
					</div>
				</>
			) : (
				<p style={{ textAlign: 'center' }}>Chưa có lời mời kết bạn</p>
			)}

			{/* <div className='myfriends__container__content'>
				<div className='myfriends__title__addfriend'>Lời mời Từ người nổi tiếng</div>
				<Link to={'/friends/invitation/star'} className='myfriends__title__all'>
					Xem tất cả
				</Link>
			</div>
			<div className='myfriends__layout__container'>
				{newData.map(item => (
					<FriendsItem key={item.id} data={item} />
				))}
			</div> */}
		</div>
	);
};
InvitationFriend.propTypes = {
	activeTabs: PropTypes.string,
};
export default InvitationFriend;
