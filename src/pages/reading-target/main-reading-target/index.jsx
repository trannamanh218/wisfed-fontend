import { useState } from 'react';
import SearchField from 'shared/search-field';
import UserAvatar from 'shared/user-avatar';
import LinearProgressBar from 'shared/linear-progress-bar';
import { Table } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';
import './main-reading-target.scss';
import BookThumbnail from 'shared/book-thumbnail';
import ModalReadTarget from '../modal-reading-target';
import { useModal } from 'shared/hooks';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetchUserParams } from 'api/user.hook';
import { useFetchTargetReading } from 'api/readingTarget.hooks';
import GoalsNotSetYet from './goals-not-set';
import Circle from 'shared/loading/circle';
import { STATUS_LOADING } from 'constants';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainReadingTarget = () => {
	const { userId } = useParams();
	const { userInfo } = useSelector(state => state.auth);
	const { userData } = useFetchUserParams(userId);
	const { modalOpen, setModalOpen, toggleModal } = useModal(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [inputSearch, setInputSearch] = useState('');
	const [newArrSearch, setNewArrSearch] = useState([]);
	const navigate = useNavigate();
	const { booksReadYear, year, status } = useFetchTargetReading(userId, modalOpen, deleteModal);
	const renderLinearProgressBar = item => {
		let percent = 0;
		if (item.booksReadCount > item.numberBook) {
			percent = 100;
		} else {
			percent = ((item.booksReadCount / item.numberBook) * 100).toFixed();
		}
		return <LinearProgressBar height={2.75} percent={percent} label={`${percent} %`} />;
	};

	const handleEditTarget = () => {
		setModalOpen(true);
	};

	const handleDeleteTarget = () => {
		setDeleteModal(true);
		setModalOpen(true);
	};

	useEffect(() => {
		if (booksReadYear.length < 1 && status === 'SUCCESS') {
			navigate('/');
		}
	}, [status]);

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
	const handleRenderUseSearch = newArr => {
		const newData = newArr.booksRead || newArr;
		return newData.length ? (
			newData.map((item, index) => (
				<>
					<tr className={`highlight highlight-${index} `}>
						<td colSpan={8}></td>
					</tr>
					<tr className='book-row' key={item.id}>
						<td className='hightlight-column'></td>
						<td>
							<BookThumbnail size='sm' source={item.book?.images[0]} />
						</td>
						<td>
							<span className='book-name' title={item.book.name}>
								{item.book.name}
							</span>
						</td>
						<td>{!_.isEmpty(item.authors) ? item.authors[0].name : 'Chưa cập nhật'}</td>
						<td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
						<td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
						<td>{moment(item.updatedAt).format('DD/MM/YYYY')}</td>
						<td className='hightlight-column'></td>
					</tr>
				</>
			))
		) : (
			<tr className='highlight'>
				<td colSpan={8}>Không tìm thấy kết quả nào</td>
			</tr>
		);
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
								<UserAvatar className='reading-target__user' source={userInfo?.avatarImage} size='lg' />
								<div className='reading-target__content'>
									{renderContentTop(item)}
									<div className='reading-target__content__bottom'>
										{renderLinearProgressBar(item)}
										{userInfo.id === userId && (
											<button className='btn btn-share btn-primary-light'>Chia sẻ</button>
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
									<Table>
										<thead className='reading-target__table__header'>
											<tr>
												<th colSpan={3}>Tên sách</th>
												<th>Tác giả</th>
												<th>Ngày thêm</th>
												<th>Ngày đọc</th>
												<th colSpan={2}>Ngày hoàn thành</th>
											</tr>
											<tr className='empty-row' />
										</thead>
										<tbody>
											{inputSearch.length > 0
												? handleRenderUseSearch(newArrSearch)
												: handleRenderUseSearch(item)}
											<tr className='highlight'>
												<td colSpan={8}></td>
											</tr>
										</tbody>
									</Table>
								</div>
							)}
						</>
				  ))
				: userId === userInfo.id && status === 'SUCCESS' && <GoalsNotSetYet userInfo={userInfo} />}
		</div>
	);
};

MainReadingTarget.propTypes = {};
export default MainReadingTarget;
