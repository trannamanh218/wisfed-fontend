import { useState, useEffect, useRef, memo } from 'react';
import Post from 'shared/post';
import './post-tab.scss';
import { getPostsByUser } from 'reducers/redux-utils/post';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
import PropTypes from 'prop-types';
import { POST_TYPE } from 'constants/index';
import classNames from 'classnames';
import CreatePost from 'pages/home/components/newfeed/components/create-post';

function PostTab({ currentTab }) {
	const [postList, setPostList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);
	const [isNewPost, setIsNewPost] = useState(false);

	const { userId } = useParams();
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(5);
	// const isPostDeleted = useRef(false);
	// const isGetDataFirstTime = useRef(true);

	useEffect(() => {
		if (currentTab === 'post') {
			callApiStart.current = 0;
			setLoading(true);
			setHasMore(true);
			setPostList([]);
		}
	}, [userId, isNewPost]);

	useEffect(() => {
		if (!postList.length && currentTab === 'post') {
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
			setPostList(postList.concat(posts));
			if (posts.length < callApiPerPage.current) {
				setHasMore(false);
			} else {
				callApiStart.current += callApiPerPage.current;
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setLoading(false);
			// isPostDeleted.current = false;
			// isGetDataFirstTime.current = false;
		}
	};

	const onChangeNewPost = () => {
		setIsNewPost(!isNewPost);
	};

	const handleUpdatePostArrWhenDeleted = itemMinipostId => {
		const index = postList.findIndex(item => item.id === itemMinipostId);
		postList.splice(index, 1);
		const cloneArr = [...postList];
		setPostList(cloneArr);
		// onChangeNewPost();
	};

	return (
		<div className={classNames('post-tab', { 'loading': loading })}>
			{userId === userInfo.id && <CreatePost onChangeNewPost={onChangeNewPost} />}
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
									return (
										<Post
											key={item.id}
											postInformations={item}
											type={POST_TYPE}
											handleUpdatePostArrWhenDeleted={handleUpdatePostArrWhenDeleted}
										/>
									);
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
