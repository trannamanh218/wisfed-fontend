import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import './post-edit-book.scss';
import LinearProgressBar from 'shared/linear-progress-bar';

const PostEditBook = props => {
	const { data, handleEditBook } = props;
	const [validation, setValidation] = useState();
	// rating là rating của user cho cuốn sách, không phải rating tổng)
	const [libraryId, setLibraryId] = useState(null);
	const pageRef = useRef(0);
	const [page, setPage] = useState(0);

	const handleChange = e => {
		const { value } = e.target;
		const numberDigit = data.page.toString().split('').length;
		const stringPattern = `^[0-9]{1,${numberDigit}}$`;
		const patternRequire = new RegExp(stringPattern);
		if (value) {
			const numberOfPage = parseInt(value);
			if (patternRequire.test(value) && numberOfPage <= data.page) {
				setValidation('');
				pageRef.current = numberOfPage;
				setPage(numberOfPage);
			} else {
				if (numberOfPage > data.page) {
					setValidation(`Số trang không vượt quá ${data.page}`);
				} else {
					setValidation('Vui lòng nhập số');
				}

				setPage(0);
			}
		}
	};

	const onChangeLibrary = id => {
		setLibraryId(id);
	};

	const handleConfirm = status => {
		if (!validation) {
			const params = {
				bookId: data.id,
				id: libraryId,
				progress: page,
				status: status.value,
			};

			handleEditBook(params);
		}
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
						<LinearProgressBar />
						<div className='post-edit-book__editor'>
							<input className='post-edit-book__input' onChange={handleChange} />
							<span>/{data.page}</span>
							<span className='post-edit-book__message'>Nhập số trang sách đã đọc</span>
						</div>
						<small className='post-edit-book__message'>{validation}</small>
					</div>
				</div>
				<div className='post-edit-book__action'>
					{/* <StatusButton
						libraryId={libraryId}
						onChangeLibrary={onChangeLibrary}
						handleClick={handleConfirm}
						status = {data.status}
					/> */}
					<div className='post-edit-book__ratings'>
						<ReactRating initialRating={3.3} readonly={true} fractions={2} />
						<div className='post-edit-book__rating__number'>(4.2)(09 đánh giá)</div>
					</div>
				</div>
			</div>
		</div>
	);
};

PostEditBook.propTypes = {
	data: PropTypes.object,
};

export default PostEditBook;
