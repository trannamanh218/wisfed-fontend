import { useState, useEffect, useCallback } from 'react';
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
import { generateQuery } from 'helpers/Common';

const DetailFriend = () => {
	const location = useLocation();
	const { userInfo } = useSelector(state => state.auth);
	const [getListFollowings, setGetListFollowings] = useState([]);
	const suggestions = location.pathname === '/friends/suggestions';
	const invitation = location.pathname === '/friends/invitation';
	const following = location.pathname === '/friends/following';
	const follower = location.pathname === '/friends/follower';
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [inputSearch, setInputSearch] = useState('');
	const [filter, setFilter] = useState('[]');

	const updateInputSearch = value => {
		if (value) {
			const filterValue = [];
			filterValue.push({
				'operator': 'search',
				'value': value.toLowerCase().trim(),
				'property': 'firstName,lastName',
			});
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter('[]');
		}
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 1000), []);

	const handleSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	useEffect(async () => {
		const query = generateQuery(1, 10, filter);
		const userId = userInfo.id;
		try {
			if (!_.isEmpty(userInfo)) {
				if (following) {
					if (inputSearch.length > 0) {
						const following = await dispatch(getListFollowing({ userId, ...query })).unwrap();
						setGetListFollowings(following.rows);
					} else {
						const following = await dispatch(getListFollowing({ userId })).unwrap();
						setGetListFollowings(following.rows);
					}
				} else if (follower) {
					if (inputSearch.length > 0) {
						const follower = await dispatch(getListFollowrs({ userId, ...query })).unwrap();
						setGetListFollowings(follower.rows);
					} else {
						const follower = await dispatch(getListFollowrs({ userId })).unwrap();
						setGetListFollowings(follower.rows);
					}
				} else if (invitation) {
					if (inputSearch.length > 0) {
						const friendReq = await dispatch(getListReqFriendsToMe({ userId, ...query })).unwrap();
						setGetListFollowings(friendReq.rows);
					} else {
						const friendReq = await dispatch(getListReqFriendsToMe({ userId })).unwrap();
						setGetListFollowings(friendReq.rows);
					}
				}
			}
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, filter]);

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
			return ` ${renderNameUser()} đang theo dõi `;
		} else if (follower) {
			return `Người đang theo dõi ${renderNameUser()}`;
		}
	};

	const renderLength = () => {
		if (following || follower || invitation) {
			return getListFollowings.length ? getListFollowings.length : '';
		}
	};

	const renderListMap = () => {
		if (following || follower || invitation) {
			return getListFollowings.length > 0
				? getListFollowings.map(item => (
						<FriendsItem key={item.id} list={item} getMyListFriendReq={getListFollowings} />
				  ))
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
						<SearchField placeholder='Tìm kiếm bạn bè' handleChange={handleSearch} value={inputSearch} />
						<Button className='connect-button' isOutline={false} name='friend'>
							<span>Tìm kiếm</span>
						</Button>
					</div>
				</div>
				<div className='myfriends__container'>
					<div className='myfriends__container__content'>
						<div className='myfriends__title__addfriend'>
							{renderLength()} người {renderTitleContainer()}
						</div>
					</div>
					<div className='myfriends__layout__container'>{renderListMap()}</div>
				</div>
			</div>
		</NormalContainer>
	);
};

export default DetailFriend;
