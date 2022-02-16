import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import FilterPane from 'shared/filter-pane';
import SearchField from 'shared/search-field';
import Post from 'shared/post';
import FitlerOptions from 'shared/filter-options';

const ReviewTab = ({ list }) => {
	const filterOptions = [
		{ id: 1, title: 'Tất cả', value: 'all' },
		{ id: 2, title: 'Bạn bè', value: 'friends' },
		{ id: 3, title: 'Người theo dõi', value: 'followers' },
	];

	const [defaultOption, setDefaultOption] = useState({ id: 1, title: 'Tất cả', value: 'all' });

	const handleChangeOption = (e, data) => {
		if (data.value !== defaultOption.value) {
			setDefaultOption(data);
		}
	};

	return (
		<FilterPane title='Bài review' subtitle='(4000 đánh giá)' key='Bài-review'>
			<FitlerOptions
				list={filterOptions}
				defaultOption={defaultOption}
				handleChangeOption={handleChangeOption}
				name='filter-user'
				className='review-tab__filter__options'
			/>
			<div className='review-tab__search'>
				<SearchField placeholder='Tìm kiếm theo Hastag, tên người review ...' />
			</div>
			<div className='review-tab__list'>
				{list && list.length
					? list.map((item, index) => (
							<Fragment key={`post-${index}`}>
								<Post className='post-container--review' postInformations={item} />
								<hr />
							</Fragment>
					  ))
					: null}
			</div>
		</FilterPane>
	);
};

ReviewTab.defaultProps = {
	list: [],
};

ReviewTab.propTypes = {
	list: PropTypes.array,
};

export default ReviewTab;
