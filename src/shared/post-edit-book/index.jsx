import { STATUS_BOOK } from 'constants/index';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import BookThumbnail from 'shared/book-thumbnail';
import LinearProgressBar from 'shared/linear-progress-bar';
import ReactRating from 'shared/react-rating';
import './post-edit-book.scss';
import { useDispatch } from 'react-redux';
import { getRatingBook } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';

const PostEditBook = ({ data, handleAddToPost, handleChangeStar, valueStar }) => {
	const [listRatingStar, setListRatingStar] = useState(null);
	const [showText, setShowText] = useState(true);
	const inputRef = useRef(null);
	const dispatch = useDispatch();

	const fetchData = async () => {
		try {
			const res = await dispatch(getRatingBook(data?.id)).unwrap();
			setListRatingStar(res.data);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		if (data.countRating === undefined) {
			fetchData();
		} else {
			setListRatingStar({ count: data.countRating, avg: data.avgRating });
		}
	}, []);

	// rating là rating của user cho cuốn sách, không phải rating tổng -- rating 1 lần duy nhất)

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.addEventListener('keyup', event => {
				if (event.keyCode === 13) {
					event.preventDefault();
				}
			});
		}
	}, [data]);

	const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

	const handleChange = e => {
		const { value } = e.target;
		if (value) {
			setShowText(false);
		} else {
			setShowText(true);
		}
		if (value > data.page) {
			handleAddToPost({ ...data, progress: data.page });
		} else {
			handleAddToPost({ ...data, progress: value });
		}
	};

	const generateAuthorName = authorsInfo => {
		if (authorsInfo && authorsInfo.length) {
			const authorNameArr = authorsInfo.map(item => item.authorName);
			return authorNameArr.join(' - ');
		} else {
			return 'Tác giả: Chưa xác định';
		}
	};

	return (
		<div className='post-edit-book'>
			<BookThumbnail {...data} />
			<div className='post-edit-book__informations'>
				<div className='post-edit-book__name-and-author'>
					<div data-testid='post-edit-book__name' className='post-edit-book__name' title={data.name}>
						{data.name}
					</div>
					<div className='post-edit-book__author'>{generateAuthorName(data.authors)}</div>
					<div className='post-edit-book__edit'>
						<LinearProgressBar percent={(data.progress / data.page) * 100} />
						<div className='post-edit-book__editor'>
							{data.status === STATUS_BOOK.wantToRead || data.status === STATUS_BOOK.read ? (
								<span>{data.progress || 0}</span>
							) : (
								<input
									ref={inputRef}
									className='post-edit-book__input'
									onKeyDown={blockInvalidChar}
									onChange={handleChange}
									value={data.progress}
									autoFocus
									name='progress'
									type='number'
									onWheel={e => e.target.blur()}
								/>
							)}
							<span>/{data.page}</span>
							{(data.status === STATUS_BOOK.reading || !data.status) && showText && (
								<span className='post-edit-book__message'>Nhập số trang sách đã đọc</span>
							)}
						</div>
					</div>
				</div>
				{(data.status === STATUS_BOOK.read || data.progress == data.page) && (
					<div className='post-edit-book__action'>
						<div className='post-edit-book__ratings'>
							<ReactRating
								initialRating={valueStar?.toFixed(1)}
								fractions={1}
								handleChange={handleChangeStar}
							/>
							<div className='post-edit-book__rating__number'>
								{!_.isEmpty(listRatingStar) &&
								listRatingStar.count > 0 &&
								listRatingStar.avg !== null ? (
									<div>{`(${listRatingStar.avg?.toFixed(1)}) (${
										listRatingStar.count
									} đánh giá)`}</div>
								) : (
									<div>(chưa có đánh giá)</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

PostEditBook.propTypes = {
	data: PropTypes.object,
	handleAddToPost: PropTypes.func,
	handleChangeStar: PropTypes.func,
	valueStar: PropTypes.number,
};

export default PostEditBook;
