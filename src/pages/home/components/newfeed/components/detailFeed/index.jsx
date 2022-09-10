import NormalContainer from 'components/layout/normal-container';
import Post from 'shared/post';
import { getDetailFeed, getDetailFeedGroup } from 'reducers/redux-utils/notificaiton';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import './detail-feed.scss';
import Circle from 'shared/loading/circle';
import { POST_TYPE, GROUP_TYPE } from 'constants/index';

const DetailFeed = () => {
	const dispatch = useDispatch();
	const [detailFeed, setDetailFeed] = useState([]);
	const { idPost, type } = useParams();
	const [isLoading, setIsLoading] = useState(true);

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
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		window.scroll(0, 0);
	}, []);

	return (
		<NormalContainer>
			<Circle loading={isLoading} />
			<div className='detail_feed_container'>
				{type === 'mini-post' ? (
					<Post postInformations={detailFeed} type={POST_TYPE} />
				) : (
					<Post postInformations={detailFeed} type={GROUP_TYPE} />
				)}
			</div>
		</NormalContainer>
	);
};

export default DetailFeed;
