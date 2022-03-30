import { STATUS_BOOK } from 'constants';
import { progressReadingSchema } from 'helpers/Validation';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import BookThumbnail from 'shared/book-thumbnail';
import LinearProgressBar from 'shared/linear-progress-bar';
import ReactRating from 'shared/react-rating';
import './post-edit-book.scss';
import { NotificationError } from 'helpers/Error';
const PostEditBook = props => {
	const { data, handleValidationInput, validationInput, handleAddToPost } = props;
	// rating là rating của user cho cuốn sách, không phải rating tổng -- rating 1 lần duy nhất)
	const inputRef = useRef(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [data]);

	const handleChange = async e => {
		const { value, name } = e.target;
		let message = '';

		try {
			const res = await progressReadingSchema(data.status).validate({ [name]: value }, { abortEarly: false });
			const currentProgress = parseInt(res.progress);
			if (currentProgress > data.page) {
				message = `Số trang không vượt quá ${data.page}`;
			}
		} catch (err) {
			const { errors } = err;
			message = errors[0];
		}

		handleAddToPost({ ...data, progress: value });
		handleValidationInput(message);
	};

	const handleBlur = async e => {
		const { name, value } = e.target;
		try {
			await progressReadingSchema(data.status).validate({ [name]: value }, { abortEarly: false });
		} catch (err) {
			NotificationError(err);
			const { errors } = err;
			handleValidationInput(errors[0]);
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
									onBlur={handleBlur}
									// value={data.progress}
									autoFocus
									name='progress'
								/>
							)}

							<span>/{data.page}</span>
							<span className='post-edit-book__message'>Nhập số trang sách đã đọc</span>
						</div>
						<small className='post-edit-book__message'>{validationInput}</small>
					</div>
				</div>
				{data.status === STATUS_BOOK.read ? (
					<div className='post-edit-book__action'>
						<div className='post-edit-book__ratings'>
							<ReactRating initialRating={3.3} readonly={true} fractions={1} />
							<div className='post-edit-book__rating__number'>(4.2)(09 đánh giá)</div>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

PostEditBook.propTypes = {
	data: PropTypes.object,
	handleValidationInput: PropTypes.func,
	validationInput: PropTypes.string,
	handleAddToPost: PropTypes.func,
};

export default PostEditBook;
