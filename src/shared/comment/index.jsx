import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'react-bootstrap';
import UserAvatar from 'shared/user-avatar';
import './comment.scss';

const Comment = props => {
	const { data, handleReply, handleLike, postData, index, parentData, indexParent } = props;
	const isAuthor = postData.origin.split(':')[1] === data.user.id;

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
					<li className='comment__item' onClick={handleLike}>
						Thích
					</li>
					<li className='comment__item' onClick={() => handleReply(data, index, parentData, indexParent)}>
						Phản hồi
					</li>
					<li className='comment__item comment__item--timeline'>{`${0} giờ`}</li>
				</ul>
			</div>
		</div>
	);
};

Comment.defaultProps = {
	data: {},
	handleLike: () => {},
	handleReply: () => {},
	index: 0,
	parentData: {},
	indexParent: null,
};

Comment.propTypes = {
	data: PropTypes.object,
	postData: PropTypes.object,
	handleLike: PropTypes.func,
	handleReply: PropTypes.func,
	index: PropTypes.number,
	parentData: PropTypes.object,
	indexParent: PropTypes.any,
};

export default Comment;
