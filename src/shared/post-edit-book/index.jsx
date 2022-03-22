import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import './post-edit-book.scss';
import LinearProgressBar from 'shared/linear-progress-bar';
import { STATUS_BOOK } from 'constants';

const PostEditBook = props => {
	const { data, handleEditBook, handleValidationInput, validationInput } = props;
	// rating là rating của user cho cuốn sách, không phải rating tổng -- rating 1 lần duy nhất)
	const pageRef = useRef(0);
	const [page, setPage] = useState(0);
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();
	}, [data]);

	const handleChange = e => {
		const { value } = e.target;
		const numberDigit = data.page.toString().split('').length;
		const stringPattern = `^[0-9]{1,${numberDigit}}$`;
		const patternRequire = new RegExp(stringPattern);
		let message = '';
		if (value) {
			const numberOfPage = parseInt(value);
			if (patternRequire.test(value) && numberOfPage <= data.page) {
				pageRef.current = numberOfPage;
				setPage(numberOfPage);
			} else {
				if (numberOfPage && numberOfPage > data.page) {
					message = `Số trang không vượt quá ${data.page}`;
				} else if (!numberOfPage) {
					message = 'Vui lòng nhập số';
				}

				setPage(0);
			}
		}

		handleValidationInput(message);
	};

	return (
		<div className='post-edit-book'>
			<BookThumbnail source={data?.images[0]} />
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
								<span>{data.progress}</span>
							) : (
								<input
									ref={inputRef}
									className='post-edit-book__input'
									onChange={handleChange}
									value={data.progress}
									autoFocus
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
};

export default PostEditBook;
