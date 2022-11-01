import NormalContainer from 'components/layout/normal-container';
import Post from 'shared/post';
import { getDetailFeed, getDetailFeedGroup } from 'reducers/redux-utils/notification';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './detail-feed.scss';
import Circle from 'shared/loading/circle';
import { POST_TYPE, GROUP_TYPE } from 'constants/index';
import NotFound from 'pages/not-found';

const DetailFeed = () => {
	const dispatch = useDispatch();
	const [detailFeed, setDetailFeed] = useState([]);
	const [renderNotFound, setRenderNotFound] = useState(false);
	const { idPost, type } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const reduxMentionCommentId = useSelector(state => state.notificationReducer.mentionCommentId);
	const reduxCheckIfMentionCmtFromGroup = useSelector(state => state.notificationReducer.checkIfMentionFromGroup);

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
			setRenderNotFound(true);
		} finally {
			setIsLoading(false);
		}
	}, [window.location.pathname]);

	useEffect(() => {
		window.scroll(0, 0);
	}, []);

	return (
		<>
			{renderNotFound ? (
				<NotFound />
			) : (
				<NormalContainer>
					<Circle loading={isLoading} />
					<div className='detail_feed_container'>
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
					</div>
				</NormalContainer>
			)}
		</>
	);
};

export default DetailFeed;
