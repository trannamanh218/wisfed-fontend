import { useFetchOtherCategories } from 'api/category.hook';
import { useFetchGroups } from 'api/group.hooks';
import { useFetchQuotes } from 'api/quote.hooks';
import { useFetchUsers } from 'api/user.hook';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AuthorSlider from 'shared/author-slider';
import GroupLinks from 'shared/group-links';
// import NewsLinks from 'shared/news-links';
import QuotesLinks from 'shared/quote-links';
import TopicColumn from 'shared/topic-column';
import PropTypes from 'prop-types';
import './sidebar-category-detail.scss';

const SidebarCategoryDetail = ({ viewCategoryDetail }) => {
	const { categoryInfo } = useSelector(state => state.category);
	const [currentPage, setCurrentPage] = useState(1);
	const [name, setName] = useState();

	useEffect(() => {
		let isMount = true;
		if (isMount && !_.isEmpty(categoryInfo)) {
			setName(categoryInfo.name);
			setCurrentPage(1);
		}

		return () => {
			isMount = false;
		};
	}, [categoryInfo]);

	const {
		otherCategories: { rows: categoriesList = [], count: totalCategory = 0 },
	} = useFetchOtherCategories(0, 30, name);

	const { quoteData } = useFetchQuotes(0, 3);

	const {
		groups: { rows: groupList = [] },
	} = useFetchGroups(0, 3, '[]');

	const {
		usersData: { rows: authorList = [] },
	} = useFetchUsers(0, 10, "[{ 'operator': 'search', 'value': 'author', 'property': 'role'}]");

	const viewMoreCategories = () => {
		if (currentPage < totalCategory) {
			setCurrentPage(prev => prev + 1);
		}
	};

	return (
		<>
			{!_.isEmpty(categoryInfo) && (
				<div className='sidebar-category-detail'>
					<TopicColumn
						className='sidebar-category__topics'
						title='Chủ đề khác'
						topics={categoriesList}
						handleViewMore={viewMoreCategories}
						viewCategoryDetail={viewCategoryDetail}
					/>
					<AuthorSlider title='Tác giả nổi bật' list={authorList} size='lg' />
					<div className='sidebar-category-detail__quotes'>
						<QuotesLinks list={quoteData} title='Quotes' className='sidebar-category-detail__quotes' />
						<GroupLinks list={groupList} title='Group' />
						{/* <NewsLinks list={quoteList} title='Tin tức liên quan' /> */}
					</div>
				</div>
			)}
		</>
	);
};

SidebarCategoryDetail.propTypes = {
	viewCategoryDetail: PropTypes.func,
};

export default SidebarCategoryDetail;
