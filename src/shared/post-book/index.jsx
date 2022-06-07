import './post-book.scss';
import StatusButton from 'components/status-button';
import ReactRating from 'shared/react-rating';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import LinearProgressBar from 'shared/linear-progress-bar';
import { getRatingBook } from 'reducers/redux-utils/book';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { NotificationError } from 'helpers/Error';

function PostBook({ data }) {
	const [percenProgress, setPercenProgress] = useState();
	const [listRatingStar, setListRatingStar] = useState({});
	const dispatch = useDispatch();

	const fetchData = async () => {
		try {
			const res = await dispatch(getRatingBook(data.id)).unwrap();
			setListRatingStar(res.data);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		fetchData();
	}, [data?.id]);

	useEffect(() => {
		if (data.status === 'wantToRead') {
			setPercenProgress(0);
		} else {
			const newPropgress = ((data.progress / data.page) * 100).toFixed();
			setPercenProgress(newPropgress);
		}
	}, []);
	return (
		<div className='post-book'>
			{data.images.length > 0 && <BookThumbnail source={data?.images[0]} />}
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
								{data.status === 'wantToRead' ? data.progress : data.progress}/{data.page}
							</span>
							<span>Trang sách đã đọc</span>
						</div>
					</div>
				</div>
				<div className='post-book__button-and-rating'>
					<StatusButton
						bookData={data}
						inPostBook={true}
						hasBookStatus={true}
						postActor={data.actorCreatedPost}
					/>
					<div className='post-book__rating__group'>
						<ReactRating initialRating={listRatingStar.avg} readonly={true} fractions={2} />
						<div className='post-book__rating__number'>
							{listRatingStar?.avg !== 0 ? (
								<div>
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
