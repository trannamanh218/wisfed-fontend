import './post-book.scss';
import StatusButton from 'components/status-button';
import ReactRating from 'shared/react-rating';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import LinearProgressBar from 'shared/linear-progress-bar';
import { useEffect, useState } from 'react';

function PostBook({ data }) {
	// const progress = data.bookLibrary ? data.bookLibrary.progress || 0 : 0;
	const [progress, setProgress] = useState();
	const [percenProgress, setPercenProgress] = useState();
	useEffect(() => {
		if (data.status === 'wantToRead') {
			setProgress(data.page);
			setPercenProgress(100);
		} else {
			const newPropgress = ((data.progress / data.page) * 100).toFixed();
			setPercenProgress(newPropgress);
			setProgress(data.progress);
		}
	}, []);

	return (
		<div className='post-book'>
			<BookThumbnail source={data?.images[0]} />
			<div className='post-book__informations'>
				<div className='post-book__name-and-author'>
					<div className='post-book__name' title={data.name}>
						{data.name}
					</div>
					<div className='post-book__author'>{data.author || 'Tác giả: Chưa xác định'}</div>
					<div className='post-book__edit'>
						<LinearProgressBar percent={percenProgress} />
						<div className='post-book__editor'>
							<span className='post-book__ratio'>
								{data.status === 'wantToRead' ? progress : data.progress}/{data.page}
							</span>
							<span>Trang sách đã đọc</span>
						</div>
					</div>
				</div>
				<div className='post-book__button-and-rating'>
					<StatusButton status={data.status} bookData={data} />
					<div className='post-book__rating__group'>
						<ReactRating initialRating={3.3} readonly={true} fractions={2} />
						<div className='post-book__rating__number'>(4.2)(09 đánh giá)</div>
					</div>
				</div>
			</div>
		</div>
	);
}
PostBook.propTypes = {
	data: PropTypes.object.isRequired,
};

export default PostBook;
