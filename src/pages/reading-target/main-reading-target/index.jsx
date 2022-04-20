import React, { useState, useEffect } from 'react';
import SearchField from 'shared/search-field';
import UserAvatar from 'shared/user-avatar';
import LinearProgressBar from 'shared/linear-progress-bar';
import { Table } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';
import './main-reading-target.scss';
import BookThumbnail from 'shared/book-thumbnail';
import { getListBooksTargetReading } from 'reducers/redux-utils/chart';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import ModalReadTarget from '../modal-reading-target';
import { useModal } from 'shared/hooks';

const MainReadingTarget = () => {
	const dispatch = useDispatch();
	const [booksReadYear, setBooksReadYear] = useState([]);
	const { modalOpen, setModalOpen, toggleModal } = useModal(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const fetchData = async () => {
		try {
			const data = await dispatch(getListBooksTargetReading()).unwrap();
			const dob = new Date();
			const year = dob.getFullYear();
			const newData = data.filter(item => item.year === year);
			setBooksReadYear(newData);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		fetchData();
	}, [modalOpen, deleteModal]);

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

	return booksReadYear.map(item => (
		<div key={item.id} className='reading-target'>
			<div className='reading-target__header'>
				<h4>Mục tiêu đọc sách năm {item.year}</h4>
				<SearchField placeholder='Tìm kiếm sách' />
			</div>
			<div className='reading-target__process'>
				<UserAvatar className='reading-target__user' size='lg' />
				<div className='reading-target__content'>
					<div className='reading-target__content__top'>
						<p>
							Bạn đã đọc được {item.booksReadCount} trên {item.numberBook} cuốn
						</p>
						<button onClick={handleEditTarget} className='btn-edit'>
							Sửa mục tiêu
						</button>
						<button onClick={handleDeleteTarget} className='btn-cancel'>
							Bỏ mục tiêu
						</button>
					</div>
					<div className='reading-target__content__bottom'>
						{renderLinearProgressBar(item)}
						<button className='btn btn-share btn-primary-light'>Chia sẻ</button>
					</div>
				</div>
			</div>

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
						{!_.isEmpty(item.booksRead) ? (
							item.booksRead.map((item, index) => (
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
							<tr className='empty-data'>
								<td colSpan={6}>Không có dữ liếu</td>
							</tr>
						)}
						<tr className='highlight'>
							<td colSpan={8}></td>
						</tr>
					</tbody>
				</Table>
			</div>
			<ModalReadTarget
				modalOpen={modalOpen}
				toggleModal={toggleModal}
				setModalOpen={setModalOpen}
				deleteModal={deleteModal}
			/>
		</div>
	));
};

MainReadingTarget.propTypes = {};

export default MainReadingTarget;
