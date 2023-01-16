import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './read-more.scss';
import { useRef } from 'react';
import { urlRegex, hashtagRegex } from 'constants';

const ReadMore = ({ text, height }) => {
	const [showLess, setShowLess] = useState(false);
	const [showReadmore, setShowReadmore] = useState(false);

	const readMore = useRef(null);

	console.log(text);

	useEffect(() => {
		if (readMore.current) {
			if (readMore.current.offsetHeight - height > 0) {
				setShowReadmore(true);
			}
			const element = readMore.current.querySelector('.read-more-container');
			element.style.maxHeight = `${height - 22.5}px`;
			// 22.5 là chiều cao của read-more__btn
		}
	}, [height]);

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

	const handleShow = () => {
		const element = readMore.current.querySelector('.read-more-container');
		if (showLess) {
			element.style.maxHeight = `${height - 22.5}px`;
		} else {
			element.style.maxHeight = `inherit`;
		}
		setShowLess(!showLess);
	};

	return (
		<div className='read-more' ref={readMore}>
			<div
				className='read-more-container'
				dangerouslySetInnerHTML={{
					__html: generateContent(text),
				}}
			></div>
			{showReadmore && (
				<button className='read-more__btn' onClick={handleShow}>
					{showLess ? 'Thu gọn' : 'Xem thêm'}
				</button>
			)}
		</div>
	);
};

ReadMore.propTypes = {
	text: PropTypes.string.isRequired,
	height: PropTypes.number.isRequired,
};

export default ReadMore;
