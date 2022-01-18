import ProgressBar from 'react-bootstrap/ProgressBar';
import sampleBookImg from 'assets/images/sample-book-img.jpg';

function ReadingBook() {
	return (
		<div className='sidebar__block'>
			<h4 className='sidebar__block__title'>Sách đang đọc</h4>
			<div className='sidebar__block__content'>
				<div className='reading-book__box'>
					<div className='reading-book__thumbnail'>
						<img data-testid='reading-book__book-img' src={sampleBookImg} alt='' />
					</div>
					<div className='reading-book__information'>
						<div>
							<div className='reading-book__information__book-name'>
								Positive Thoughts Break the 20 bad has abso
							</div>
							<div className='reading-book__information__author'>By J. Conner S. Geogor</div>
							<div className='reading-book__information__current-progress'>
								<ProgressBar now={30} />
								<div className='reading-book__progress-percent'>30%</div>
							</div>
						</div>
						<button className='reading-book__update-progress'>Cập nhật tiến độ</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ReadingBook;
