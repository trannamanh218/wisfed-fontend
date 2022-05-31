import './style.scss';
import ProgressBar from 'react-bootstrap/ProgressBar';
import PropTypes from 'prop-types';
import { useEffect, useState, memo } from 'react';
import { updateCurrentBook } from 'reducers/redux-utils/book';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

function ReadingBook({ bookData }) {
	const dispatch = useDispatch();
	const [percent, setPercent] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!_.isEmpty(bookData)) {
			const percentData = Math.round((bookData.bookProgress[0].progress / bookData.page) * 100);
			setPercent(percentData);
		}
	}, [bookData, percent]);

	const handleOpenModal = () => {
		dispatch(updateCurrentBook({ ...bookData, status: 'reading' }));
		navigate('/');
	};

	return (
		!_.isEmpty(bookData) && (
			<div className='reading-book'>
				<h4 className='reading-book__title'>Sách đang đọc</h4>
				<div className='reading-book__content'>
					<div className='reading-book__box'>
						<div className='reading-book__thumbnail'>
							<img
								data-testid='reading-book__book-img'
								src={bookData?.images?.length > 0 ? bookData.images[0] : ''}
								alt=''
							/>
						</div>
						<div className='reading-book__information'>
							<div>
								<div className='reading-book__information__book-name'>{bookData.name}</div>
								<div className='reading-book__information__author'>{bookData?.author}</div>
							</div>
							<div className='reading-book__information__current-progress'>
								<ProgressBar now={percent} />
								<div className='reading-book__progress-percent'>{percent ? percent + '%' : '0%'}</div>
							</div>
							<button onClick={handleOpenModal} className='reading-book__update-progress'>
								Cập nhật tiến độ
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	);
}
ReadingBook.propTypes = {
	bookData: PropTypes.object,
};
export default memo(ReadingBook);
