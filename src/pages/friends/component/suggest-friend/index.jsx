import React from 'react';
import { Link } from 'react-router-dom';
import FriendsItem from 'shared/friends';

const SuggestFriend = () => {
	const list = Array.from(Array(5)).fill({
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
			<div className='myfriends__container__content'>
				<div className='myfriends__title__addfriend'>Bạn bè gợi ý từ danh bạ</div>
				<Link to={'/friends/suggestions'} className='myfriends__title__all'>
					Xem tất cả
				</Link>
			</div>
			<div className='myfriends__layout__container'>
				{list.map(item => (
					<FriendsItem key={item.id} data={item} />
				))}
			</div>
			<div className='myfriends__line'></div>
			<div className='myfriends__container__content'>
				<div className='myfriends__title__addfriend'>Những người bạn có thể biết</div>
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
