import { REVIEW_TYPE } from 'constants/index';
import PropTypes from 'prop-types';
import Post from 'shared/post';
import './post-list.scss';

const PostList = ({ list }) => {
	if (list && list.length) {
		return list.map((item, index) => (
			<div className='post-container--custom' key={`post-${index}`}>
				<Post postInformations={item} type={REVIEW_TYPE} />
			</div>
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
