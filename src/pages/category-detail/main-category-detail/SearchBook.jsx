import React from 'react';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import { NUMBER_OF_BOOKS } from 'constants';

const SearchBook = ({ list, handleViewBookDetail }) => {
	if (list.length) {
		return (
			<div className='main-category-detail__allbook'>
				<h4>Kết quả tìm kiếm</h4>
				<div className='books'>
					{list.slice(0, NUMBER_OF_BOOKS).map((item, index) => (
						<BookThumbnail
							key={index}
							{...item}
							source={item.source}
							size='lg'
							data={item}
							handleClick={handleViewBookDetail}
						/>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className='main-category-detail__allbook'>
			<h4>Không có kết quả nào</h4>
		</div>
	);
};

SearchBook.defaultProps = {
	list: [],
	handleViewBookDetail: () => {},
};

SearchBook.propTypes = {
	list: PropTypes.array,
	handleViewBookDetail: PropTypes.func,
};

export default SearchBook;
