import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './progress-circle.scss';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useFetchTargetReading } from 'api/readingTarget.hooks';

const ProgressBarCircle = () => {
	const { userId } = useParams();
	const { booksReadYear } = useFetchTargetReading(userId);

	const idCSS = 'library';
	const SVG = () => {
		const gradientTransform = `rotate(90)`;
		return (
			<svg style={{ height: 0 }}>
				<defs>
					<linearGradient id={idCSS} gradientTransform={gradientTransform}>
						<stop offset='0%' stopColor='#00BAFF' />
						<stop offset=' 100%' stopColor='#063EF9' />
					</linearGradient>
				</defs>
			</svg>
		);
	};
	const renderLinearProgressBar = item => {
		let percent = 0;
		if (item.booksReadCount > item.numberBook) {
			return (percent = 100);
		} else {
			percent = ((item.booksReadCount / item.numberBook) * 100).toFixed();
		}
		return percent;
	};

	return (
		<div>
			<div className='progress__circle__title'>Mục tiêu đọc sách</div>
			{booksReadYear.map(item => (
				<div key={item.id} className='progress__circle__container'>
					<div>
						<CircularProgressbarWithChildren
							strokeWidth={4}
							value={renderLinearProgressBar(item)}
							text={`${item.booksReadCount}/${item.numberBook}`}
							styles={{
								path: { stroke: `url(#${idCSS})`, height: '100%' },
							}}
						/>
						<div className='progress__circle__container__title'>Số cuốn sách đọc trong năm 2022</div>
						{SVG()}
						<Link
							to={`/reading-target/${userId}`}
							style={{ 'cursor': 'pointer', 'marginTop': '15px' }}
							className='sidebar__view-more-btn--blue'
						>
							Xem chi tiết
						</Link>
					</div>
				</div>
			))}
		</div>
	);
};
export default ProgressBarCircle;
