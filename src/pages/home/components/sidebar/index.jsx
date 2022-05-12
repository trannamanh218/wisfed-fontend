import './sidebar.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ReadingBook from 'shared/reading-book';
import TheBooksWantsToRead from './components/the-books-wants-to-read';
import ReadChallenge from 'shared/read-challenge';
import GroupShortcuts from './components/group-shortcuts';
import { useFetchQuoteRandom } from 'api/quote.hooks';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProgressBarCircle from 'shared/progress-circle';
import { useFetchTargetReading } from 'api/readingTarget.hooks';
import { useState, useEffect } from 'react';

const Sidebar = () => {
	const { quoteRandom } = useFetchQuoteRandom();
	const { userInfo } = useSelector(state => state.auth);

	const { booksReadYear } = useFetchTargetReading(userInfo?.id);

	const [bookReading, setBookReading] = useState({});
	const [wantToReadList, setWantToReadList] = useState([]);

	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	useEffect(() => {
		if (!_.isEmpty(myAllLibraryRedux) && myAllLibraryRedux.default.length > 0) {
			const readingLibrary = myAllLibraryRedux.default.filter(item => item.defaultType === 'reading');
			const readingBooks = readingLibrary[0].books;
			const wantToReadLibrary = myAllLibraryRedux.default.filter(item => item.defaultType === 'wantToRead');
			const newWantToReadList = [];
			wantToReadLibrary[0].books.forEach(item => newWantToReadList.push(item.book));
			setBookReading(readingBooks[readingBooks.length - 1].book);
			setWantToReadList(newWantToReadList);
		}
	}, [myAllLibraryRedux]);

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

			{!_.isEmpty(myAllLibraryRedux) && myAllLibraryRedux.default.length > 0 && (
				<div className='sidebar__block'>
					<h4 className='sidebar__block__title'>Giá sách</h4>
					<div className='dualColumn'>
						<ul className='dualColumn-list'>
							{myAllLibraryRedux.default.map(item => (
								<li className='dualColumn-item' key={item.id}>
									<span className='dualColumn-item__title'>{item.name}</span>
									<span className='dualColumn-item__number'>{item.books.length} cuốn</span>
								</li>
							))}
						</ul>
					</div>
					<Link
						style={{ marginTop: '4px' }}
						to={`/shelves/${userInfo.id}`}
						className='sidebar__view-more-btn--blue'
					>
						Xem thêm
					</Link>
				</div>
			)}

			<ReadingBook bookData={bookReading} />

			{wantToReadList.length > 0 && <TheBooksWantsToRead list={wantToReadList} />}

			{booksReadYear.length > 0 && !_.isEmpty(userInfo) ? <ProgressBarCircle /> : <ReadChallenge />}
		</div>
	);
};

export default Sidebar;
