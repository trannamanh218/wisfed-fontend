import NormalContainer from 'components/layout/normal-container';
import Post from 'shared/post';
import { getDetailFeed, getDetailFeedGroup } from 'reducers/redux-utils/notificaiton';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import './detail-feed.scss';
import Circle from 'shared/loading/circle';
import { POST_TYPE, GROUP_TYPE } from 'constants';

const DetailFeed = () => {
	const dispatch = useDispatch();
	const [detailFeed, setDetailFedd] = useState([]);
	const { idPost, type } = useParams();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(async () => {
		const params = {
			id: idPost,
		};
		try {
			let res = [];
			if (type === 'mini-post') {
				res = await dispatch(getDetailFeed(params)).unwrap();
			} else {
				res = await dispatch(getDetailFeedGroup(params)).unwrap();
			}
			setDetailFedd(res);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return (
		<NormalContainer>
			<Circle loading={isLoading} />
			<div className='detail_feed_container'>
				{type === 'mini-post' ? (
					detailFeed.map(item => <Post postInformations={item} key={item.id} type={POST_TYPE} />)
				) : (
					<Post postInformations={detailFeed} type={GROUP_TYPE} />
				)}
			</div>
		</NormalContainer>
	);
};

export default DetailFeed;
