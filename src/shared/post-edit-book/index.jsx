import { STATUS_BOOK } from 'constants';
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

const PostEditBook = props => {
	const { data, handleValidationInput, validationInput, handleAddToPost, handleChangeStar, valueStar } = props;
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
		let message = '';
		if (value > data.page) {
			handleAddToPost({ ...data, progress: data.page });
		} else if (value < 0) {
			message = 'Số trang không được bé hơn 0';
		} else {
			handleAddToPost({ ...data, progress: value });
		}
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
									onKeyDown={blockInvalidChar}
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
				{(data.status === STATUS_BOOK.read || data.progress == data.page) && (
					<div className='post-edit-book__action'>
						<div className='post-edit-book__ratings'>
							<ReactRating initialRating={valueStar} fractions={1} handleChange={handleChangeStar} />
							<div className='post-edit-book__rating__number'>
								{!_.isEmpty(listRatingStar) &&
								listRatingStar.count > 0 &&
								listRatingStar.avg !== null ? (
									<div>{`(${listRatingStar.avg}) (${listRatingStar.count} đánh giá)`}</div>
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
