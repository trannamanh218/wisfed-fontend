import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './progress-circle.scss';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

const ProgressBarCircle = ({ booksReadYear }) => {
	const { userId } = useParams();
	const { userInfo } = useSelector(state => state.auth);
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
		if (item.booksReadCount >= item.numberBook) {
			return (percent = 100);
		} else if (0 < item.booksReadCount !== undefined < item.numberBook) {
			percent = ((item.booksReadCount / item.numberBook) * 100).toFixed();
		} else {
			percent = 0;
		}
		return percent;
	};

	return (
		<>
			{!_.isEmpty(booksReadYear) && (
				<div>
					<div className='progress__circle__title'>Mục tiêu đọc sách</div>
					<div className='progress__circle__container'>
						{booksReadYear.map(item => (
							<div key={item.id}>
								<CircularProgressbarWithChildren
									strokeWidth={4}
									value={renderLinearProgressBar(item)}
									text={`${item.booksReadCount || 0}/${item.numberBook}`}
									styles={{
										path: { stroke: `url(#${idCSS})`, height: '100%' },
									}}
								/>
								<div className='progress__circle__container__title'>
									Số cuốn sách đọc trong năm {item.year}
								</div>
								{SVG()}
								<Link
									to={`/reading-target/${userId || userInfo?.id}`}
									style={{ 'cursor': 'pointer', 'marginTop': '15px' }}
									className='sidebar__view-more-btn--blue'
								>
									Xem chi tiết
								</Link>
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);
};

ProgressBarCircle.propTypes = {
	booksReadYear: PropTypes.array,
};
export default ProgressBarCircle;
