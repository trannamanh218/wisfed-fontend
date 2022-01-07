import React from 'react';
import './sidebar.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ReadingBook from './components/reading-book';
import TheBooksWantsToRead from './components/the-books-wants-to-read';
import ReadChallenge from './components/read-challenge';
import { BookIcon } from 'components/svg';

const Sidebar = () => {
	return (
		<div className='sidebar'>
			<div className='sidebar__block'>
				<h4 className='sidebar__block__title'>Lối tắt nhóm</h4>
				<div className='sidebar__block__content'>
					{[...Array(4)].map((item, index) => (
						<div key={index} className='group-short-cut__item'>
							<div className='group-short-cut__item__logo'>
								<BookIcon />
							</div>
							<div className='group-short-cut__item__name'>
								Hội những người thích truyện trinh thám Sherlock Homes
							</div>
						</div>
					))}
					<div className='group-short-cut__view-more'>
						<i className='fas fa-chevron-down'></i>
						<span className='sidebar__view-more-btn--black'>Xem thêm</span>
					</div>
				</div>
			</div>
			<div className='sidebar__block'>
				<h4 className='sidebar__block__title'>Quotes</h4>
				<div className='sidebar__block__content'>
					<div className='quotes__content'>
						<p>“Mỗi trang sách hay đều là một hành trình kỳ diệu”</p>
						<p className='quotes__content__author-name'>James</p>
					</div>
					<button className='sidebar__view-more-btn--blue'>Xem thêm</button>
				</div>
			</div>
			<div className='sidebar__block'>
				<h4 className='sidebar__block__title'>Danh mục cá nhân</h4>
				<div className='sidebar__block__content'>
					<div className='personal-category__box'>
						<div className='personal-category__item'>
							<div className='personal-category__item__title'>Sách đang đọc</div>
							<div className='personal-category__item__quantity'>02 cuốn</div>
						</div>
						<div className='personal-category__item'>
							<div className='personal-category__item__title'>Sách đã đọc</div>
							<div className='personal-category__item__quantity'>400 cuốn</div>
						</div>
						<div className='personal-category__item'>
							<div className='personal-category__item__title'>Sách muốn đọc</div>
							<div className='personal-category__item__quantity'>20 cuốn</div>
						</div>
					</div>
					<button className='sidebar__view-more-btn--blue'>Xem thêm</button>
				</div>
			</div>
			<ReadingBook />
			<TheBooksWantsToRead />
			<ReadChallenge />
		</div>
	);
};

export default Sidebar;
