import NormalContainer from 'components/layout/normal-container';
import Post from 'shared/post';
import { getDetailFeed, getDetailFeedGroup } from 'reducers/redux-utils/notification';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './detail-feed.scss';
import { POST_TYPE, GROUP_TYPE } from 'constants/index';
import NotFound from 'pages/not-found';
import LoadingTimeLine from 'shared/loading-timeline';

const DetailFeed = () => {
	const [detailFeed, setDetailFeed] = useState([]);
	const [renderNotFound, setRenderNotFound] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [noPostData, setNoPostData] = useState(false);

	const reduxMentionCommentId = useSelector(state => state.notificationReducer.mentionCommentId);
	const reduxCheckIfMentionCmtFromGroup = useSelector(state => state.notificationReducer.checkIfMentionFromGroup);

	const { idPost, type } = useParams();
	const dispatch = useDispatch();

	useEffect(async () => {
		const params = {
			id: idPost,
		};
		try {
			let res;
			if (type === 'mini-post') {
				const data = await dispatch(getDetailFeed(params)).unwrap();
				res = data[0];
			} else {
				res = await dispatch(getDetailFeedGroup(params)).unwrap();
			}
			setDetailFeed(res);
		} catch (err) {
			if (err.errorCode === 404) {
				setNoPostData(true);
			}
			setRenderNotFound(true);
		} finally {
			setIsLoading(false);
		}
	}, [window.location.pathname]);

	return (
		<>
			{renderNotFound ? (
				<NotFound noPostData={noPostData} />
			) : (
				<NormalContainer>
					<div className='detail-feed-container'>
						{isLoading ? (
							<div className='detail-feed__loading'>
								<LoadingTimeLine numberItems={1} />
							</div>
						) : (
							<>
								{type === 'mini-post' ? (
									<Post
										postInformations={detailFeed}
										type={POST_TYPE}
										reduxMentionCommentId={reduxMentionCommentId}
										isInDetail={true}
									/>
								) : (
									<Post
										postInformations={detailFeed}
										type={GROUP_TYPE}
										reduxMentionCommentId={reduxMentionCommentId}
										reduxCheckIfMentionCmtFromGroup={reduxCheckIfMentionCmtFromGroup}
										isInDetail={true}
									/>
								)}
							</>
						)}
					</div>
				</NormalContainer>
			)}
		</>
	);
};

export default DetailFeed;
