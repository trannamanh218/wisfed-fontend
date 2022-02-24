import { useFetchOtherCategories } from 'api/category.hook';
import { useFetchGroups } from 'api/group.hooks';
import { useFetchQuotes } from 'api/quote.hooks';
import { useFetchUsers } from 'api/user.hook';
import { MAX_PER_PAGE } from 'constants';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AuthorSlider from 'shared/author-slider';
import GroupLinks from 'shared/group-links';
import NewsLinks from 'shared/news-links';
import QuotesLinks from 'shared/quote-links';
import TopicColumn from 'shared/topic-column';
import './sidebar-category-detail.scss';

const SidebarCategoryDetail = () => {
	const { categoryInfo } = useSelector(state => state.category);
	const [currentPage, setCurrentPage] = useState(1);
	const [name, setName] = useState();

	useEffect(() => {
		if (!_.isEmpty(categoryInfo)) {
			setName(categoryInfo.name);
		}
	}, [categoryInfo]);

	const {
		otherCategories: { rows: categoriesList = [], count: totalCategory = 0 },
	} = useFetchOtherCategories(currentPage, MAX_PER_PAGE, name);

	const {
		quoteData: { rows: quoteList = [] },
	} = useFetchQuotes(1, 5);

	const {
		groups: { rows: groupList = [] },
	} = useFetchGroups(1, 5, '[]');

	const {
		usersData: { rows: authorList = [] },
	} = useFetchUsers(1, 10, "[{ 'operator': 'search', 'value': 'author', 'property': 'role'}]");

	const viewMoreCategories = () => {
		if (currentPage < totalCategory) {
			setCurrentPage(prev => prev + 1);
		}
	};

	return (
		<div className='sidebar-category-detail'>
			<TopicColumn
				className='sidebar-category__topics'
				topics={categoriesList}
				handleViewMore={viewMoreCategories}
				title='Chủ đề khác'
			/>
			<AuthorSlider title='Tác giả nổi bật' list={authorList} size='lg' />
			<div className='sidebar-category-detail__quotes'>
				<QuotesLinks list={quoteList} title='Quotes' className='sidebar-category-detail__quotes' />
				<GroupLinks list={groupList} title='Group' />
				<NewsLinks list={quoteList} title='Tin tức liên quan' />
			</div>
		</div>
	);
};

SidebarCategoryDetail.propTypes = {};

export default SidebarCategoryDetail;
