import React from 'react';
import SearchField from 'shared/search-field';
import UserAvatar from 'shared/user-avatar';
import LinearProgressBar from 'shared/linear-progress-bar';
import { Table } from 'react-bootstrap';
import bookImage from 'assets/images/book1.png';
import _ from 'lodash';
import moment from 'moment';
import './main-reading-target.scss';
import BookThumbnail from 'shared/book-thumbnail';

const MainReadingTarget = () => {
	const bookList = [...new Array(5)].fill({}).map((item, index) => ({
		id: index + 1,
		images: [bookImage],
		name: 'The Mystery of Briony Lodge - Bí mật của Briony Lodge Bí mật của Briony Lodge Bí mật của Briony Lodge',
		authors: [{ id: `author - ${index}`, name: 'Dr. Large' }],
		addDate: new Date(2022, 1, 3),
		readingDate: new Date(),
		completedDate: new Date(2022, 7, 30),
	}));

	return (
		<div className='reading-target'>
			<div className='reading-target__header'>
				<h4>Mục tiêu đọc sách năm 2021</h4>
				<SearchField placeholder='Tìm kiếm sách' />
			</div>
			<div className='reading-target__process'>
				<UserAvatar className='reading-target__user' size='lg' />
				<div className='reading-target__content'>
					<div className='reading-target__content__top'>
						<p>Bạn đã đọc được 2 trên 5 cuốn</p>
						<button className='btn-edit'>Sửa mục tiêu</button>
						<button className='btn-cancel'>Bỏ mục tiêu</button>
					</div>
					<div className='reading-target__content__bottom'>
						<LinearProgressBar height={2.75} percent={60} label={`60 %`} />
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
						{!_.isEmpty(bookList) ? (
							bookList.map((item, index) => (
								<>
									<tr className={`highlight highlight-${index} `}>
										<td colSpan={8}></td>
									</tr>
									<tr className='book-row' key={item.id}>
										<td className='hightlight-column'></td>
										<td>
											<BookThumbnail size='sm' images={item.images} />
										</td>
										<td>
											<span className='book-name' title={item.name}>
												{item.name}
											</span>
										</td>
										<td>{!_.isEmpty(item.authors) ? item.authors[0].name : 'Chưa cập nhật'}</td>
										<td>{moment(item.addDate).format('DD/MM/YYYY')}</td>
										<td>{moment(item.readingDate).format('DD/MM/YYYY')}</td>
										<td>{moment(item.completedDate).format('DD/MM/YYYY')}</td>
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
		</div>
	);
};

MainReadingTarget.propTypes = {};

export default MainReadingTarget;
