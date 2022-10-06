import './SeeMoreComments.scss';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { getComments } from 'reducers/redux-utils/comment';
import { useState } from 'react';
import LoadingIndicator from 'shared/loading-indicator';

const SeeMoreComments = ({ data = {}, setData = () => {} }) => {
	const dispatch = useDispatch();

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const [firstTimeClick, setFirstTimeClick] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const onClickSeeMore = async () => {
		setIsLoading(true);
		try {
			const params = {
				start: firstTimeClick ? 0 : callApiStart.current,
				limit: firstTimeClick ? 20 : callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: JSON.stringify([{ operator: 'eq', value: data.minipostId, property: 'minipostId' }]),
			};
			const res = await dispatch(getComments(params)).unwrap();
			handleAddMoreComments(data, res.rows);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAddMoreComments = (paramData, paramRows) => {
		const cloneObj = { ...paramData };
		if (firstTimeClick) {
			cloneObj.usersComments = [];
			setFirstTimeClick(false);
		}
		paramRows.forEach(item => cloneObj.usersComments.unshift(item));
		setData(cloneObj);

		callApiStart.current += callApiPerPage.current;
		setIsLoading(false);
	};

	return (
		<>
			{data.usersComments?.length < data.comments && (
				<>
					{isLoading ? (
						<div className='loading-more-comments'>
							<LoadingIndicator />
						</div>
					) : (
						<div className='see-more-comment'>
							<span className='see-more-comment__button' onClick={onClickSeeMore}>
								Xem thêm bình luận
							</span>
							<span className='see-more-comment__number'>
								{data.usersComments?.length}/{data.comments}
							</span>
						</div>
					)}
				</>
			)}
		</>
	);
};

SeeMoreComments.propTypes = {
	data: PropTypes.object,
	setData: PropTypes.object,
};

export default SeeMoreComments;
