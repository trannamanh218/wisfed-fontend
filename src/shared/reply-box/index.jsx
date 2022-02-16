import React, { useRef } from 'react';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import './reply-box.scss';

const ReplyBox = ({ handleChange }) => {
	const commentArea = useRef(null);

	const onChange = e => {
		handleChange(e);
		commentArea.current.style.height = 0;
		commentArea.current.style.height = commentArea.current.scrollHeight + 2 + 'px';
	};

	return (
		<div className='reply-box'>
			<UserAvatar size='sm' />
			<form className='reply-box__form'>
				<textarea
					ref={commentArea}
					className='reply-box__textarea'
					placeholder='Viết bình luận...'
					rows='1'
					onChange={onChange}
					name='reply-comment'
				/>
			</form>
		</div>
	);
};

ReplyBox.defaultProps = {
	handleChange: () => {},
};

ReplyBox.propTypes = {
	handleChange: PropTypes.func,
};

export default ReplyBox;
