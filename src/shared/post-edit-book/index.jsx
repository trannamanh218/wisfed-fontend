import React from 'react';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import './post-edit-book.scss';
import LinearProgressBar from 'shared/linear-progress-bar';

const PostEditBook = props => {
	const { data } = props;
	// rating là rating của user cho cuốn sách, không phải rating tổng)
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
							<input contentEditable className='post-edit-book__input' value={0} />
							<span>/200</span>
							<span className='post-edit-book__message'>Nhập số trang sách đã đọc</span>
						</div>
					</div>
				</div>
				<div className='post-edit-book__button-and-rating'>
					<ReactRating initialRating={3.3} readonly={true} fractions={2} />
					<div className='post-edit-book__rating__number'>(4.2)(09 đánh giá)</div>
				</div>
			</div>
		</div>
	);
};

PostEditBook.propTypes = {
	data: PropTypes.object,
};

export default PostEditBook;
