import React from 'react';
import AuthorSlider from 'shared/author-slider';
import GroupLinks from 'shared/group-links';
import NewsLinks from 'shared/news-links';
import QuotesLinks from 'shared/quote-links';
import TopicColumn from 'shared/topic-column';
import './sidebar-category-detail.scss';

const SidebarCategoryDetail = () => {
	const topicList = Array.from(Array(45)).map((_, index) => ({
		name: `Kinh doanh ${index}`,
	}));

	const quoteList = [...Array(5)].map((_, index) => ({
		author: 'Nguyen Hiến Lê',
		book: 'Đắc nhân tâm',
		content: 'Mỗi trang sách hay đều là một hành trình kỳ diệu',
		id: index,
	}));
	const groupList = [...Array(5)].map((_, index) => ({
		name: `Tâm sự kinh doanh ${index}`,
		id: index,
	}));

	const authorList = new Array(10).fill({ source: '/images/book1.jpg', name: 'Design pattern' });

	return (
		<div className='sidebar-category-detail'>
			<TopicColumn className='sidebar-category__topics' topics={topicList} title='Chủ đề khác' />
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
