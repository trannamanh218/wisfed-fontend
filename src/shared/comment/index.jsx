import classNames from 'classnames';
import { calculateDurationTime } from 'helpers/Common';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateReactionActivity } from 'reducers/redux-utils/activity';
import UserAvatar from 'shared/user-avatar';
import './comment.scss';

const Comment = props => {
	const { data, handleReply, postData, index, parentData, indexParent } = props;
	// const isAuthor = postData.origin.split(':')[1] === data.user.id;
	const isAuthor = false;
	const { userInfo } = useSelector(state => state.auth);
	const dispatch = useDispatch();

	const handleLike = () => {
		const params = { commentId: data.id };
		dispatch(updateReactionActivity(params)).unwrap();
	};

	return (
		<div className={classNames('comment', { 'comment--secondary': !_.isEmpty(parentData) })}>
			<UserAvatar className='comment__avatar' size='sm' source={data.user?.avatarImage} />
			<div className='comment__wrapper'>
				<div className='comment__container'>
					<div className='comment__header'>
						<span className='comment__author'>
							{data.user.name ||
								data.user.fullName ||
								data.user.lastName ||
								data.user.firstName ||
								'Không xác định'}
						</span>
						{isAuthor && (
							<Badge className='comment__badge' bg='primary-light'>
								Tác giả
							</Badge>
						)}
					</div>
					<p className='comment__content'>{data.content}</p>
				</div>

				<ul className='comment__action'>
					<li
						className={classNames('comment__item', {
							'active': data.like && data.updateBy === userInfo.id,
						})}
						onClick={handleLike}
					>
						Thích
					</li>
					<li className='comment__item' onClick={() => handleReply(data, index, parentData, indexParent)}>
						Phản hồi
					</li>
					<li className='comment__item comment__item--timeline'>
						{`${calculateDurationTime(data.createdAt)}`}
					</li>
				</ul>
			</div>
		</div>
	);
};

Comment.defaultProps = {
	data: {},
	handleReply: () => {},
	index: 0,
	parentData: {},
	indexParent: null,
};

Comment.propTypes = {
	data: PropTypes.object,
	postData: PropTypes.object,
	handleReply: PropTypes.func,
	index: PropTypes.number,
	parentData: PropTypes.object,
	indexParent: PropTypes.any,
};

export default Comment;
