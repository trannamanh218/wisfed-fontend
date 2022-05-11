import { useFetchStatsReadingBooks } from 'api/library.hook';
import React, { useEffect, useState } from 'react';
import BookSlider from 'shared/book-slider';
import DualColumn from 'shared/dual-column';
import ReadChallenge from 'shared/read-challenge';
import ReadingBook from 'shared/reading-book';
import './sidebar-profile.scss';
import classNames from 'classnames';
import caretIcon from 'assets/images/caret.png';
import { useFetchAuthLibraries } from 'api/library.hook';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useFetchAuthorBooks } from 'api/book.hooks';
import { useSelector } from 'react-redux';
import { useFetchTargetReading } from 'api/readingTarget.hooks';
import ProgressBarCircle from 'shared/progress-circle';
const DEFAULT_TOGGLE_ROWS = 1;

const SidebarProfile = () => {
	const { userId } = useParams();
	const userDetail = useSelector(state => state.user.userDetail);
	const { booksAuthor } = useFetchAuthorBooks(userDetail.firstName, userDetail.lastName);
	const { readingData, booksRead } = useFetchStatsReadingBooks();
	const { statusCustom } = useFetchAuthLibraries();
	const { booksReadYear } = useFetchTargetReading(userId);
	const libraryList = statusCustom?.map(item => ({ ...item, quantity: item.books.length }));
	const [isExpand, setIsExpand] = useState(false);
	const [rows, setRows] = useState(DEFAULT_TOGGLE_ROWS);
	const { userInfo } = useSelector(state => state.auth);

	useEffect(() => {}, []);
	const handleViewMore = () => {
		const length = statusCustom.length;
		const NUMBER_ROWS = statusCustom.length + 1;
		if (length <= NUMBER_ROWS) {
			const maxLength = length < NUMBER_ROWS ? length : NUMBER_ROWS;
			const newRows = isExpand ? DEFAULT_TOGGLE_ROWS : maxLength;
			setIsExpand(prev => !prev);
			return setRows(newRows);
		} else {
			if (rows < NUMBER_ROWS) {
				setRows(NUMBER_ROWS);
			} else {
				setRows(length);
				setIsExpand(true);
			}
		}

		if (isExpand) {
			setRows(DEFAULT_TOGGLE_ROWS);
			setIsExpand(false);
		}
	};

	const handleRenderTargetReading = () => {
		if (userInfo.id === userId) {
			if (booksReadYear.length > 0) {
				return <ProgressBarCircle />;
			}
			return <ReadChallenge />;
		} else {
			if (booksReadYear.length > 0) {
				return <ProgressBarCircle />;
			}
			return '';
		}
	};

	return (
		<div className='sidebar-profile'>
			<ReadingBook bookData={booksRead} />
			<BookSlider
				className='book-reference__slider'
				title={`Sách của ${userDetail.fullName}`}
				list={booksAuthor}
			/>
			{handleRenderTargetReading()}
			<div className='sidebar-profile__personal__category'>
				<h4>Giá sách cá nhân</h4>
				<DualColumn list={readingData} />
				<div className='dualColumn'>
					<ul className={classNames('dualColumn-list', { [`bg-light`]: false })}>
						{libraryList.slice(0, rows).map((item, index) => (
							<li className={classNames('dualColumn-item', { 'has-background': false })} key={index}>
								<span className='dualColumn-item__title'>{item.name}</span>
								<span className='dualColumn-item__number'>{item.quantity}</span>
							</li>
						))}
					</ul>
					{!isExpand && libraryList.length > DEFAULT_TOGGLE_ROWS && (
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
		</div>
	);
};

SidebarProfile.propTypes = {};

export default SidebarProfile;
