import { REVIEW_TYPE } from 'constants/index';
import PropTypes from 'prop-types';
import { Suspense } from 'react';
const Post = lazy(() => import('shared/post'));
import './post-list.scss';

const PostList = ({ list }) => {
	if (list && list.length) {
		return list.map((item, index) => (
			<Suspense key={index}>
				<div className='post-container--custom'>
					<Post postInformations={item} type={REVIEW_TYPE} />
				</div>
			</Suspense>
		));
	}
	return <p>Không có review nào</p>;
};

PostList.defaultProps = {
	list: [],
};

PostList.propTypes = {
	list: PropTypes.array,
};

export default PostList;
