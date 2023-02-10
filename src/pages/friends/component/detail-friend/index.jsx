import { useState, useEffect, useCallback } from 'react';
import Button from 'shared/button';
import NormalContainer from 'components/layout/normal-container';
import SearchField from 'shared/search-field';
import { BackArrow } from 'components/svg';
import './detail-friend.scss';
import { useLocation } from 'react-router-dom';
import FriendsItem from 'shared/friends';
import {
	getListFollowing,
	getListFollowrs,
	getListReqFriendsToMe,
	getRecommendFriend,
} from 'reducers/redux-utils/user';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { generateQuery } from 'helpers/Common';
import { getTopUser } from 'reducers/redux-utils/ranks';

const DetailFriend = () => {
	const location = useLocation();
	const { userInfo } = useSelector(state => state.auth);
	const [listFollowings, setListFollowings] = useState([]);
	const suggestions = location.pathname === '/friends/suggestions';
	const recommend = location.pathname === '/friends/recommend';
	const invitation = location.pathname === '/friends/invitation';
	const following = location.pathname === '/friends/following';
	const follower = location.pathname === '/friends/follower';
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [inputSearch, setInputSearch] = useState('');
	const [filter, setFilter] = useState('[]');
	const [listFriendSuggest, setListFriendSuggest] = useState([]);
	const [listRecommendFriend, setListRecommendFriend] = useState([]);

	const { isAuth } = useSelector(state => state.auth);
	const result = userInfo?.favoriteCategory?.map(item => item.categoryId);

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

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 0), []);

	const handleSearch = e => {
		setInputSearch(e.target.value);
	};

	const onClickSearchBtn = () => {
		debounceSearch(inputSearch);
	};

	const onBtnEnterPress = e => {
		if (e.key === 'Enter') {
			debounceSearch(inputSearch);
		}
	};

	const getSuggestFriendByTopFollow = async () => {
		const params = {
			reportType: 'topFollow',
			by: 'month',
		};
		try {
			if (isAuth) {
				const data = await dispatch(getTopUser(params)).unwrap();
				return data.rows;
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getSuggestFriendByCategory = async () => {
		const params = {
			reportType: 'topRead',
			by: 'month',
			categoryId: result[0],
		};
		try {
			if (isAuth) {
				const data = await dispatch(getTopUser(params)).unwrap();
				return data.rows;
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getRecommendFriendData = async () => {
		const params = {
			start: 0,
		};
		try {
			const data = await dispatch(getRecommendFriend(params)).unwrap();
			setListFollowings(data);
			setListRecommendFriend(data);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(async () => {
		const query = generateQuery(0, 10, filter);
		const userId = userInfo.id;
		try {
			if (!_.isEmpty(userInfo)) {
				if (following) {
					if (inputSearch.length > 0) {
						const following = await dispatch(getListFollowing({ userId, ...query })).unwrap();
						setListFollowings(following);
					} else {
						const following = await dispatch(getListFollowing({ userId })).unwrap();
						setListFollowings(following);
					}
				} else if (follower) {
					if (inputSearch.length > 0) {
						const follower = await dispatch(getListFollowrs({ userId, ...query })).unwrap();
						setListFollowings(follower);
					} else {
						const follower = await dispatch(getListFollowrs({ userId })).unwrap();
						setListFollowings(follower);
					}
				} else if (invitation) {
					if (inputSearch.length > 0) {
						const friendReq = await dispatch(getListReqFriendsToMe({ ...query })).unwrap();
						setListFollowings(friendReq);
					} else {
						const friendReq = await dispatch(getListReqFriendsToMe()).unwrap();
						setListFollowings(friendReq);
					}
				} else if (suggestions) {
					if (inputSearch.length > 0) {
						setListFollowings(
							listFriendSuggest.filter(item => {
								const fullName = item.firstName + ' ' + item.lastName;
								return fullName.toLowerCase().includes(inputSearch.toLowerCase());
							})
						);
					} else {
						Promise.all([getSuggestFriendByTopFollow(), getSuggestFriendByCategory()]).then(data => {
							const listUser = data.reduce((acc, item) => acc.concat(item));
							const listuserNew = listUser.filter(item => item.id !== userInfo.id);
							const newList = listuserNew.reduce((acc, curr) => {
								const userId = acc.find(item => item.id === curr.id);
								if (!userId) {
									return acc.concat([curr]);
								} else {
									return acc;
								}
							}, []);
							const newListNotFriend = newList.filter(item => item.relation !== 'friend');
							setListFriendSuggest(newListNotFriend);
							setListFollowings(newListNotFriend);
						});
					}
				} else if (getRecommendFriendData) {
					if (inputSearch.length > 0) {
						setListFollowings(
							listRecommendFriend.filter(item => {
								const fullName = item.firstName + ' ' + item.lastName;
								return fullName.toLowerCase().includes(inputSearch.toLowerCase());
							})
						);
					} else {
						getRecommendFriendData();
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
			return 'Tất cả gợi ý từ BXH';
		} else if (recommend) {
			return 'Tất cả những người bạn có thể biết';
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
			return 'Bạn bè gợi ý từ BXH';
		} else if (recommend) {
			return 'gợi ý kết bạn';
		} else if (invitation) {
			return 'Lời mời kết bạn';
		} else if (following) {
			return ` ${renderNameUser()} đang theo dõi `;
		} else if (follower) {
			return `đang theo dõi ${renderNameUser()}`;
		}
	};

	const renderCount = () => {
		if (suggestions || recommend) {
			return listFollowings.length ? listFollowings.length : 0;
		} else if (following || follower || invitation || recommend) {
			return listFollowings.count ? listFollowings.count : 0;
		}
	};

	const renderListMap = () => {
		if (suggestions || recommend) {
			return (
				listFollowings.length > 0 &&
				listFollowings.map(item => <FriendsItem key={item.id} data={item} listFriendReq={listFollowings} />)
			);
		} else if (following || follower || invitation) {
			return (
				listFollowings.count > 0 &&
				listFollowings.rows.map(item => (
					<FriendsItem key={item.id} data={item} listFriendReq={listFollowings.rows} />
				))
			);
		}
	};

	return (
		<NormalContainer>
			<div className='friends__container'>
				<div className='notification__main__container'>
					<div className='notification__main__back' onClick={handleBack}>
						<BackArrow />
					</div>
					<div className='notification__main__title'>{renderTitleHeader()}</div>
				</div>
				<div className='friends__detail__header'>
					<div className='friends__search'>
						<SearchField
							handleClickSearch={onClickSearchBtn}
							placeholder='Tìm kiếm bạn bè'
							handleChange={handleSearch}
							value={inputSearch}
							onKeyDown={onBtnEnterPress}
						/>
						<Button onClick={onClickSearchBtn} className='connect-button' isOutline={false} name='friend'>
							<span>Tìm kiếm</span>
						</Button>
					</div>
				</div>
				<div className='myfriends__container'>
					<div className='myfriends__container__content'>
						<div className='myfriends__title__addfriend'>
							{renderCount()} {renderTitleContainer()}
						</div>
					</div>
					<div className='myfriends__layout__container'>{renderListMap()}</div>
				</div>
			</div>
		</NormalContainer>
	);
};

export default DetailFriend;
