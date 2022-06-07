import ProgressBarCircle from 'shared/progress-circle';
import ReadChallenge from 'shared/read-challenge';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { memo, useEffect, useState } from 'react';
import { getListBooksTargetReading } from 'reducers/redux-utils/chart';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';

const RenderProgress = ({ userId }) => {
	const [booksReadYear, setBookReadYear] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	const { checkRenderTarget } = useSelector(state => state.chart);

	const dispatch = useDispatch();

	useEffect(() => {
		getTargetReading();
	}, [checkRenderTarget]);

	const getTargetReading = async () => {
		setIsLoading(true);
		try {
			const data = await dispatch(getListBooksTargetReading(userId)).unwrap();
			const year = new Date().getFullYear();
			const newData = data.filter(item => item.year === year);
			if (newData.length) {
				setBookReadYear(newData[0]);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const renderProgressBar = () => {
		if (!_.isEmpty(booksReadYear)) {
			return <ProgressBarCircle booksReadYearData={booksReadYear} />;
		} else {
			return <ReadChallenge />;
		}
	};

	return <>{!isLoading && renderProgressBar()}</>;
};

RenderProgress.propTypes = {
	userId: PropTypes.string,
};

export default memo(RenderProgress);
