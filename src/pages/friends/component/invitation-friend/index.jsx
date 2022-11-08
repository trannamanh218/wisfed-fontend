import { Link } from 'react-router-dom';
import FriendsItem from 'shared/friends';
import PropTypes from 'prop-types';
import { getListReqFriendsToMe } from 'reducers/redux-utils/user';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';

const InvitationFriend = ({ activeTabs }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [getMyListFriendReq, setGetMyListFriendReq] = useState([]);
	const dispatch = useDispatch();

	useEffect(async () => {
		try {
			if (!_.isEmpty(userInfo)) {
				const friendList = await dispatch(getListReqFriendsToMe()).unwrap();
				setGetMyListFriendReq(friendList.rows);
			}
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch]);

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
