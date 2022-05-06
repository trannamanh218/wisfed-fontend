import { STATUS_BOOK } from 'constants';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import BookThumbnail from 'shared/book-thumbnail';
import LinearProgressBar from 'shared/linear-progress-bar';
import ReactRating from 'shared/react-rating';
import './post-edit-book.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getRatingBook } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';

const PostEditBook = props => {
	const { data, handleValidationInput, validationInput, handleAddToPost, handleChangeStar, valueStar } = props;
	const [listRatingStar, setListRatingStar] = useState(null);
	const [showText, setShowText] = useState(true);

	const inputRef = useRef(null);
	const bookInfor = useSelector(state => state.book.bookInfo);
	const dispatch = useDispatch();
	const fetchData = async () => {
		if (data?.id) {
			try {
				const res = await dispatch(getRatingBook(data?.id)).unwrap();
				const data = res.data.rows;
				setListRatingStar(data);
			} catch (err) {
				NotificationError(err);
			}
		} else if (bookInfor?.id) {
			try {
				const res = await dispatch(getRatingBook(bookInfor?.id)).unwrap();
				const data = res.data.rows;
				setListRatingStar(data);
			} catch (err) {
				// toast.error('lỗi hệ thống');
			}
		}
	};
	useEffect(() => {
		fetchData();
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

	const handleChange = e => {
		const { value } = e.target;
		if (value) {
			setShowText(false);
		} else {
			setShowText(true);
		}
		let message = '';
		if (value > data.page) {
			message = `Số trang không vượt quá ${data.page}`;
		} else if (value < 0) {
			message = 'Số trang không được bé hơn 0';
		}
		handleAddToPost({ ...data, progress: value });
		handleValidationInput(message);
	};

	return (
		<div className='post-edit-book'>
			<BookThumbnail {...data} />
			<div className='post-edit-book__informations'>
				<div className='post-edit-book__name-and-author'>
					<div data-testid='post-edit-book__name' className='post-edit-book__name' title={data.name}>
						{data.name}
					</div>
					<div className='post-edit-book__author'>{data.author || 'Tác giả: Chưa xác định'}</div>
					<div className='post-edit-book__edit'>
						<LinearProgressBar percent={(data.progress / data.page) * 100} />
						<div className='post-edit-book__editor'>
							{data.status === STATUS_BOOK.wantToRead || data.status === STATUS_BOOK.read ? (
								<span>{data.progress || 0}</span>
							) : (
								<input
									ref={inputRef}
									className='post-edit-book__input'
									onChange={handleChange}
									value={data.progress}
									autoFocus
									name='progress'
									type='number'
								/>
							)}
							<span>/{data.page}</span>
							{(data.status === STATUS_BOOK.reading || data.status === undefined) && showText && (
								<span className='post-edit-book__message'>Nhập số trang sách đã đọc</span>
							)}
						</div>
						<small className='post-edit-book__message'>{validationInput}</small>
					</div>
				</div>
				{data.status === STATUS_BOOK.read && (
					<div className='post-edit-book__action'>
						<div className='post-edit-book__ratings'>
							<ReactRating
								initialRating={valueStar}
								ratingTotal={listRatingStar?.length}
								fractions={1}
								handleChange={handleChangeStar}
							/>
							<div className='post-edit-book__rating__number'>
								{listRatingStar?.avg !== 0 ? (
									<div>
										{listRatingStar?.avg ? `(${listRatingStar?.avg}) ` : ''} (
										{listRatingStar?.count || 'chưa có'} đánh giá)
									</div>
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
	handleValidationInput: PropTypes.func,
	validationInput: PropTypes.string,
	handleAddToPost: PropTypes.func,
	handleChangeStar: PropTypes.func,
	valueStar: PropTypes.number,
};

export default PostEditBook;
