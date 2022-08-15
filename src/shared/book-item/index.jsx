import { useRef } from 'react';
import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import PropTypes from 'prop-types';
import SettingMore from 'shared/setting-more';
// import EyeIcon from 'shared/eye-icon';
import StatusButton from 'components/status-button';
import './book-item.scss';
import _ from 'lodash';
import classNames from 'classnames';

const BookItem = ({ data, handleViewBookDetail, isMyShelve, handleUpdateBookList }) => {
	// const [isPublic, setIsPublic] = useState(data.isPublic);

	const bookOverlay = useRef(null);
	const bookItemContainer = useRef(null);

	// const handlePublic = () => {
	// 	setIsPublic(prev => !prev);
	// };

	const renderOverlay = () => {
		if (isMyShelve) {
			return (
				<>
					<SettingMore bookData={data} handleUpdateBookList={handleUpdateBookList} />
					{/* <span className='book-item__icon' title='Chế độ công khai'>
						<EyeIcon isPublic={isPublic} handlePublic={handlePublic} />
					</span> */}
				</>
			);
		} else {
			return <StatusButton bookData={data} />;
		}
	};

	const viewBookDetail = e => {
		if (bookItemContainer.current.contains(e.target) && !bookOverlay.current.contains(e.target)) {
			handleViewBookDetail(data);
		}
	};

	return (
		<div className='book-item' onClick={viewBookDetail} ref={bookItemContainer}>
			<div className='book-item__container'>
				<BookThumbnail size='lg' {...data} />
				<div className={classNames('book-item__overlay', { 'position': !isMyShelve })} ref={bookOverlay}>
					{renderOverlay()}
				</div>
			</div>

			<p className='book-item__name' title={data.name}>
				{data.name}
			</p>
			<span className='book-item__author'>
				{!_.isEmpty(data.authors) ? data?.authors[0]?.authorName : <br />}
			</span>
			<ReactRating initialRating={data.avgRating?.toFixed(1)} readonly={true} />
			<span className='book-item__text'>
				{data.avgRating && data.avgRating > 0
					? `(Trung bình ${data.avgRating.toFixed(1)} sao)`
					: 'chưa có đánh giá'}
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
	handleViewBookDetail: () => {},
	handleUpdateBookList: () => {},
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
	handleViewBookDetail: PropTypes.func,
	handleUpdateBookList: PropTypes.func,
};
export default BookItem;
