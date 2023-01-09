import BookSlider from 'shared/book-slider';
import PropTypes from 'prop-types';
import './category-group.scss';
import BookThumbnail from 'shared/book-thumbnail';

const CategoryGroup = ({
	data,
	list,
	title,
	handleViewBookDetail,
	handleViewCategoryDetail,
	inCategory = false,
	inCategoryDetail = false,
	inResult = false,
}) => {
	return (
		<>
			{list.length > 0 && (
				<div className='category-group'>
					<>
						{list.length < 4 ? (
							<>
								<h4>{title}</h4>
								<div className='category-group__none-slider'>
									{list.map(item => (
										<BookThumbnail
											key={item.id}
											{...item}
											data={item}
											source={item.source}
											name={item.name}
											size='lg'
											handleClick={handleViewBookDetail}
										/>
									))}
								</div>
							</>
						) : (
							<>
								<BookSlider
									className='category-group__slider'
									title={title}
									list={list}
									size='lg'
									handleViewBookDetail={handleViewBookDetail}
									inCategory={inCategory}
									inCategoryDetail={inCategoryDetail}
									inResult={inResult}
								/>
							</>
						)}
						<button
							className='category-group__link'
							onClick={() => {
								handleViewCategoryDetail(data);
							}}
						>
							Xem tất cả
						</button>
					</>
				</div>
			)}
		</>
	);
};

CategoryGroup.propTypes = {
	data: PropTypes.object,
	list: PropTypes.array,
	title: PropTypes.string,
	handleViewBookDetail: PropTypes.func,
	handleViewCategoryDetail: PropTypes.func,
	inCategory: PropTypes.bool,
	inCategoryDetail: PropTypes.bool,
	inResult: PropTypes.bool,
};

export default CategoryGroup;
