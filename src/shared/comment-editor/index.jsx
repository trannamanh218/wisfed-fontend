import { useState, useEffect } from 'react';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import './comment-editor.scss';
import { useSelector, useDispatch } from 'react-redux';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import RichTextEditor from 'shared/rich-text-editor';
import { getDefaultKeyBinding } from 'draft-js';
import Storage from 'helpers/Storage';

const CommentEditor = ({
	onCreateComment,
	className,
	mentionUsersArr,
	replyingCommentId,
	clickReply,
	setMentionUsersArr,
}) => {
	const [content, setContent] = useState('');
	const [createCmt, setCreateCmt] = useState(true);

	const dispatch = useDispatch();
	const userInfo = useSelector(state => state.auth.userInfo);

	useEffect(() => {
		const commentEditField = document.querySelector(`.rich-text-editor-${replyingCommentId}`);
		if (commentEditField) {
			// console.log(commentEditField.offsetTop);
			setTimeout(() => {
				window.scroll({
					top: commentEditField.offsetTop - 400,
					behavior: 'smooth',
				});
			}, 100);
		}
	}, [replyingCommentId, clickReply]);

	const handleKeyBind = e => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			if (e.keyCode === 13 && !e.shiftKey && !(e.metaKey || e.ctrlKey)) {
				return 'send-message';
			} else if (e.keyCode === 13 && e.shiftKey) {
				return 'split-block';
			}
			return getDefaultKeyBinding(e);
		}
	};

	const handleKeyPress = command => {
		if (command === 'send-message') {
			onCreateComment(content, replyingCommentId);
			setCreateCmt(!createCmt);
		}
	};

	return (
		<>
			<div className={`comment-editor ${className ? className : ''}`}>
				<div className='comment-editor__avatar'>
					<UserAvatar size='sm' source={userInfo.avatarImage} />
				</div>
				<RichTextEditor
					placeholder='Viết bình luận...'
					className={`rich-text-editor-${replyingCommentId}`}
					content={content}
					setContent={setContent}
					handleKeyBind={handleKeyBind}
					handleKeyPress={handleKeyPress}
					clickReply={clickReply}
					createCmt={createCmt}
					mentionUsersArr={mentionUsersArr}
					hasMentionsUser={true}
					setMentionUsersArr={setMentionUsersArr}
				/>
			</div>
		</>
	);
};

CommentEditor.defaultProps = {
	onCreateComment: () => {},
	className: '',
	replyingCommentId: null,
	mentionUsersArr: [],
	clickReply: () => {},
	setMentionUsersArr: () => {},
};

CommentEditor.propTypes = {
	onCreateComment: PropTypes.func,
	className: PropTypes.string,
	replyingCommentId: PropTypes.number,
	mentionUsersArr: PropTypes.array,
	clickReply: PropTypes.func,
	setMentionUsersArr: PropTypes.func,
};

export default CommentEditor;
