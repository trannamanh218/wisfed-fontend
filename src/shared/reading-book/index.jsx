import './style.scss';
import ProgressBar from 'react-bootstrap/ProgressBar';
import PropTypes from 'prop-types';

function ReadingBook({ bookData, percent }) {
	bookData = { avatar: '/images/book1.jpg', name: 'Những phát minh của nhà khoa học Tesla ', author: 'Đỗ Gia' };
	percent = 50;
	return (
		<div className='reading-book'>
			<h4 className='reading-book__title'>Sách đang đọc</h4>
			<div className='reading-book__content'>
				<div className='reading-book__box'>
					<div className='reading-book__thumbnail'>
						<img data-testid='reading-book__book-img' src={bookData.avatar} alt='' />
					</div>
					<div className='reading-book__information'>
						<div>
							<div className='reading-book__information__book-name'>{bookData.name}</div>
							<div className='reading-book__information__author'>{bookData.author}</div>
						</div>
						<div className='reading-book__information__current-progress'>
							<ProgressBar now={percent} />
							<div className='reading-book__progress-percent'>{percent}%</div>
						</div>
						<button className='reading-book__update-progress'>Cập nhật tiến độ</button>
					</div>
				</div>
			</div>
		</div>
	);
}
ReadingBook.propTypes = {
	bookData: PropTypes.object,
	percent: PropTypes.number,
};
export default ReadingBook;
