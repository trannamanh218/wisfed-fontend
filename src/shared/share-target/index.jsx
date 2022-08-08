import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LinearProgressBar from 'shared/linear-progress-bar';
import UserAvatar from 'shared/user-avatar';
import './index.scss';
import _ from 'lodash';
import PropTypes from 'prop-types';

function ShareTarget({ postsData, inPost = false }) {
	const { userInfo } = useSelector(state => state.auth);

	const percent = useRef(0);

	useEffect(() => {
		if (inPost && !_.isEmpty(postsData)) {
			percent.current = ((postsData.currentRead / postsData.totalTarget) * 100).toFixed();
		}
	}, []);

	const renderContentTop = () => {
		return (
			<div className='reading-target__content__top'>
				<p>
					Bạn đã đọc được {inPost ? postsData.currentRead : postsData?.booksReadCount} trên{' '}
					{inPost ? postsData.totalTarget : postsData?.numberBook} cuốn
				</p>
			</div>
		);
	};

	return (
		<div className='creat-post-modal-content__main__share-container'>
			<div className='reading-target__process'>
				<UserAvatar className='reading-target__user' source={userInfo?.avatarImage} size='lg' />
				<div className='reading-target__content'>
					{renderContentTop()}
					<div className='reading-target__content__bottom'>
						<LinearProgressBar
							percent={inPost ? percent.current : postsData?.percent}
							label={`${inPost ? percent.current : postsData?.percent} %`}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

ShareTarget.propTypes = {
	postsData: PropTypes.object,
	inPost: PropTypes.bool,
};

export default ShareTarget;
