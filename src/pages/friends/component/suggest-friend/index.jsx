import { NotificationError } from 'helpers/Error';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTopUser } from 'reducers/redux-utils/ranks';
import FriendsItem from 'shared/friends';

const SuggestFriend = () => {
	const [list, setList] = useState([]);
	const [listByCategory, setListByCategory] = useState([]);

	const userInfo = useSelector(state => state.auth.userInfo);
	const { isAuth } = useSelector(state => state.auth);

	const result = userInfo.favoriteCategory.map(item => item.categoryId);

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
				setListByCategory(data);
				return data;
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		Promise.all([getSuggestFriendByTopFollow(), getSuggestFriendByCategory()]).then(data => {
			const listUser = data.reduce((acc, item) => acc.concat(item));
			const newList = listUser.filter(item => item.id !== userInfo.id);
			setList(newList);
		});
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
				{list.map(item => (
					<FriendsItem key={item.id} data={item} />
				))}
			</div>
		</div>
	);
};

export default SuggestFriend;
