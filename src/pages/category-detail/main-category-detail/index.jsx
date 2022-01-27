import classNames from 'classnames';
import { Heart } from 'components/svg';
import React, { Fragment, useState } from 'react';
import BackButton from 'shared/back-button';
import BookThumbnail from 'shared/book-thumbnail';
import Button from 'shared/button';
import CategoryGroup from 'shared/category-group';
import FilterPane from 'shared/filter-pane';
import Post from 'shared/post';
import SearchField from 'shared/search-field';
import './main-category-detail.scss';

const MainCategoryDetail = () => {
	const [isLike, setIsLike] = useState(false);
	const list = Array.from(Array(5)).fill({
		id: 1,
		userAvatar: '/images/avatar.png',
		userName: 'Trần Văn Đức',
		bookImage: '',
		bookName: '',
		isLike: true,
		likeNumber: 15,
		commentNumber: 1,
		shareNumber: 3,
	});

	const bookList = new Array(16).fill({ source: '/images/book1.jpg', name: 'Design pattern' });

	const handleLikeCategory = () => {
		setIsLike(!isLike);
	};
	return (
		<div className='main-category-detail'>
			<div className='main-category-detail__header'>
				<BackButton />
				<h4>Chủ đề kinh doanh</h4>
				<Button
					className={classNames('btn-like', { 'active': isLike })}
					isOutline={true}
					onClick={handleLikeCategory}
				>
					<span className='heart-icon'>
						<Heart />
					</span>
					<span>{isLike ? 'Đã yêu thích' : 'Yêu thích'}</span>
				</Button>
			</div>

			<p className='main-category-detail__intro'>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam, consequatur! Excepturi, quasi,
				nesciunt iusto enim veniam totam quod veritatis aliquam in, non mollitia dolorem optio laudantium dolore
				odio perferendis a? Sequi et non minima incidunt placeat voluptatum iure, ullam, aut, odit fugit
				obcaecati quos nam ut vitae? Ab ratione iure, hic asperiores optio rerum dolorem vel quaerat tempore
				enim. Optio. Perferendis quidem aliquam odit quis magnam quia nostrum velit unde non nam? Consequatur,
				ullam neque similique minus enim voluptate ad hic tenetur sequi et fugiat! Consequuntur velit laborum
				que vero beatae provident odio!
			</p>

			<div className='main-category-detail__container'>
				<SearchField placeholder='Tìm kiếm sách trong chủ đề kinh doanh' />
				{[...Array(1)].map((_, index) => (
					<CategoryGroup key={`category-group-${index}`} list={bookList} title='Đọc nhiều nhất tuần này' />
				))}
				<div className='main-category-detail__allbook'>
					<h4>Tất cả sách chủ đề kinh doanh</h4>
					<div className='books'>
						{bookList.map((item, index) => (
							<BookThumbnail key={index} source={item.source} size='lg' />
						))}
					</div>
					<a className='view-all-link'>Xem tất cả</a>
				</div>
			</div>

			<FilterPane title='Bài viết hay nhất'>
				<div className='main-category-detail__posts'>
					{list && list.length
						? list.map((item, index) => (
								<Fragment key={`post-${index}`}>
									<Post className='post__container--category' postInformations={item} />
								</Fragment>
						  ))
						: null}
				</div>
			</FilterPane>
		</div>
	);
};

MainCategoryDetail.propTypes = {};

export default MainCategoryDetail;
