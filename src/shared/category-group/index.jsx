import BookSlider from 'shared/book-slider';
import PropTypes from 'prop-types';
import './category-group.scss';

const CategoryGroup = ({ data, list, title, handleViewBookDetail, viewCategoryDetail }) => {
	return (
		<div className='category-group'>
			{!!list.length && (
				<>
					<BookSlider
						className='category-group__slider'
						title={title}
						list={list}
						size='lg'
						handleViewBookDetail={handleViewBookDetail}
					/>
					<button className='category-group__link' onClick={() => viewCategoryDetail(data)}>
						Xem tất cả
					</button>
				</>
			)}
		</div>
	);
};

CategoryGroup.propTypes = {
	data: PropTypes.object,
	list: PropTypes.array,
	title: PropTypes.string,
	handleViewBookDetail: PropTypes.func,
	viewCategoryDetail: PropTypes.func,
};

export default CategoryGroup;
