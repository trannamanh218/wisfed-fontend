import './modal-filter-home.scss';
import MultipleCheckbox from 'shared/multiple-checkbox';
import { Modal } from 'react-bootstrap';
import React from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';

const Modalfilterhome = ({ setModalShow, modalShow }) => {
	const fakeData = [
		{
			'title': 'Cập nhật sách',
			'value': 1,
		},
		{
			'title': 'Review',
			'value': 2,
		},
		{
			'title': 'Theo chủ đề yêu thích',
			'value': 3,
		},
		{
			'title': 'Nội dung từ các nhóm',
			'value': 4,
		},
		{
			'title': 'Tất cả nội dung trên',
			'value': 5,
		},
	];
	const fakeData2 = [
		{
			'title': 'Tất cả người dùng',
			'value': 1,
		},
		{
			'title': 'Bạn bè',
			'value': 2,
		},
		{
			'title': 'Người follow',
			'value': 3,
		},
		{
			'title': 'Người thuộc top review nhiều nhất',
			'value': 4,
		},
	];
	const handleClose = () => setModalShow(false);

	return (
		<div className='modalfilterhome__container'>
			<Modal
				id='status-book-modal'
				className='status-book-modal'
				show={modalShow}
				onHide={handleClose}
				keyboard={false}
				centered
			>
				<Modal.Body>
					<div className='modalfilterhome__container__main'>
						<div className='modalfilterhome__container__title'>Nội dung hiển thị</div>
						<MultipleCheckbox list={fakeData} />
						<div className='modalfilterhome__container__title__two'>Hiện thị nội dung của </div>
						<MultipleCheckbox list={fakeData2} />
						<Button onClick={handleClose} className='filter-quote-pane__setting__btn'>
							Xác nhận
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};
Modalfilterhome.propTypes = {
	setModalShow: PropTypes.func,
	modalShow: PropTypes.bool,
};
export default Modalfilterhome;
