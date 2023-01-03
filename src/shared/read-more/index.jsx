import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './read-more.scss';

const ReadMore = ({ text, length = 450 }) => {
	const [showLess, setShowLess] = useState(true);
	const [showReadmore, setShowReadmore] = useState(false);
	const [textFormated, setTextFormated] = useState('');

	useEffect(() => {
		if (text && text.length > length) {
			setShowReadmore(true);
		} else {
			setShowReadmore(false);
		}
		setTextFormated(text.replace(/<[^>]+>/g, ''));
	}, [text]);

	const handleShow = () => {
		setShowLess(!showLess);
	};

	return (
		<p className='read-more'>
			{showReadmore ? <>{showLess ? `${textFormated.slice(0, length)}...` : textFormated}</> : textFormated}
			{showReadmore && (
				<button className='read-more__btn' onClick={handleShow}>
					{showLess ? 'Xem Thêm' : 'Thu gọn'}
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
