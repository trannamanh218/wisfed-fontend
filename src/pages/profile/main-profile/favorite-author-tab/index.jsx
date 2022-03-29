import React from 'react';
import AuthorCard from 'shared/author-card';
import PropTypes from 'prop-types';
import './favorite-author-tab.scss';

const FavoriteAuthorTab = () => {
	const list = [...Array(2)];
	return (
		<div className='favorite-author-tab'>
			<h4>Tác giả yêu thích</h4>
			<div className='favorite-author-tab__list'>
				{list && list.length > 0 ? (
					list.map((item, index) => <AuthorCard key={index} />)
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
