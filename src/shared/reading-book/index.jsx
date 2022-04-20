import './style.scss';
import ProgressBar from 'react-bootstrap/ProgressBar';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import CreatPostModalContent from 'pages/home/components/newfeed/components/creat-post-modal-content';

function ReadingBook({ bookData }) {
	const [renderBookReading, setRenderBooksReading] = useState({});
	const [toggleModal, setToggleModal] = useState(false);
	const [booksId, setBooksId] = useState('');
	const [percent, setPercent] = useState(null);
	const [option, setOption] = useState({});

	useEffect(() => {
		if (bookData?.books?.length > 0) {
			const newItem = bookData?.books[bookData?.books.length - 1];
			setRenderBooksReading(newItem.book);
			if (newItem.book.progress) {
				const progessNumber = (newItem.book.progress / newItem.book.page) * 100;
				setPercent(progessNumber.toFixed());
			} else {
				setPercent(0);
			}
		}
	}, [bookData, percent]);

	const handleOpenModal = () => {
		setToggleModal(!toggleModal);
		setBooksId(renderBookReading.id);
	};

	const onChangeOption = data => {
		setOption(data);
	};

	const onChangeNewPost = () => {
		setToggleModal(!toggleModal);
	};
	return (
		bookData?.books?.length > 0 && (
			<div className='reading-book'>
				<h4 className='reading-book__title'>Sách đang đọc</h4>
				<div className='reading-book__content'>
					<div className='reading-book__box'>
						<div className='reading-book__thumbnail'>
							<img
								data-testid='reading-book__book-img'
								src={renderBookReading?.images?.length > 0 && renderBookReading?.images[0]}
								alt=''
							/>
						</div>
						<div className='reading-book__information'>
							<div>
								<div className='reading-book__information__book-name'>{renderBookReading.name}</div>
								<div className='reading-book__information__author'>{renderBookReading?.author}</div>
							</div>
							<div className='reading-book__information__current-progress'>
								<ProgressBar now={percent} />
								<div className='reading-book__progress-percent'>{percent ? percent + '%' : '0%'}</div>
							</div>
							<button onClick={handleOpenModal} className='reading-book__update-progress'>
								Cập nhật tiến độ
							</button>
						</div>
					</div>
				</div>
				{toggleModal && (
					<div className='newfeed__creat-post__modal'>
						<CreatPostModalContent
							showModalCreatPost={toggleModal}
							option={option}
							renderBookReading={renderBookReading}
							booksId={booksId}
							hideCreatPostModal={handleOpenModal}
							onChangeOption={onChangeOption}
							onChangeNewPost={onChangeNewPost}
						/>
					</div>
				)}
			</div>
		)
	);
}
ReadingBook.propTypes = {
	bookData: PropTypes.object,
};
export default ReadingBook;
