import React from 'react';
import BookSlider from 'shared/book-slider';
import PropTypes from 'prop-types';
import './category-group.scss';

const CategoryGroup = ({ list, title, data, handleClick }) => {
	return (
		<div className='category-group'>
			<BookSlider className='category-group__slider' title={title} list={list} size='lg' />
			<span onClick={() => handleClick(data)} className='category-group__link'>
				Xem tất cả
			</span>
		</div>
	);
};

CategoryGroup.defaultProps = {
	list: [],
	title: '',
	data: { id: '' },
	handleClick: () => {},
};

CategoryGroup.propTypes = {
	list: PropTypes.array,
	title: PropTypes.string,
	data: PropTypes.object,
	handleClick: PropTypes.func,
};

export default CategoryGroup;
