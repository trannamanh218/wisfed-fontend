import './post-book.scss';
import StatusButton from 'components/status-button';
import ReactRating from 'shared/react-rating';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import LinearProgressBar from 'shared/linear-progress-bar';
import { getRatingBook } from 'reducers/redux-utils/book';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function PostBook({ data }) {
	const [progress, setProgress] = useState();
	const [percenProgress, setPercenProgress] = useState();
	const [listRatingStar, setListRatingStar] = useState({});
	const dispatch = useDispatch();

	const fetchData = async () => {
		try {
			const res = await dispatch(getRatingBook(data.id)).unwrap();
			setListRatingStar(res.data);
		} catch (err) {
			toast.error('lỗi hệ thống');
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

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
						<ReactRating initialRating={listRatingStar.avg} readonly={true} fractions={2} />
						<div className='post-book__rating__number'>
							{listRatingStar?.avg !== 0 ? (
								<div>
									{' '}
									( {listRatingStar.avg} sao ) ( {listRatingStar.count} đánh giá )
								</div>
							) : (
								<div>(Chưa có đánh giá)</div>
							)}
						</div>
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
