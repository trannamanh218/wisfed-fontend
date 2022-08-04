import { Modal, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import SearchField from 'shared/search-field';
import './ModalSeries.scss';
import { useState } from 'react';
import AddSeriesForm from './addSeriesForm/AddSeriesForm';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { getMySeries, getListBookBySeries, getSeriesDetail, postMoreSeries } from 'reducers/redux-utils/series';
import { useEffect } from 'react';
import _ from 'lodash';

const ModalSeries = ({ showModalSeries, handleCloseModalSeries, series, setSeries }) => {
	const [APIListSeries, setAPIListSeries] = useState([]);
	const [updateListSeries, setUpdateListSeries] = useState(false);

	const dispatch = useDispatch();

	const [inputSearch, setInputSearch] = useState('');

	const handleSearch = e => {
		setInputSearch(e.target.value);
	};

	const onItemChange = item => {
		setSeries(item);
	};

	const handleClose = () => {
		handleCloseModalSeries();
		setSeries('');
	};

	const handlePostMoreSeries = async params => {
		try {
			await dispatch(postMoreSeries(params)).unwrap();
			setUpdateListSeries(!updateListSeries);
		} catch (err) {
			NotificationError(err);
		}
	};

	const updateSeries = params => {
		handlePostMoreSeries(params);
	};

	const handleConfirm = () => {
		handleCloseModalSeries();
	};

	const handleGetSeriesList = async () => {
		try {
			const res = await dispatch(getMySeries()).unwrap();
			const newArr = res.filter(item => item.name.toLowerCase().includes(inputSearch.toLowerCase()));
			setTimeout(function () {
				setAPIListSeries(newArr);
			}, 500);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		handleGetSeriesList();
	}, [updateListSeries, inputSearch]);

	return (
		<Modal className='modal-series' show={showModalSeries} onHide={handleClose}>
			<Modal.Body>
				<div className='modal-series__header'>
					<label>Sê-ri</label>
					<input
						className='input input--non-border'
						placeholder='Sê-ri bộ sách'
						disabled
						value={series.name || ''}
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
						{APIListSeries.map((item, index) => {
							return (
								<Row key={index}>
									<Col xs={10}>
										<div className='series-options-title'>{item.name}</div>
									</Col>
									<Col xs={2} className='series-options-checkbox'>
										<label className='series-options-container'>
											<input
												type='radio'
												id={item.id}
												name='title'
												onChange={() => onItemChange(item)}
											/>
											<div className='series-options-checkmark'></div>
										</label>
									</Col>
								</Row>
							);
						})}
					</div>
					<AddSeriesForm updateSeries={updateSeries} />
				</div>
				<div className='modal-series__footer'>
					<button onClick={handleConfirm}>
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
		{ id: '1', name: 'Ươm mầm tỉ phú nhí' },
		{ id: '2', name: 'Ươm mầm tỉ phú nhí' },
		{ id: '3', name: 'Ươm mầm tỉ phú nhí' },
		{ id: '4', name: 'Ươm mầm tỉ phú nhí' },
	],
};

ModalSeries.propTypes = {
	showModalSeries: PropTypes.bool,
	handleCloseModalSeries: PropTypes.func,
	APIListSeries: PropTypes.array.isRequired,
	updateSeries: PropTypes.func,
	series: PropTypes.any,
	setSeries: PropTypes.func,
};

export default ModalSeries;
