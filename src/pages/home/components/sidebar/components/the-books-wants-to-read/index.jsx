import Slider from 'react-slick';
import SlideSettings from './wants-to-read-slide-settings';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import bookImage from 'assets/images/default-book.png';
function TheBooksWantsToRead(props) {
	const { list } = props;
	const navigate = useNavigate();

	const onMouseEnterImgBook = e => {
		e.target.style.cursor = 'pointer';
	};

	const onClickImgBook = item => {
		navigate(`/book/detail/${item.id}`);
	};

	return (
		list.length > 0 && (
			<div className='sidebar__block'>
				<h4 className='sidebar__block__title'>Sách muốn đọc</h4>
				<div className='sidebar__block__content'>
					{list.length > 2 ? (
						<Slider {...SlideSettings}>
							{list.map((item, index) => (
								<div
									key={index}
									className='wants-to-read__thumbnail'
									onMouseEnter={onMouseEnterImgBook}
									onClick={() => onClickImgBook(item)}
								>
									<img src={item.images[0] || bookImage} alt='' />
								</div>
							))}
						</Slider>
					) : (
						<Row>
							{list.map((item, index) => (
								<Col md={6} sm={12} key={index}>
									<Link to={`/book/detail/${item.id}`}>
										<div className='wants-to-read__thumbnail'>
											<img src={item.images[0] || bookImage} alt='' />
										</div>
									</Link>
								</Col>
							))}
						</Row>
					)}
				</div>
			</div>
		)
	);
}

export default TheBooksWantsToRead;

TheBooksWantsToRead.propTypes = {
	list: PropTypes.array,
};
