import './sidebar.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ReadingBook from 'shared/reading-book';
import TheBooksWantsToRead from './components/the-books-wants-to-read';
import ReadChallenge from 'shared/read-challenge';
import GroupShortcuts from './components/group-shortcuts';

const Sidebar = () => {
	return (
		<div className='sidebar'>
			<GroupShortcuts />
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
