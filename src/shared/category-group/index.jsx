import BookSlider from 'shared/book-slider';
import PropTypes from 'prop-types';
import './category-group.scss';
import BookThumbnail from 'shared/book-thumbnail';
import { Fragment } from 'react';

const CategoryGroup = ({ data, list, title, handleViewBookDetail, handleViewCategoryDetail, inCategoryDetail }) => {
	return (
		<>
			{!!list.length && (
				<div className='category-group'>
					<>
						{list.length < 4 ? (
							<>
								<h4>{title}</h4>
								<div className='category-group__none-slider'>
									{list.map(item => (
										<Fragment key={item.id}>
											<BookThumbnail
												{...item}
												data={item}
												source={item.source}
												name={item.name}
												size='lg'
												handleClick={handleViewBookDetail}
											/>
										</Fragment>
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
									inCategory={true}
									inCategoryDetail={inCategoryDetail}
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
};

export default CategoryGroup;
