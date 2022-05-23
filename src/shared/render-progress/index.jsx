import ProgressBarCircle from 'shared/progress-circle';
import ReadChallenge from 'shared/read-challenge';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useFetchTargetReading } from 'api/readingTarget.hooks';
import { memo } from 'react';

const RenderProgress = ({ userId }) => {
	const { checkRenderTarget } = useSelector(state => state.chart);
	useFetchTargetReading(userId);
	const renderProgressBar = () => {
		if (checkRenderTarget === true) {
			return <ProgressBarCircle />;
		} else if (checkRenderTarget === false) {
			return <ReadChallenge />;
		}
	};

	return <>{renderProgressBar()}</>;
};

RenderProgress.propTypes = {
	userId: PropTypes.string,
};

export default memo(RenderProgress);
