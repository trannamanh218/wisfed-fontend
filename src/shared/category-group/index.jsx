import React from 'react';
import { Link } from 'react-router-dom';
import BookSlider from 'shared/book-slider';
import PropTypes from 'prop-types';
import './category-group.scss';

const CategoryGroup = ({ list, title }) => {
	return (
		<div className='category-group'>
			<BookSlider className='category-group__slider' title={title} list={list} size='lg' />
			<Link to='/' className='category-group__link'>
				Xem tất cả
			</Link>
		</div>
	);
};

CategoryGroup.propTypes = {
	list: PropTypes.array,
	title: PropTypes.string,
};

export default CategoryGroup;
