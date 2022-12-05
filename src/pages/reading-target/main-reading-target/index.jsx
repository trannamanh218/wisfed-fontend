import { useFetchTargetReading } from 'api/readingTarget.hooks';
import { useFetchUserParams } from 'api/user.hook';
import { READ_TARGET_VERB_SHARE_LV1, STATUS_LOADING } from 'constants/index';
import Storage from 'helpers/Storage';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { saveDataShare } from 'reducers/redux-utils/post';
import BookThumbnail from 'shared/book-thumbnail';
import { useModal } from 'shared/hooks';
import LinearProgressBar from 'shared/linear-progress-bar';
import Circle from 'shared/loading/circle';
import SearchField from 'shared/search-field';
import UserAvatar from 'shared/user-avatar';
import ModalReadTarget from '../modal-reading-target';
import GoalsNotSetYet from './goals-not-set';
import './main-reading-target.scss';

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

	const { booksReadYear, year, status } = useFetchTargetReading(userId, modalOpen);

	const renderLinearProgressBar = item => {
		let percent = 0;
		if (item.booksReadCount >= item.numberBook) {
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
			newData.map((item, index) => (
				<div key={index}>
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
						<div className='book-row__container'>{moment(item?.createdAt).format('DD/MM/YYYY')}</div>
						<div className='book-row__container'>{moment(item.startRead).format('DD/MM/YYYY')}</div>
						<div className='book-row__container'>{moment(item.endRead).format('DD/MM/YYYY')}</div>
					</div>
				</div>
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
				verb: READ_TARGET_VERB_SHARE_LV1,
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
			{booksReadYear.length > 0 ? (
				<>
					<div className='reading-target__process'>
						<UserAvatar
							className='reading-target__user'
							source={userData.avatarImage || userInfo?.avatarImage}
							size='lg'
						/>
						<div className='reading-target__content'>
							{renderContentTop(booksReadYear[0])}
							<div className='reading-target__content__bottom'>
								{renderLinearProgressBar(booksReadYear[0])}
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
					{!_.isEmpty(booksReadYear[0].booksRead) && (
						<div className='reading-target__table'>
							<div className='reading-target__table__header'>
								<div className='reading-target__table__header-column'></div>
								<div className='reading-target__table__header-column'>Tên sách</div>
								<div className='reading-target__table__header-column'>Tác giả</div>
								<div className='reading-target__table__header-column'>Ngày thêm</div>
								<div className='reading-target__table__header-column'>Ngày đọc</div>
								<div className='reading-target__table__header-column'>Ngày hoàn thành</div>
							</div>
							<div className='reading-target__table__body'>
								{inputSearch.length > 0
									? handleRenderUseSearch(newArrSearch)
									: handleRenderUseSearch(booksReadYear[0])}
							</div>
						</div>
					)}
				</>
			) : (
				userId === userInfo.id && status === 'SUCCESS' && <GoalsNotSetYet userInfo={userInfo} />
			)}
		</div>
	);
};

MainReadingTarget.propTypes = {
	setErrorLoadPage: PropTypes.func,
};

export default MainReadingTarget;
