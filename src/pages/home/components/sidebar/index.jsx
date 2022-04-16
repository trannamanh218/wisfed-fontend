import './sidebar.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ReadingBook from 'shared/reading-book';
import TheBooksWantsToRead from './components/the-books-wants-to-read';
import ReadChallenge from 'shared/read-challenge';
import GroupShortcuts from './components/group-shortcuts';
import { useFetchQuoteRandom } from 'api/quote.hooks';
import _ from 'lodash';
import { useFetchBookInDefaultLibrary, useFetchStatsReadingBooks } from 'api/library.hook';
import { Link } from 'react-router-dom';

const Sidebar = () => {
	const { quoteRandom } = useFetchQuoteRandom();
	const fiterBook = JSON.stringify([{ operator: 'eq', value: 'wantToRead', property: 'defaultType' }]);
	const { bookData } = useFetchBookInDefaultLibrary(1, 10, fiterBook);
	const { readingData, booksRead } = useFetchStatsReadingBooks();
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
						<Link to={`/quotes/all`} className='sidebar__view-more-btn--blue'>
							Xem thêm
						</Link>
					</div>
				)}
			</div>
			<div className='sidebar__block'>
				<h4 className='sidebar__block__title'>Giá sách</h4>
				<div className='sidebar__block__content'>
					<div className='personal-category__box'>
						{readingData.map(item => (
							<div key={item.value} className='personal-category__item'>
								<div className='personal-category__item__title'>{item.name}</div>
								<div className='personal-category__item__quantity'>{item.quantity} cuốn</div>
							</div>
						))}
					</div>
					<Link to='/shelves' className='sidebar__view-more-btn--blue'>
						Xem thêm
					</Link>
				</div>
			</div>
			<ReadingBook bookData={booksRead} />
			<TheBooksWantsToRead list={bookData} />
			<ReadChallenge />
		</div>
	);
};

export default Sidebar;
