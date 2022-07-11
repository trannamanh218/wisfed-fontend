import Slider from 'react-slick';
import SlideSettings from './wants-to-read-slide-settings';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

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
		<div className='sidebar__block'>
			<h4 className='sidebar__block__title'>Sách muốn đọc</h4>
			<div className='sidebar__block__content'>
				<Slider {...SlideSettings}>
					{list.map((item, index) => (
						<div
							key={index}
							className='wants-to-read__thumbnail'
							onMouseEnter={onMouseEnterImgBook}
							onClick={() => onClickImgBook(item)}
						>
							<img src={item.images[0]} alt='' />
						</div>
					))}
				</Slider>
			</div>
		</div>
	);
}

export default TheBooksWantsToRead;

TheBooksWantsToRead.propTypes = {
	list: PropTypes.array,
};
