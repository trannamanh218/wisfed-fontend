import sampleBookImg from 'assets/images/sample-book-img.jpg';
import Slider from 'react-slick';
import SlideSettings from './wants-to-read-slide-settings';
import PropTypes from 'prop-types';

function TheBooksWantsToRead(props) {
	const { list } = props;
	return (
		<div className='sidebar__block'>
			<h4 className='sidebar__block__title'>Sách muốn đọc</h4>
			<div className='sidebar__block__content'>
				<Slider {...SlideSettings}>
					{list.map((item, index) => (
						<div key={index} className='wants-to-read__thumbnail'>
							<img src={sampleBookImg} alt='' />
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
