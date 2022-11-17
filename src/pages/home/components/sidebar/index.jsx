import './sidebar.scss';
import ReadingBook from 'shared/reading-book';
import TheBooksWantsToRead from './components/the-books-wants-to-read';
import GroupShortcuts from './components/group-shortcuts';
import { useFetchQuoteRandom } from 'api/quote.hooks';
import _ from 'lodash';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import RenderProgress from 'shared/render-progress';
import { handleSetDefaultLibrary } from 'reducers/redux-utils/library';

const Sidebar = () => {
	const { quoteRandom } = useFetchQuoteRandom();
	const { userInfo } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [bookReading, setBookReading] = useState({});
	const [wantToReadList, setWantToReadList] = useState([]);
	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	useEffect(() => {
		if (!_.isEmpty(myAllLibraryRedux) && myAllLibraryRedux.default.length > 0) {
			const readingLibrary = myAllLibraryRedux?.default?.filter(item => item.defaultType === 'reading');
			if (readingLibrary.length > 0 && readingLibrary[0]?.books.length) {
				const readingBooks = readingLibrary[0]?.books;
				setBookReading(readingBooks[0].book);
			}
			const wantToReadLibrary = myAllLibraryRedux?.default?.filter(item => item.defaultType === 'wantToRead');
			const newWantToReadList = [];
			wantToReadLibrary[0]?.books?.forEach(item => newWantToReadList.push(item.book));
			setWantToReadList(newWantToReadList);
		}
	}, [myAllLibraryRedux]);

	const handleDirectToBookShelves = paramItem => {
		dispatch(handleSetDefaultLibrary(paramItem));
		navigate(`/shelves/${userInfo.id}`);
	};

	return (
		<div className='sidebar'>
			{!_.isEmpty(userInfo) && !_.isEmpty(bookReading) && <ReadingBook bookData={bookReading} />}
			{!_.isEmpty(myAllLibraryRedux) && !_.isEmpty(userInfo) && myAllLibraryRedux.default.length > 0 && (
				<div className='sidebar__block'>
					<h4 className='sidebar__block__title'>Giá sách</h4>
					<div className='dualColumn'>
						<ul className='dualColumn-list'>
							{myAllLibraryRedux.default.map(item => (
								<li className='dualColumn-item' key={item.id}>
									<span
										onClick={() => handleDirectToBookShelves(item)}
										className='dualColumn-item__title link'
									>
										{item.name}
									</span>
									<span
										onClick={() => handleDirectToBookShelves(item)}
										className='dualColumn-item__number link'
									>
										{item.books.length} cuốn
									</span>
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

			{<RenderProgress userIdParams={userInfo?.id} />}

			{wantToReadList.length > 0 && !_.isEmpty(userInfo) && <TheBooksWantsToRead list={wantToReadList} />}

			<div className='sidebar__block'>
				<h4 className='sidebar__block__title'>Quotes</h4>
				{!_.isEmpty(quoteRandom) ? (
					<div className='sidebar__block__content'>
						<div className='quotes__content'>
							<p>{`“ ${quoteRandom?.quote} ”`}</p>
							<p className='quotes__content__author-name'>{quoteRandom.authorName || ''}</p>
						</div>
						<Link to={`/quotes/all`} className='sidebar__view-more-btn--blue'>
							Xem thêm
						</Link>
					</div>
				) : (
					<p>Không có dữ liệu</p>
				)}
			</div>
			<GroupShortcuts />
		</div>
	);
};

export default Sidebar;
