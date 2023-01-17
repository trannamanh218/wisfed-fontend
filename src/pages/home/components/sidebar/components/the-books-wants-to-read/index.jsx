import Slider from 'react-slick';
import SlideSettings from './wants-to-read-slide-settings';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import bookImage from 'assets/images/default-book.png';
import RouteLink from 'helpers/RouteLink';

function TheBooksWantsToRead(props) {
	const { list } = props;
	const navigate = useNavigate();

	const onMouseEnterImgBook = e => {
		e.target.style.cursor = 'pointer';
	};

	const handleNavigateToBookDetail = (e, item) => {
		e.preventDefault();
		navigate(RouteLink.bookDetail(item.id, item.name));
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
									onClick={() => handleNavigateToBookDetail(item)}
								>
									<img
										src={item?.frontBookCover || item?.images[0]}
										alt='image'
										onError={e => e.target.setAttribute('src', `${bookImage}`)}
									/>
								</div>
							))}
						</Slider>
					) : (
						<Row>
							{list.map((item, index) => (
								<Col lg={6} md={12} key={index}>
									<Link onClick={e => handleNavigateToBookDetail(e, item)} to='/'>
										<div className='wants-to-read__thumbnail'>
											<img
												src={item?.frontBookCover || item?.images[0]}
												onError={e => e.target.setAttribute('src', `${bookImage}`)}
												alt='image'
											/>
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
