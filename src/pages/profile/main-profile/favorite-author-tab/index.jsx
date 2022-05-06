import React from 'react';
import AuthorCard from 'shared/author-card';
import PropTypes from 'prop-types';
import './favorite-author-tab.scss';

const FavoriteAuthorTab = () => {
	const list = Array.from(Array(5)).fill({
		active: true,
		address: null,
		avatarImage: null,
		backgroundImage: null,
		birthday: null,
		createdAt: '2022-03-14T09:28:02.396Z',
		descriptions: null,
		email: 'register2@gmail.com',
		facebookId: null,
		firstName: 'Test',
		fullName: null,
		gender: null,
		googleId: null,
		highSchool: null,
		id: '77177554-2322-41d3-8bb3-1335aa906c25',
		interest: null,
		lastName: 'Gao',
		numberFollowing: 2,
		role: 'reader',
		socials: null,
		university: null,
		updatedAt: '2022-03-14T09:28:02.396Z',
		works: null,
	});

	return (
		<div className='favorite-author-tab'>
			<h4>Tác giả yêu thích</h4>
			<div className='favorite-author-tab__list'>
				{list && list.length > 0 ? (
					list.map((item, index) => <AuthorCard key={index} direction={'column'} size={'lg'} item={item} />)
				) : (
					<p>Không có dữ liệu</p>
				)}
			</div>
		</div>
	);
};

FavoriteAuthorTab.propTypes = {
	list: PropTypes.array.isRequired,
};

export default FavoriteAuthorTab;
