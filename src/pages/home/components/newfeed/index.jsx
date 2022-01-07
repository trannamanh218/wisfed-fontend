import DropdownIconButton from 'components/dropdown-status-book';
import StatusBookModal from 'components/status-book-modal';
import React from 'react';
import './newfeed.scss';
import { BookIcon, Hashtag, Feather, CategoryIcon, Configure } from 'components/svg';
import avatar from 'assets/images/avatar.png';
import Post from './components/post';

const NewFeed = () => {
	return (
		<div className='newfeed'>
			<div className='newfeed__header'>
				<p>Bảng tin</p>
				<Configure />
			</div>
			<div className='newfeed__creat-post'>
				<div className='newfeed__creat-post__avatar-and-input'>
					<div className='newfeed__creat-post__avatar'>
						<img src={avatar} alt='' />
					</div>
					<input className='newfeed__creat-post__input' placeholder='Tạo bài viết của bạn ...' />
				</div>
				<div className='newfeed__creat-post__options'>
					<div className='newfeed__creat-post__options__item'>
						<div className='newfeed__creat-post__options__item__logo'>
							<BookIcon className='newfeed__creat-post__options__item__logo--book' />
						</div>
						<span>Sách</span>
					</div>
					<div className='newfeed__creat-post__options__item'>
						<div className='newfeed__creat-post__options__item__logo'>
							<Feather />
						</div>
						<span>Tác giả</span>
					</div>
					<div className='newfeed__creat-post__options__item'>
						<div className='newfeed__creat-post__options__item__logo'>
							<CategoryIcon className='newfeed__creat-post__options__item__logo--category' />
						</div>
						<span>Chủ đề</span>
					</div>
					<div className='newfeed__creat-post__options__item'>
						<div className='newfeed__creat-post__options__item__logo'>
							<Hashtag className='newfeed__creat-post__options__item__logo--hashtag' />
						</div>
						<span>Hashtag</span>
					</div>
				</div>
			</div>

			{[...Array(5)].map((item, index) => (
				<Post key={index} />
			))}

			<DropdownIconButton></DropdownIconButton>
			<br />
			<StatusBookModal />
		</div>
	);
};

export default NewFeed;
