import { useEffect, useState } from 'react';
import BookSlider from 'shared/book-slider';
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
import { DEFAULT_TOGGLE_ROWS } from 'constants/index';
import { useDispatch } from 'react-redux';
import { getAllLibraryList } from 'reducers/redux-utils/library';
import { NotificationError } from 'helpers/Error';
import { useRef } from 'react';

const SidebarProfile = ({ currentUserInfo, handleViewBookDetail }) => {
	const { userId } = useParams();
	const { booksAuthor } = useFetchAuthorBooks(userId);
	const [bookReading, setBookReading] = useState({});
	const { booksReadYear } = useFetchTargetReading(userId);
	const [isExpand, setIsExpand] = useState(false);
	const [rows, setRows] = useState(DEFAULT_TOGGLE_ROWS);
	const [booksSliderTitle, setBooksSliderTitle] = useState('');

	const { userInfo } = useSelector(state => state.auth);
	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	const library = useRef([]);
	const dispatch = useDispatch();
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
	}, [userInfo, currentUserInfo]);

	const getAllLibraryListUser = async () => {
		try {
			let body = {
				userId: '',
			};
			if (userId) {
				body = {
					userId: userId,
				};
			} else {
				body = {
					userId: userInfo.id,
				};
			}
			const data = await dispatch(getAllLibraryList(body)).unwrap();
			library.current = data;

			const reading = library.current.default.filter(item => item.defaultType === 'reading');
			if (reading.length && reading[0].books.length) {
				const books = reading[0].books;
				setBookReading(books[0].book);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(async () => {
		if (userInfo.id === userId) {
			if (!_.isEmpty(myAllLibraryRedux)) {
				const readingLibrary = myAllLibraryRedux.default.filter(item => item.defaultType === 'reading');
				if (readingLibrary.length && readingLibrary[0].books.length) {
					const books = readingLibrary[0].books;
					setBookReading(books[0].book);
				}
			}
		} else {
			getAllLibraryListUser();
		}
	}, [myAllLibraryRedux, userId]);

	const handleViewMore = () => {
		const length = myAllLibraryRedux.custom.length;
		const lengthNew = library.current?.custom?.length;
		let maxLength;

		if (userInfo.id === userId) {
			if (length <= 20) {
				maxLength = length;
			} else {
				maxLength = 20;
			}
		} else {
			if (length <= 20) {
				maxLength = lengthNew;
			} else {
				maxLength = 20;
			}
		}

		const newRows = isExpand ? DEFAULT_TOGGLE_ROWS : maxLength;
		setRows(newRows);
		setIsExpand(!isExpand);
	};

	const handleRenderTargetReading = () => {
		if (userInfo.id === userId) {
			return <RenderProgress userIdParams={userId} />;
		} else {
			if (booksReadYear.length > 0) {
				return <ProgressBarCircle booksReadYear={booksReadYear} />;
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
						<BookSlider
							className='book-reference__slider'
							title={booksSliderTitle}
							list={booksAuthor}
							handleViewBookDetail={handleViewBookDetail}
						/>
					)}

					{handleRenderTargetReading()}

					{!_.isEmpty(myAllLibraryRedux.custom) && (
						<div className='sidebar-profile__personal__category'>
							<h4>Giá sách cá nhân</h4>
							<div className='dualColumn'>
								<ul className={classNames('dualColumn-list', { [`bg-light`]: false })}>
									{userInfo.id === userId
										? myAllLibraryRedux.custom.slice(0, rows).map((item, index) => (
												<li
													className={classNames('dualColumn-item', {
														'has-background': false,
													})}
													key={index}
												>
													<span className='dualColumn-item__title'>{item.name}</span>
													<span className='dualColumn-item__number'>
														{item.books.length} cuốn
													</span>
												</li>
										  ))
										: library.current?.custom?.slice(0, rows).map((item, index) => (
												<li
													className={classNames('dualColumn-item', {
														'has-background': false,
													})}
													key={index}
												>
													<span className='dualColumn-item__title'>{item?.name}</span>
													<span className='dualColumn-item__number'>
														{item?.books.length} cuốn
													</span>
												</li>
										  ))}
								</ul>

								{!isExpand &&
									(library.current?.custom?.length > 0 || myAllLibraryRedux.custom.length > 0) && (
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
	handleViewBookDetail: PropTypes.any,
};

export default SidebarProfile;
