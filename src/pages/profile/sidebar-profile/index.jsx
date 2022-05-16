import { useEffect, useState } from 'react';
import BookSlider from 'shared/book-slider';
import DualColumn from 'shared/dual-column';
import ReadingBook from 'shared/reading-book';
import './sidebar-profile.scss';
import classNames from 'classnames';
import caretIcon from 'assets/images/caret.png';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useFetchAuthorBooks } from 'api/book.hooks';
import { useSelector } from 'react-redux';
import { useFetchTargetReading } from 'api/readingTarget.hooks';
import ProgressBarCircle from 'shared/progress-circle';
import RenderProgress from 'shared/render-progress';
import PropTypes from 'prop-types';
import _ from 'lodash';

const DEFAULT_TOGGLE_ROWS = 0;

const SidebarProfile = ({ currentUserInfo }) => {
	const { userId } = useParams();
	const { booksAuthor } = useFetchAuthorBooks(userId);
	const [bookReading, setBookReading] = useState({});
	const { booksReadYear } = useFetchTargetReading(userId);
	const [isExpand, setIsExpand] = useState(false);
	const [rows, setRows] = useState(DEFAULT_TOGGLE_ROWS);
	const [booksSliderTitle, setBooksSliderTitle] = useState('');

	const { userInfo } = useSelector(state => state.auth);
	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	useEffect(() => {
		if (!_.isEmpty(userInfo)) {
			if (window.location.pathname.includes('profile')) {
				if (userInfo.id === userId) {
					setBooksSliderTitle('Sách tôi là tác giả');
				} else {
					setBooksSliderTitle(`Sách của ${currentUserInfo.fullName}`);
				}
			} else {
				setBooksSliderTitle('Sách tôi là tác giả');
			}
		}
	}, [userInfo]);

	useEffect(() => {
		if (!_.isEmpty(myAllLibraryRedux)) {
			const readingLibrary = myAllLibraryRedux.default.filter(item => item.defaultType === 'reading');
			const books = readingLibrary[0].books;
			setBookReading(books[books.length - 1].book);
		}
	}, [myAllLibraryRedux]);

	const handleViewMore = () => {
		const length = myAllLibraryRedux.custom.length;
		const maxRows = 7;
		if (length <= maxRows) {
			const numberRows = length;
			setRows(numberRows);
		} else {
			setRows(maxRows);
		}
		setIsExpand(true);
	};

	const handleRenderTargetReading = () => {
		if (userInfo.id === userId) {
			return <RenderProgress userId={userId} />;
		} else {
			if (booksReadYear.length > 0) {
				return <ProgressBarCircle />;
			}
			return '';
		}
	};

	return (
		<>
			{!_.isEmpty(userInfo) && (
				<div className='sidebar-profile'>
					<ReadingBook bookData={bookReading} />
					{booksAuthor.length > 0 && (
						<BookSlider className='book-reference__slider' title={booksSliderTitle} list={booksAuthor} />
					)}

					{handleRenderTargetReading()}

					{!_.isEmpty(myAllLibraryRedux) && (
						<div className='sidebar-profile__personal__category'>
							<h4>Giá sách cá nhân</h4>
							<DualColumn list={myAllLibraryRedux.default} />
							<div className='dualColumn'>
								<ul className={classNames('dualColumn-list', { [`bg-light`]: false })}>
									{myAllLibraryRedux.custom.length > 0 &&
										myAllLibraryRedux.custom.slice(0, rows).map((item, index) => (
											<li
												className={classNames('dualColumn-item', { 'has-background': false })}
												key={index}
											>
												<span className='dualColumn-item__title'>{item.name}</span>
												<span className='dualColumn-item__number'>
													{item.books.length} cuốn
												</span>
											</li>
										))}
								</ul>
								{!isExpand && myAllLibraryRedux.custom.length > 0 && (
									<button className='dualColumn-btn' onClick={handleViewMore}>
										<img className='view-caret' src={caretIcon} alt='caret-icon' />
										<span>Xem thêm</span>
									</button>
								)}
								{isExpand && (
									<Link to={`/shelves/${userId}`} className='sidebar__view-more-btn--blue'>
										Xem thêm
									</Link>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
};

SidebarProfile.propTypes = {
	currentUserInfo: PropTypes.object,
};

export default SidebarProfile;
