import React, { useState, useEffect } from 'react';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import PropTypes, { number } from 'prop-types';
import SettingMore from 'shared/setting-more';
import EyeIcon from 'shared/eye-icon';
import StatusButton from 'components/status-button';
import './book-item.scss';
import _ from 'lodash';
import { getRatingBook } from 'reducers/redux-utils/book';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const BookItem = props => {
	const { data, handleClick, isMyShelve, handleUpdateLibrary } = props;
	const [isPublic, setIsPublic] = useState(data.isPublic);
	const dispatch = useDispatch();
	const [listRatingStar, setListRatingStar] = useState({});

	const handlePublic = () => {
		setIsPublic(prev => !prev);
	};

	const fetchData = async () => {
		try {
			const res = await dispatch(getRatingBook(data?.id)).unwrap();
			setListRatingStar(res.data);
		} catch (err) {
			toast.error('lỗi hệ thống');
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const renderOverlay = () => {
		if (isMyShelve) {
			return (
				<span className='book-item__icon' title='Chế độ công khai'>
					<EyeIcon isPublic={isPublic} handlePublic={handlePublic} />
				</span>
			);
		}

		return <StatusButton bookData={data} />;
	};

	return (
		<div className='book-item' onClick={handleClick}>
			<div className='book-item__container'>
				<BookThumbnail size='lg' {...data} />
				<div className='book-item__overlay'>
					{isMyShelve && <SettingMore bookData={data} handleUpdateLibrary={handleUpdateLibrary} />}
					{renderOverlay()}
				</div>
			</div>

			<p className='book-item__name' title={data.name}>
				{data.name}
			</p>
			<span className='book-item__author'>
				{!_.isEmpty(data.authors) ? data?.authors[0]?.authorName : <br />}
			</span>
			<ReactRating initialRating={listRatingStar.avg} readonly={true} />
			<span className='book-item__text'>
				{listRatingStar.avg !== 0 ? `(Trung bình ${listRatingStar?.avg} sao)` : 'chưa có đánh giá'}
			</span>
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
	handleUpdateLibrary: () => {},
};

BookItem.propTypes = {
	data: PropTypes.shape({
		source: PropTypes.string,
		images: PropTypes.array,
		name: PropTypes.string,
		authors: PropTypes.array,
		rating: PropTypes.number,
		isPublic: PropTypes.bool,
		id: PropTypes.number,
	}),
	isMyShelve: PropTypes.bool,
	handleClick: PropTypes.func,
	handleUpdateLibrary: PropTypes.func,
};
export default BookItem;
