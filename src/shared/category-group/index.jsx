import BookSlider from 'shared/book-slider';
import PropTypes from 'prop-types';
import './category-group.scss';

const CategoryGroup = ({ list, title, data, handleClick, handleViewBookDetail }) => {
	return (
		<div className='category-group'>
			{/* <BookSlider
				className='category-group__slider'
				title={title}
				list={list}
				size='lg'
				handleViewBookDetail={handleViewBookDetail}
			/> */}
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
	handleViewBookDetail: () => {},
};

CategoryGroup.propTypes = {
	list: PropTypes.array,
	title: PropTypes.string,
	data: PropTypes.object,
	handleClick: PropTypes.func,
	handleViewBookDetail: PropTypes.func,
};

export default CategoryGroup;
