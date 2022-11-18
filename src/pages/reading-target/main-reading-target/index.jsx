import { useState } from 'react';
import SearchField from 'shared/search-field';
import UserAvatar from 'shared/user-avatar';
import LinearProgressBar from 'shared/linear-progress-bar';
import _ from 'lodash';
import moment from 'moment';
import './main-reading-target.scss';
import BookThumbnail from 'shared/book-thumbnail';
import ModalReadTarget from '../modal-reading-target';
import { useModal } from 'shared/hooks';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetchUserParams } from 'api/user.hook';
import { useFetchTargetReading } from 'api/readingTarget.hooks';
import GoalsNotSetYet from './goals-not-set';
import Circle from 'shared/loading/circle';
import { STATUS_LOADING } from 'constants/index';
import { useDispatch } from 'react-redux';
import { saveDataShare } from 'reducers/redux-utils/post';
import Storage from 'helpers/Storage';
import { READ_TARGET_VERB_SHARE } from 'constants/index';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

const MainReadingTarget = ({ setErrorLoadPage }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { userId } = useParams();
	const { userInfo } = useSelector(state => state.auth);
	const { userData, errorFetch } = useFetchUserParams(userId);
	const { modalOpen, setModalOpen, toggleModal } = useModal(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [inputSearch, setInputSearch] = useState('');
	const [newArrSearch, setNewArrSearch] = useState([]);
	const { booksReadYear, year, status } = useFetchTargetReading(userId, modalOpen, deleteModal);

	const renderLinearProgressBar = item => {
		let percent = 0;
		if (item.booksReadCount > item.numberBook) {
			percent = 100;
		} else if (0 < item.booksReadCount < item.numberBook) {
			percent = ((item.booksReadCount / item.numberBook) * 100).toFixed();
		}
		return <LinearProgressBar height={2.75} percent={percent} label={`${percent} %`} />;
	};

	useEffect(() => {
		if (errorFetch) {
			setErrorLoadPage(true);
		}
	}, [errorFetch]);

	const handleEditTarget = () => {
		setModalOpen(true);
		setDeleteModal(false);
	};

	const handleDeleteTarget = () => {
		setDeleteModal(true);
		setModalOpen(true);
	};

	const handleSearch = e => {
		setInputSearch(e.target.value);
		const newBookYear = booksReadYear[0].booksRead.filter(item =>
			item.book.name.toLowerCase().includes(e.target.value)
		);
		setNewArrSearch(newBookYear);
	};

	const renderContentTop = item => {
		const name = userInfo.id === userId ? 'Bạn' : userData?.fullName;
		return (
			<div className='reading-target__content__top'>
				<p>
					{name} đã đọc được {item.booksReadCount} trên {item.numberBook} cuốn
				</p>
				{userInfo.id === userId && (
					<>
						<button onClick={handleEditTarget} className='btn-edit'>
							Sửa mục tiêu
						</button>
						<button onClick={handleDeleteTarget} className='btn-cancel'>
							Bỏ mục tiêu
						</button>
					</>
				)}
			</div>
		);
	};

	const generateAuthorName = author => {
		if (author && author.length) {
			const authorNameArr = author.map(item => item.authorName);
			return authorNameArr.join(' - ');
		} else {
			return 'Chưa cập nhật';
		}
	};

	const handleRenderUseSearch = newArr => {
		const newData = newArr.booksRead || newArr;
		return newData.length ? (
			newData.map(item => (
				<>
					<div className='book-row' key={item.id}>
						<div className='book-row__container'>
							<Link to={`/book/detail/${item.book.id}`}>
								<BookThumbnail size='sm' source={item?.book?.frontBookCover || item.book?.images[0]} />
							</Link>
						</div>
						<div className='book-row__container'>
							<span className='book-name' title={item.book.name}>
								<Link to={`/book/detail/${item.book.id}`}>{item.book.name}</Link>
							</span>
						</div>
						<div className='book-row__container'>{generateAuthorName(item?.book.authors)}</div>
						<div className='book-row__container'>{moment(item?.book.createdAt).format('DD/MM/YYYY')}</div>
						<div className='book-row__container'>{moment(item.createdAt).format('DD/MM/YYYY')}</div>
						<div className='book-row__container'>{moment(item.updatedAt).format('DD/MM/YYYY')}</div>
					</div>
				</>
			))
		) : (
			<div className='highlight'>
				<span>Không tìm thấy kết quả nào</span>
			</div>
		);
	};

	const handleShareTargetReading = async () => {
		if (!Storage.getAccessToken()) {
			return;
		} else {
			const percentTemp = ((booksReadYear[0].booksReadCount / booksReadYear[0].numberBook) * 100).toFixed();
			const target = {
				numberBook: booksReadYear[0].numberBook,
				booksReadCount: booksReadYear[0].booksReadCount,
				percent: percentTemp > 100 ? 100 : percentTemp,
				verb: READ_TARGET_VERB_SHARE,
				userId: userId,
				avatarImage: userInfo.avatarImage,
			};
			dispatch(saveDataShare(target));
			navigate('/');
		}
	};

	return (
		<div className='reading-target'>
			<Circle loading={status === STATUS_LOADING} />
			<div className='reading-target__header'>
				<h4>Mục tiêu đọc sách năm {booksReadYear[0]?.year || year}</h4>
				<SearchField
					className='main-shelves__search'
					placeholder='Tìm kiếm sách'
					handleChange={handleSearch}
					value={inputSearch}
				/>
			</div>
			{booksReadYear.length > 0
				? booksReadYear.map(item => (
						<>
							<div className='reading-target__process'>
								<UserAvatar
									className='reading-target__user'
									source={userData.avatarImage || userInfo?.avatarImage}
									size='lg'
								/>
								<div className='reading-target__content'>
									{renderContentTop(item)}
									<div className='reading-target__content__bottom'>
										{renderLinearProgressBar(item)}
										{userInfo.id === userId && (
											<button
												className='btn btn-share btn-primary-light'
												onClick={handleShareTargetReading}
											>
												Chia sẻ
											</button>
										)}
									</div>
								</div>
							</div>
							<ModalReadTarget
								modalOpen={modalOpen}
								toggleModal={toggleModal}
								setModalOpen={setModalOpen}
								deleteModal={deleteModal}
							/>
							{!_.isEmpty(item.booksRead) && (
								<div className='reading-target__table'>
									<div className='reading-target__table__header'>
										<div className='reading-target__table__header-column'></div>
										<div className='reading-target__table__header-column'>Tên sách</div>
										<div className='reading-target__table__header-column'>Tác giả</div>
										<div className='reading-target__table__header-column'>Ngày thêm</div>
										<div className='reading-target__table__header-column'>Ngày đọc</div>
										<div className='reading-target__table__header-column'>Ngày hoàn thành</div>
										<div className='empty-row' />
									</div>
									<div className='reading-target__table__body'>
										{inputSearch.length > 0
											? handleRenderUseSearch(newArrSearch)
											: handleRenderUseSearch(item)}
									</div>
								</div>
							)}
						</>
				  ))
				: userId === userInfo.id && status === 'SUCCESS' && <GoalsNotSetYet userInfo={userInfo} />}
		</div>
	);
};

MainReadingTarget.propTypes = {
	setErrorLoadPage: PropTypes.func,
};
export default MainReadingTarget;
