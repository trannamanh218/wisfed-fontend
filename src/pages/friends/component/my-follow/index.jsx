import { useState, useEffect } from 'react';
import FriendsItem from 'shared/friends';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { getListFollowing, getListFollowrs } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import { Link } from 'react-router-dom';
import { changeToggleFollows } from 'reducers/redux-utils/friends';

const MyFollow = ({ activeTabs }) => {
	const { userInfo } = useSelector(state => state.auth);
	const changeFollow = useSelector(state => state.friends.toggle);
	const [getListFollower, setGetListFollower] = useState([]);
	const [getListFollowings, setGetListFollowings] = useState([]);
	const { isreload } = useSelector(state => state.user);
	const dispatch = useDispatch();

	useEffect(async () => {
		const param = {
			userId: userInfo.id,
			start: 0,
			limit: 10,
		};
		try {
			const following = await dispatch(getListFollowing(param)).unwrap();
			const follower = await dispatch(getListFollowrs(param)).unwrap();

			setGetListFollowings(following.rows);
			setGetListFollower(follower.rows);
			dispatch(changeToggleFollows(''));
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch, changeFollow, isreload]);

	return (
		<div className='myfriends__container'>
			<div className='myfriends__container__content'>
				<div className='myfriends__title__addfriend'>
					({getListFollower.length}) người theo dõi {userInfo.fullName}{' '}
				</div>
				<Link to={'/friends/follower'} className='myfriends__title__all'>
					Xem tất cả
				</Link>
			</div>
			<div className='myfriends__layout__container'>
				{getListFollower.map(item => (
					<FriendsItem
						key={item.id}
						data={item}
						keyTabs={activeTabs}
						getListFollower={getListFollower}
						type='following'
					/>
				))}
			</div>
			<div className='myfriends__line'></div>
			<div className='myfriends__container__content'>
				<div className='myfriends__title__addfriend'>
					({getListFollowings.length}) Người {userInfo.fullName} đang theo dõi
				</div>
				<Link to={'/friends/following'} className='myfriends__title__all'>
					Xem tất cả
				</Link>
			</div>
			<div className='myfriends__layout__container'>
				{getListFollowings.map(item => (
					<FriendsItem key={item.id} data={item} keyTabs={activeTabs} getListFollowings={getListFollowings} />
				))}
			</div>
		</div>
	);
};

MyFollow.propTypes = {
	activeTabs: PropTypes.string,
};

export default MyFollow;
