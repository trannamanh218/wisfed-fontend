import { useState, useRef, useEffect } from 'react';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import './comment-editor.scss';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { checkUserLogin } from 'reducers/redux-utils/auth';

const CommentEditor = ({
	onCreateComment,
	className,
	replyId,
	textareaId,
	mentionUsersArr,
	replyingCommentId,
	clickReply,
	setMentionUsersArr,
}) => {
	const userInfo = useSelector(state => state.auth.userInfo);
	const [showPlaceholder, setShowPlaceholder] = useState(true);

	const commentArea = useRef(null);

	const dispatch = useDispatch();

	useEffect(() => {
		commentArea.current.addEventListener('input', handlePlaceholder);
		// commentArea.current.addEventListener('paste', () => {
		// 	placeCaretAtEnd(commentArea.current);
		// });
		return () => {
			document.removeEventListener('input', handlePlaceholder);
		};
	}, [showPlaceholder, clickReply, mentionUsersArr]);

	// useEffect(() => {
	// 	const textareaInCommentEdit = document.querySelector(`#textarea-${replyingCommentId}`);
	// 	if (textareaInCommentEdit) {
	// 		textareaInCommentEdit.focus();
	// 		window.scroll({
	// 			top: textareaInCommentEdit.offsetTop - 400,
	// 			behavior: 'smooth',
	// 		});
	// 		textareaInCommentEdit.innerHTML = `<span class="url-color">${mentionUsersArr[0].userFullName}</span>`;
	// 	}
	// }, [replyingCommentId, clickReply]);

	// const createSpanElements = () => {
	// 	const subStringArray = commentArea.current.innerText.split(' ');
	// 	commentArea.current.innerText = '';
	// 	for (let i = 0; i < subStringArray.length; i++) {
	// 		if (subStringArray[i] === mentionUsersArr[0].userFullName) {
	// 			subStringArray[i] = `<span class="url-color">${subStringArray[i]}</span>`;
	// 		} else {
	// 			subStringArray[i] = `<span>${subStringArray[i]}</span>`;
	// 		}
	// 	}
	// 	commentArea.current.innerHTML = subStringArray.join(' ');
	// 	placeCaretAtEnd(commentArea.current);
	// };

	// const placeCaretAtEnd = element => {
	// 	element.focus();
	// 	if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
	// 		const range = document.createRange();
	// 		range.selectNodeContents(element);
	// 		range.collapse(false);
	// 		const selection = window.getSelection();
	// 		selection.removeAllRanges();
	// 		selection.addRange(range);
	// 	} else if (typeof document.body.createTextRange != 'undefined') {
	// 		const textRange = document.body.createTextRange();
	// 		textRange.moveToElementText(element);
	// 		textRange.collapse(false);
	// 		textRange.select();
	// 	}
	// };

	const onChangeComment = () => {
		commentArea.current.style.height = 0;
		commentArea.current.style.height = commentArea.current.scrollHeight + 2 + 'px';
	};

	const handleKeyPress = e => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			if (e.which === 13 && !e.shiftKey && commentArea.current.value) {
				e.preventDefault();
				onCreateComment(commentArea.current.value, replyId);
				commentArea.current.value = '';
				onChangeComment();
			}
		}
	};

	const handlePlaceholder = () => {
		if (commentArea.current.innerText.length > 0) {
			setShowPlaceholder(false);
		} else {
			setShowPlaceholder(true);
		}
	};

	return (
		<div className={`comment-editor ${className ? className : ''}`}>
			<div className='comment-editor__avatar'>
				<UserAvatar size='sm' source={userInfo.avatarImage} />
			</div>
			<div className='comment-editor__text-area-wrapper'>
				<div
					ref={commentArea}
					className='comment-editor__text-area'
					contentEditable={true}
					onChange={onChangeComment}
					id={textareaId}
					onKeyPress={handleKeyPress}
				></div>
				<div
					className={classNames('comment-editor__text-area-placeholder', {
						'hide': !showPlaceholder,
					})}
				>
					Viết bình luận...
				</div>
			</div>
		</div>
	);
};

CommentEditor.defaultProps = {
	userInfo: {},
	onCreateComment: () => {},
	className: '',
	replyId: null,
};

CommentEditor.propTypes = {
	userInfo: PropTypes.object,
	onCreateComment: PropTypes.func,
	className: PropTypes.string,
	replyId: PropTypes.any,
	textareaId: PropTypes.string,
};

export default CommentEditor;
