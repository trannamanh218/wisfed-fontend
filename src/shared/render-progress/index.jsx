import ProgressBarCircle from 'shared/progress-circle';
import ReadChallenge from 'shared/read-challenge';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const RenderProgress = ({ booksReadYear }) => {
	const { checkRenderTarget } = useSelector(state => state.chart);

	const renderProgressBar = () => {
		if (checkRenderTarget === true && booksReadYear.length > 0) {
			return <ProgressBarCircle />;
		} else if (checkRenderTarget === false) {
			<ReadChallenge />;
		}
	};

	return <>{renderProgressBar()}</>;
};

RenderProgress.propTypes = {
	booksReadYear: PropTypes.array,
};
export default RenderProgress;
