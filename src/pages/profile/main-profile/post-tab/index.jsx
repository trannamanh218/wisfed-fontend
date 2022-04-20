import { useState, useEffect, useRef } from 'react';
import Post from 'shared/post';
import './post-tab.scss';
import { getPostsByUser } from 'reducers/redux-utils/post';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import InfiniteScroll from 'react-infinite-scroll-component';

function PostTab() {
	const [postList, setPostList] = useState([]);
	const [hasMore, setHasMore] = useState(true);

	const { userId } = useParams();
	const dispatch = useDispatch();

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	useEffect(() => {
		getPostListByUser();
	}, []);

	const getPostListByUser = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			};
			const posts = await dispatch(getPostsByUser({ userId, params })).unwrap();
			if (posts.length) {
				callApiStart.current += callApiPerPage.current;
				setPostList(postList.concat(posts));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='post-tab'>
			{postList.length > 0 && (
				<InfiniteScroll
					dataLength={postList.length}
					next={getPostListByUser}
					hasMore={hasMore}
					loader={<h4>Loading...</h4>}
				>
					{postList.map(item => (
						<Post key={item.id} postInformations={item} />
					))}
				</InfiniteScroll>
			)}
		</div>
	);
}

export default PostTab;
