import ProgressBarCircle from 'shared/progress-circle';
import ReadChallenge from 'shared/read-challenge';
import PropTypes from 'prop-types';
import { useFetchTargetReading } from 'api/readingTarget.hooks';
import { memo } from 'react';

const RenderProgress = ({ userIdParams }) => {
	const { booksReadYear } = useFetchTargetReading(userIdParams);

	const renderProgressBar = () => {
		if (booksReadYear.length > 0) {
			return <ProgressBarCircle booksReadYear={booksReadYear} />;
		} else {
			return <ReadChallenge />;
		}
	};

	return <>{renderProgressBar()}</>;
};

RenderProgress.propTypes = {
	userIdParams: PropTypes.string,
};

export default memo(RenderProgress);
