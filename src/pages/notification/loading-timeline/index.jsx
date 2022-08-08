import './loading-timeline.scss';

const LoadingTimeLine = () => {
	return (
		<div className='timeline-wrapper'>
			{[...Array(8)].map((_, index) => (
				<div key={index} className='timeline-item'>
					<div className='animated-background avatar'></div>
					<div className='content__container'>
						<div className='animated-background content'></div>
					</div>
				</div>
			))}
		</div>
	);
};

export default LoadingTimeLine;
