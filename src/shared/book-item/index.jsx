import React, { useState } from 'react';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import PropTypes from 'prop-types';
import './book-item.scss';
import SettingMore from 'shared/setting-more';
import EyeIcon from 'shared/eye-icon';
import StatusButton from 'components/status-button';

const BookItem = props => {
	const { data, handleClick, isMyShelve, handleRemoveBook } = props;
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
				<BookThumbnail size='lg' {...data} />
				<div className='book-item__overlay'>
					{isMyShelve && <SettingMore bookData={data} handleRemoveBook={handleRemoveBook} />}
					{renderOverlay()}
				</div>
			</div>

			<p className='book-item__name' title={data.name}>
				{data.name}
			</p>
			<span className='book-item__author'>{data?.authors[0].authorName || 'Chưa cập nhật'}</span>
			<ReactRating initialRating={4} readonly={true} />
			<span className='book-item__text'>{`(Trung bình ${data.rating || 4} sao)`}</span>
		</div>
	);
};

BookItem.defaultProps = {
	data: {
		source: '',
		name: 'Tên sách trong tủ sách của tôi',
		authors: [{ authorName: 'Tác giả cuốn sách' }],
		rating: 4,
		isPublic: true,
	},
	isMyShelve: false,
	handleClick: () => {},
	handleRemoveBook: () => {},
};

BookItem.propTypes = {
	data: PropTypes.shape({
		source: PropTypes.string,
		images: PropTypes.array,
		name: PropTypes.string,
		authors: PropTypes.array,
		rating: PropTypes.number,
		isPublic: PropTypes.bool,
	}),
	isMyShelve: PropTypes.bool,
	handleClick: PropTypes.func,
	handleRemoveBook: PropTypes.func,
};
export default BookItem;
