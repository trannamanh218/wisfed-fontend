import './eventbar.scss';
import eventBarImageSample from 'assets/images/event-bar-image-sample.jpg';
import { Link } from 'react-router-dom';

const EventBar = () => {
	return (
		<div className='event-and-rank-bar'>
			<div className='event-and-rank-bar__block'>
				<h4 className='event-and-rank-bar__block__title'>Sự kiện</h4>
				<div className='event-and-rank-bar__content'>
					<div className='event-bar__name'>World Books Day</div>
					<img src={eventBarImageSample} alt='' />
					<button className='event-bar__join-event'>Tham gia sự kiện</button>
				</div>
			</div>
			<Link to={`/top100`} className='event-and-rank-bar__block'>
				<h4 className='event-and-rank-bar__block__title'>Bảng xếp hạng</h4>
				<div className='event-and-rank-bar__content'>
					<img src={eventBarImageSample} alt='' />
				</div>
			</Link>
		</div>
	);
};

export default EventBar;
