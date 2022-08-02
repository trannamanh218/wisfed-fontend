import { Modal, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import SearchField from 'shared/search-field';
import './ModalSeries.scss';
import { useState } from 'react';
import AddSeriesForm from './addSeriesForm/AddSeriesForm';

const ModalSeries = ({ showModalSeries, handleCloseModalSeries, APIListSeries }) => {
	const [series, setSeries] = useState('');
	const [inputSearch, setInputSearch] = useState('');

	const handleSearch = e => {
		setInputSearch(e.target.value);
	};

	const onItemChange = item => {
		setSeries(item.title);
	};

	const handleClose = () => {
		handleCloseModalSeries();
		setSeries('');
	};

	return (
		<Modal className='modal-series' show={showModalSeries} onHide={handleClose}>
			<Modal.Body>
				<div className='modal-series__header'>
					<label>Sê-ri</label>
					<input
						className='input input--non-border'
						placeholder='Sê-ri bộ sách'
						disabled
						value={series}
					></input>
				</div>

				<div className='modal-series__body'>
					<SearchField
						placeholder='Tìm kiếm tên sê-ri'
						className='main-shelves__search'
						handleChange={handleSearch}
						value={inputSearch}
					/>
					<div className='modal-series__body__options'>
						{APIListSeries.map(item => {
							return (
								<Row key={item.id}>
									<Col xs={10}>
										<div className='series-options-title'>{item.title}</div>
									</Col>
									<Col xs={2} className='series-options-checkbox'>
										<label className='series-options-container'>
											<input
												type='radio'
												id={item.id}
												name={item.title}
												onChange={() => onItemChange(item)}
											/>
											<div className='series-options-checkmark'></div>
										</label>
									</Col>
								</Row>
							);
						})}
					</div>
					<AddSeriesForm
					// updateBookShelve={updateBookShelve}
					/>
				</div>
				<div className='modal-series__footer'>
					<button onClick={() => console.log('xác nhận')}>
						<span>Xác nhận</span>
					</button>
				</div>
			</Modal.Body>
		</Modal>
	);
};

ModalSeries.defaultProps = {
	showModalSeries: false,
	APIListSeries: [
		{ id: '1', title: 'Ươm mầm tỉ phú nhí' },
		{ id: '2', title: 'Ươm mầm tỉ phú nhí' },
		{ id: '3', title: 'Ươm mầm tỉ phú nhí' },
	],
};

ModalSeries.propTypes = {
	showModalSeries: PropTypes.bool,
	handleCloseModalSeries: PropTypes.func,
	APIListSeries: PropTypes.array,
};

export default ModalSeries;
