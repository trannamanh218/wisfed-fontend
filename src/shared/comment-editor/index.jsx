import React, { useRef } from 'react';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import './comment-editor.scss';

const CommentEditor = ({ userInfo, postData, onCreateComment, className, reply, parentData, indexParent }) => {
	const commentArea = useRef(null);

	const onChangeComment = () => {
		commentArea.current.style.height = 0;
		commentArea.current.style.height = commentArea.current.scrollHeight + 2 + 'px';
	};

	const handleKeyPress = e => {
		if (e.which === 13 && !e.shiftKey) {
			e.preventDefault();
			if (commentArea.current.value) {
				onCreateComment(commentArea.current.value, reply, parentData, indexParent);
				commentArea.current.value = '';
				onChangeComment();
			}
		}
	};

	return (
		<div className={`comment-editor ${className ? className : ''}`}>
			<div className='comment-editor__avatar'>
				<UserAvatar size='sm' source={userInfo.avatarImage} />
			</div>
			<form className='comment-editor__form'>
				<textarea
					ref={commentArea}
					className='comment-editor__textarea'
					placeholder='Viết bình luận...'
					rows='1'
					onChange={onChangeComment}
					name='content'
					id={postData.id}
					onKeyPress={handleKeyPress}
				/>
			</form>
		</div>
	);
};

CommentEditor.defaultProps = {
	userInfo: {},
	postData: {},
	onCreateComment: () => {},
	className: '',
	reply: '',
	parentData: {},
	indexParent: null,
};

CommentEditor.propTypes = {
	userInfo: PropTypes.object,
	postData: PropTypes.object,
	onCreateComment: PropTypes.func,
	className: PropTypes.string,
	reply: PropTypes.any,
	parentData: PropTypes.object,
	indexParent: PropTypes.any,
};

export default CommentEditor;
