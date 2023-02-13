import { Link } from 'react-router-dom';
import FriendsItem from 'shared/friends';
import PropTypes from 'prop-types';
import { getListReqFriendsToMe } from 'reducers/redux-utils/user';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import LoadingIndicator from 'shared/loading-indicator';

const InvitationFriend = ({ activeTabs }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [listFriendReq, setGetMyListFriendReq] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();

	const getListFriendReqData = async () => {
		try {
			if (!_.isEmpty(userInfo)) {
				const friendList = await dispatch(getListReqFriendsToMe()).unwrap();
				setGetMyListFriendReq(friendList.rows);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getListFriendReqData();
	}, [userInfo, dispatch]);

	return (
		<>
			{isLoading ? (
				<LoadingIndicator />
			) : (
				<div className='myfriends__container'>
					{listFriendReq.length > 0 ? (
						<>
							<div className='myfriends__container__content'>
								<div className='myfriends__title__addfriend'>Lời mời kết bạn</div>
								<Link to={'/friends/invitation'} className='myfriends__title__all'>
									Xem tất cả
								</Link>
							</div>
							<div className='myfriends__layout__container'>
								{listFriendReq.map(item => (
									<FriendsItem key={item.id} data={item} keyTabs={activeTabs} />
								))}
							</div>
						</>
					) : (
						<p style={{ textAlign: 'center' }}>Chưa có lời mời kết bạn</p>
					)}
				</div>
			)}
		</>
	);
};
InvitationFriend.propTypes = {
	activeTabs: PropTypes.string,
};
export default InvitationFriend;
