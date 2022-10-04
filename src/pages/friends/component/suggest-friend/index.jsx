import { NotificationError } from 'helpers/Error';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTopUser } from 'reducers/redux-utils/ranks';
import { getRecommendFriend } from 'reducers/redux-utils/user';
import FriendsItem from 'shared/friends';

const SuggestFriend = ({ activeTabs }) => {
	const [list, setList] = useState([]);
	const [listRecommendFriend, setListRecommendFriend] = useState([]);

	const userInfo = useSelector(state => state.auth.userInfo);
	const { isAuth } = useSelector(state => state.auth);

	const LIMIT_RECOMMEND = 6;

	const result = userInfo?.favoriteCategory.map(item => item.categoryId);

	const dispatch = useDispatch();

	const getSuggestFriendByTopFollow = async () => {
		const params = {
			reportType: 'topFollow',
			by: 'month',
		};
		try {
			if (isAuth) {
				const data = await dispatch(getTopUser(params)).unwrap();
				return data;
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
				return data;
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getRecommendFriendData = async () => {
		const params = {
			start: 0,
			limit: LIMIT_RECOMMEND,
		};
		try {
			const data = await dispatch(getRecommendFriend(params)).unwrap();
			setListRecommendFriend(data);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
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
			setList(newListNotFriend.slice(0, 6));
		});
		getRecommendFriendData();
	}, []);

	return (
		<div className='myfriends__container'>
			<div className='myfriends__container__content'>
				<div className='myfriends__title__addfriend'>Bạn bè gợi ý từ BXH</div>
				<Link to={'/friends/suggestions'} className='myfriends__title__all'>
					Xem tất cả
				</Link>
			</div>
			<div className='myfriends__layout__container'>
				{list.length > 0 ? (
					list.map(item => (
						<FriendsItem key={item.id} data={item} keyTabs={activeTabs} getListSuggest={list} />
					))
				) : (
					<p style={{ textAlign: 'center' }}>Không có dữ liệu</p>
				)}
			</div>
			<div className='myfriends__line'></div>
			<div className='myfriends__container__content'>
				<div className='myfriends__title__addfriend'>Những người bạn có thể biết</div>
				<Link to={'/friends/recommend'} className='myfriends__title__all'>
					Xem tất cả
				</Link>
			</div>
			<div className='myfriends__layout__container'>
				{listRecommendFriend.map(item => (
					<FriendsItem
						key={item.id}
						data={item}
						keyTabs={activeTabs}
						getListRecommend={listRecommendFriend}
					/>
				))}
			</div>
		</div>
	);
};

export default SuggestFriend;
