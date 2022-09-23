import './eventbar.scss';
// import eventBarImageSample from 'assets/images/event-bar-image-sample.jpg';
import { lazy, Suspense } from 'react';
import LoadingIndicator from 'shared/loading-indicator';
const SidebarRank = lazy(() => import('./sidebarRank'));

const EventBar = () => {
	return (
		<Suspense fallback={<LoadingIndicator />}>
			<div className='event-and-rank-bar'>
				{/* <div className='event-and-rank-bar__block'>
					<h4 className='event-and-rank-bar__block__title'>Sự kiện</h4>
					<div className='event-and-rank-bar__content'>
						<div className='event-bar__name'>World Books Day</div>
						<img src={eventBarImageSample} alt='' />
						<button className='event-bar__join-event'>Tham gia sự kiện</button>
					</div>
				</div> */}
				<SidebarRank />
			</div>
		</Suspense>
	);
};

export default EventBar;
