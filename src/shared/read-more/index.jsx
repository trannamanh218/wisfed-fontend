import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './read-more.scss';

const ReadMore = ({ text, length = 450 }) => {
	const [showLess, setShowLess] = useState(true);
	const [showReadmore, setShowReadmore] = useState(false);

	useEffect(() => {
		if (text && text.length > length) {
			setShowReadmore(true);
		} else {
			setShowReadmore(false);
		}
	}, [text]);

	const handleShow = () => {
		setShowLess(prev => !prev);
	};

	return (
		<p className={classNames('read-more')}>
			{showReadmore ? <>{showLess ? `${text.slice(0, length)}...` : text}</> : text}
			{showReadmore && (
				<button className='read-more__btn' onClick={handleShow}>
					{showLess ? 'Tiếp tục đọc' : 'Thu gọn'}
				</button>
			)}
		</p>
	);
};

ReadMore.propTypes = {
	text: PropTypes.string.isRequired,
	length: PropTypes.number,
};

export default ReadMore;
