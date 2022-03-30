import './sidebar.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ReadingBook from 'shared/reading-book';
import TheBooksWantsToRead from './components/the-books-wants-to-read';
import ReadChallenge from 'shared/read-challenge';
import GroupShortcuts from './components/group-shortcuts';
import { useFetchQuoteRandom } from 'api/quote.hooks';
import _ from 'lodash';
import { useFetchBookInDefaultLibrary, useFetchStatsReadingBooks } from 'api/library.hook';

const Sidebar = () => {
	const { quoteRandom } = useFetchQuoteRandom();
	const fiterBook = JSON.stringify([{ operator: 'eq', value: 'wantToRead', property: 'defaultType' }]);
	const { bookData } = useFetchBookInDefaultLibrary(1, 10, fiterBook);
	const { readingData } = useFetchStatsReadingBooks();

	console.log(readingData);
	return (
		<div className='sidebar'>
			<GroupShortcuts />
			<div className='sidebar__block'>
				<h4 className='sidebar__block__title'>Quotes</h4>
				{!_.isEmpty(quoteRandom) && (
					<div className='sidebar__block__content'>
						<div className='quotes__content'>
							<p>{`“ ${quoteRandom?.quote} ”`}</p>
							<p className='quotes__content__author-name'>{quoteRandom.authorName || ''}</p>
						</div>
						<button className='sidebar__view-more-btn--blue'>Xem thêm</button>
					</div>
				)}
			</div>
			<div className='sidebar__block'>
				<h4 className='sidebar__block__title'>Giá sách</h4>
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
			<TheBooksWantsToRead list={bookData} />
			<ReadChallenge />
		</div>
	);
};

export default Sidebar;
