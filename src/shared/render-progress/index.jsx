import ProgressBarCircle from 'shared/progress-circle';
import ReadChallenge from 'shared/read-challenge';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { useFetchTargetReading } from 'api/readingTarget.hooks';
import { STATUS_SUCCESS } from 'constants/index';

const RenderProgress = ({ userIdParams }) => {
	const { booksReadYear, status } = useFetchTargetReading(userIdParams);

	const renderProgressBar = () => {
		if (booksReadYear.length > 0) {
			return <ProgressBarCircle booksReadYear={booksReadYear} />;
		} else {
			return <ReadChallenge />;
		}
	};
	return status === STATUS_SUCCESS && renderProgressBar();
};

RenderProgress.propTypes = {
	userIdParams: PropTypes.string,
};

export default memo(RenderProgress);
