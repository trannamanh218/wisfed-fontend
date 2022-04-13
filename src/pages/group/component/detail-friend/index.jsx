import React, { useState, useEffect } from 'react';
import Button from 'shared/button';
import NormalContainer from 'components/layout/normal-container';
import SearchField from 'shared/search-field';
import { BackArrow } from 'components/svg';
import './detail-friend.scss';
import { useLocation } from 'react-router-dom';
import FriendsItem from 'shared/friends';
import { getListFollowing, getListFollowrs, getListReqFriendsToMe } from 'reducers/redux-utils/user';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
const DetailFriend = () => {
	const location = useLocation();
	const { userInfo } = useSelector(state => state.auth);
	const [getListFollowings, setGetListFollowings] = useState([]);
	const [getListFollower, setGetListFollower] = useState([]);
	const [getMyListFriendReq, setGetMyListFriendReq] = useState([]);
	const suggestions = location.pathname === '/friends/suggestions';
	const invitation = location.pathname === '/friends/invitation';
	const following = location.pathname === '/friends/following';
	const follower = location.pathname === '/friends/follower';
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(async () => {
		const param = {
			userId: userInfo.id,
		};
		try {
			if (!_.isEmpty(userInfo)) {
				if (following) {
					const following = await dispatch(getListFollowing(param)).unwrap();
					setGetListFollowings(following.rows);
				} else if (follower) {
					const follower = await dispatch(getListFollowrs(param)).unwrap();
					setGetListFollower(follower.rows);
				} else if (invitation) {
					const friendReq = await dispatch(getListReqFriendsToMe(param)).unwrap();
					setGetMyListFriendReq(friendReq.rows);
				}
			}
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch]);

	const handleBack = () => {
		navigate('/friends');
	};

	const renderTitleHeader = () => {
		if (suggestions) {
			return 'Tất cả gợi ý từ danh bạ';
		} else if (invitation) {
			return 'Tất cả lời mời kết bạn';
		} else if (following) {
			return `Tất cả nguời ${renderNameUser()} đang theo dõi`;
		} else if (follower) {
			return `Tất cả nguời đang theo dõi ${renderNameUser()} `;
		}
	};

	const renderNameUser = () => {
		return userInfo.fullName ? (
			userInfo.fullName
		) : (
			<>
				<span>{userInfo.firstName}</span>
				&nbsp;<span>{userInfo.lastName}</span>
			</>
		);
	};

	const renderTitleContainer = () => {
		if (suggestions) {
			return 'Bạn bè gợi ý từ danh bạ';
		} else if (invitation) {
			return 'Lời mời kết bạn';
		} else if (following) {
			return `${renderNameUser()} đang theo dõi`;
		} else if (follower) {
			return `Người đang theo dõi ${renderNameUser()}`;
		}
	};

	const renderLength = () => {
		if (following) {
			return getListFollowings.length ? getListFollowings.length : '';
		} else if (follower) {
			return getListFollower.length ? getListFollower.length : '';
		} else if (getMyListFriendReq) {
			return getMyListFriendReq.length ? getMyListFriendReq.length : '';
		}
	};

	const renderListMap = () => {
		if (following) {
			return getListFollowings.length > 0
				? getListFollowings.map(item => <FriendsItem key={item.id} list={item} />)
				: '';
		}
		if (follower) {
			return getListFollower.length > 0
				? getListFollower.map(item => <FriendsItem key={item.id} list={item} />)
				: '';
		} else if (invitation) {
			return getMyListFriendReq.length > 0
				? getMyListFriendReq.map(item => <FriendsItem key={item.id} list={item} />)
				: '';
		}
	};

	return (
		<NormalContainer>
			<div className='friends__container'>
				<div className='notificaiton__main__container'>
					<div className='notificaiton__main__back' onClick={handleBack}>
						<BackArrow />
					</div>
					<div className='notificaiton__main__title'>{renderTitleHeader()}</div>
				</div>
				<div className='friends__detail__header'>
					<div className='friends__search'>
						<SearchField placeholder='Tìm kiếm bạn bè' />
						<Button className='connect-button' isOutline={false} name='friend'>
							<span>Tìm kiếm</span>
						</Button>
					</div>
				</div>
				<div className='myfriends__container'>
					<div className='myfriends__container__content'>
						<div className='myfriends__title__addfriend'>
							{renderLength()} {renderTitleContainer()}
						</div>
					</div>
					<div className='myfriends__layout__container'>{renderListMap()}</div>
				</div>
			</div>
		</NormalContainer>
	);
};

export default DetailFriend;
