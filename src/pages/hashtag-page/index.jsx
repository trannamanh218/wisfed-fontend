import NormalContainer from 'components/layout/normal-container';
import './hashtag-page.scss';
import Post from 'shared/post';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import LoadingIndicator from 'shared/loading-indicator';
import { POST_TYPE } from 'constants/index';
import { getListPostByHashtag, getListPostByHashtagGroup } from 'reducers/redux-utils/hashtag-page';
import InfiniteScroll from 'react-infinite-scroll-component';

function HashtagPage() {
	const dispatch = useDispatch();
	const { hashtag, groupId } = useParams();

	const [postList, setPostList] = useState([]);
	const [hasMore, setHasMore] = useState(true);

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const getPostsByHashtagFromGroup = async () => {
		const data = {
			groupId: groupId,
			params: {
				tag: hashtag,
			},
		};
		try {
			const res = await dispatch(getListPostByHashtagGroup(data)).unwrap();
			setPostList(postList.concat(res));
			if (res.length === 0 || res.length < callApiPerPage.current) {
				setHasMore(false);
			} else {
				callApiStart.current += callApiPerPage.current;
			}
		} catch (error) {
			NotificationError(error);
		}
	};

	const getPostsByHashtag = async () => {
		const params = {
			q: hashtag,
			start: callApiStart.current,
			limit: callApiPerPage.current,
		};
		try {
			const res = await dispatch(getListPostByHashtag(params)).unwrap();
			setPostList(postList.concat(res));
			if (res.length === 0 || res.length < callApiPerPage.current) {
				setHasMore(false);
			} else {
				callApiStart.current += callApiPerPage.current;
			}
		} catch (error) {
			NotificationError(error);
		}
	};

	useEffect(() => {
		if (groupId) {
			getPostsByHashtagFromGroup();
		} else {
			getPostsByHashtag();
		}
	}, [groupId, hashtag]);

	return (
		<NormalContainer>
			<div className='hashtag-page'>
				<h4>Kết quả tìm kiếm cho "#{hashtag}"</h4>
				<InfiniteScroll
					dataLength={postList.length}
					next={getListPostByHashtag}
					hasMore={hasMore}
					loader={<LoadingIndicator />}
				>
					{postList.map(post => (
						<Post key={post.id} postInformations={post} type={POST_TYPE} />
					))}
				</InfiniteScroll>
			</div>
		</NormalContainer>
	);
}

export default HashtagPage;
