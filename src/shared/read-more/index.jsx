import { useState, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './read-more.scss';
import { useRef } from 'react';
import { urlRegex, hashtagRegex } from 'constants';

const ReadMore = ({ text, readMoreTranslators }) => {
	const [hasMore, setHasMore] = useState(false);
	const [readMore, setReadMore] = useState(false);
	const postContentRef = useRef(null);

	useEffect(() => {
		if (postContentRef.current) {
			// check text clamped when use webkit-box
			const isTextClamped = elm => elm.scrollHeight > elm.clientHeight;
			if (isTextClamped(postContentRef.current)) {
				setHasMore(true);
			} else {
				setHasMore(false);
			}
		}
	}, [text]);

	const generateContent = content => {
		let newContent = content.replace(/(<p><br><\/p>)+/g, '');
		if (newContent.match(urlRegex) || newContent.match(hashtagRegex)) {
			newContent = newContent.replace(urlRegex, data => {
				return `<a class="url-class" data-url=${data}>${
					data.length <= 50 ? data : data.slice(0, 50) + '...'
				}</a>`;
			});
		}
		return newContent;
	};

	return (
		<div className='read-more'>
			<div
				ref={postContentRef}
				className={classNames('post__content', {
					'view-less': !readMore && !readMoreTranslators,
					'view-less-translators': !readMore && readMoreTranslators,
				})}
				dangerouslySetInnerHTML={{
					__html: generateContent(text),
				}}
			></div>
			{hasMore && (
				<div className='read-more-post' onClick={() => setReadMore(!readMore)}>
					{readMore ? 'Rút gọn' : 'Xem thêm'}
				</div>
			)}
		</div>
	);
};

ReadMore.defaultProp = {
	readMoreTranslators: false,
};

ReadMore.propTypes = {
	text: PropTypes.string.isRequired,
	readMoreTranslators: PropTypes.bool,
};

export default ReadMore;
