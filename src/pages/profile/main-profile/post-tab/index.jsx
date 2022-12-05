import { useState, useEffect, useRef, memo } from 'react';
import Post from 'shared/post';
import './post-tab.scss';
import { getPostsByUser } from 'reducers/redux-utils/post';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
import PropTypes from 'prop-types';
import { POST_TYPE } from 'constants/index';
import classNames from 'classnames';

function PostTab({ currentTab }) {
	const [postList, setPostList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);

	const { userId } = useParams();
	const dispatch = useDispatch();

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(5);

	useEffect(() => {
		if (currentTab === 'post') {
			callApiStart.current = 0;
			setLoading(true);
			setHasMore(true);
			setPostList([]);
		}
	}, [userId]);

	useEffect(() => {
		if (!postList.length > 0 && currentTab === 'post') {
			getPostListByUser();
		}
	}, [postList, currentTab]);

	const getPostListByUser = async () => {
		try {
			const data = {
				params: {
					start: callApiStart.current,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				},
				userId: userId,
			};
			const posts = await dispatch(getPostsByUser(data)).unwrap();
			if (posts.length > 0) {
				callApiStart.current += callApiPerPage.current;
				setPostList(postList.concat(posts));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={classNames('post-tab', { 'loading': loading })}>
			{loading ? (
				<LoadingIndicator />
			) : (
				<>
					{currentTab === 'post' && !!postList.length ? (
						<InfiniteScroll
							dataLength={postList.length}
							next={getPostListByUser}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							{postList.map(item => {
								if (!item.isDeleted) {
									return <Post key={item.id} postInformations={item} type={POST_TYPE} />;
								}
							})}
						</InfiniteScroll>
					) : (
						<p className='post-data__blank'>Không có bài viết nào</p>
					)}
				</>
			)}
		</div>
	);
}

PostTab.propTypes = {
	currentTab: PropTypes.string,
};

export default memo(PostTab);
