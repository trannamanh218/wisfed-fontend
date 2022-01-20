import React, { useState } from 'react';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import PropsTypes from 'prop-types';
import './book-item.scss';
import SettingMore from 'shared/setting-more';
import EyeIcon from 'shared/eye-icon';
import StatusButton from 'components/status-button';

const BookItem = props => {
	const { data, handleClick, isMyShelve } = props;
	const [isPublic, setIsPublic] = useState(data.isPublic);

	const handlePublic = () => {
		setIsPublic(prev => !prev);
	};

	const renderOverlay = () => {
		if (isMyShelve) {
			return (
				<span className='book-item__icon'>
					<EyeIcon isPublic={isPublic} handlePublic={handlePublic} />
				</span>
			);
		}

		return <StatusButton />;
	};
	return (
		<div className='book-item' onClick={handleClick}>
			<div className='book-item__container'>
				<BookThumbnail size='lg' source={data.source} />
				<div className='book-item__overlay'>
					<SettingMore />
					{renderOverlay()}
				</div>
			</div>

			<p className='book-item__name' title={data.name}>
				{data.name}
			</p>
			<span className='book-item__author'>{data.author}</span>
			<ReactRating initialRating={4} readonly={true} />
			<span className='book-item__text'>{`(Trung bình ${data.rating} sao)`}</span>
		</div>
	);
};

BookItem.defaultProps = {
	data: {
		source: '',
		name: 'Tên sách trong tủ sách của tôi',
		author: 'Tác giả cuốn sách',
		rating: 4,
		isPublic: true,
	},
	isMyShelve: false,
	handleClick: () => {},
};

BookItem.propTypes = {
	data: PropsTypes.shape({
		source: PropsTypes.string.isRequired,
		name: PropsTypes.string,
		author: PropsTypes.string.isRequired,
		rating: PropsTypes.number.isRequired,
		isPublic: PropsTypes.bool,
	}),
	isMyShelve: PropsTypes.bool,
	handleClick: PropsTypes.func,
};
export default BookItem;
