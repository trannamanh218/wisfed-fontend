import { Modal, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import SearchField from 'shared/search-field';
import './ModalSeries.scss';
import { useState } from 'react';
import AddSeriesForm from './addSeriesForm/AddSeriesForm';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { getMySeries, postMoreSeries, removeBookFromSeries } from 'reducers/redux-utils/series';
import { useEffect } from 'react';
import { CloseIconX } from 'components/svg';
import _ from 'lodash';
import { addBookToSeries } from 'reducers/redux-utils/series';

const ModalSeries = ({
	showModalSeries,
	handleCloseModalSeries,
	series,
	setSeries,
	temporarySeries,
	setTemporarySeries,
	bookId,
	currentSeries,
	handleGetBookDetail,
	temporarySeriesName,
	setTemporarySeriesName,
}) => {
	const [buttonDisable, setButtonDisable] = useState(false);

	const [APIListSeries, setAPIListSeries] = useState([]);
	const [listSeries, setListSeries] = useState([]);
	const [updateListSeries, setUpdateListSeries] = useState(false);

	const dispatch = useDispatch();

	const [inputSearch, setInputSearch] = useState('');

	const handleSearch = e => {
		setInputSearch(e.target.value);
		const inpSearch = e.target.value;
		setListSeries(APIListSeries.filter(item => item.name.toLowerCase().includes(inpSearch.toLowerCase())));
	};

	const onItemChange = item => {
		setTemporarySeries(item);
		setTemporarySeriesName(item.name);
	};

	const handleClose = () => {
		handleCloseModalSeries();
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

	const handleConfirm = async () => {
		setSeries(temporarySeries);
		handleCloseModalSeries();
		// Trước hết kiểm tra xem sách đã ở trong một series chưa
		if (currentSeries) {
			// Đầu tiên xóa sách khỏi series cũ
			const paramsForRemoveBookFromSeries = {
				seriesId: currentSeries.id,
				body: { bookIds: [Number(bookId)] },
			};
			await handleRemoveBookFromSeries(paramsForRemoveBookFromSeries);
			// Sau đó thêm lại sách vào series mới chọn
			const paramsForAddBookToSeries = {
				seriesId: temporarySeries.id,
				body: { bookIds: [Number(bookId)] },
			};
			handleAddBookToSeries(paramsForAddBookToSeries);
		} else if (bookId) {
			// Nếu sách chưa ở trong một series nào thì không cần xóa sách khỏi series cũ nữa
			const paramsForAddBookToSeries = {
				seriesId: temporarySeries.id,
				body: { bookIds: [Number(bookId)] },
			};
			handleAddBookToSeries(paramsForAddBookToSeries);
		}
	};

	const handleRemoveBookFromSeries = async params => {
		try {
			await dispatch(removeBookFromSeries(params)).unwrap();
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAddBookToSeries = async params => {
		try {
			await dispatch(addBookToSeries(params)).unwrap();
			handleGetBookDetail();
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleGetSeriesList = async () => {
		try {
			const res = await dispatch(getMySeries()).unwrap();
			setAPIListSeries(res);
			setListSeries(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		handleGetSeriesList();
	}, [updateListSeries]);

	useEffect(() => {
		setTemporarySeries(series);
		setTemporarySeriesName(series.name);
	}, [showModalSeries]);

	useEffect(() => {
		if (_.isEmpty(temporarySeries)) {
			setButtonDisable(true);
		} else {
			setButtonDisable(false);
		}
	}, [temporarySeries]);

	return (
		<Modal className='modal-series' show={showModalSeries} onHide={handleClose}>
			<Modal.Body>
				<div className='modal-series__header'>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: '5px',
						}}
					>
						<span style={{ marginLeft: '5px' }}>Sê-ri</span>
						<CloseIconX onClick={handleClose} onMouseEnter={e => (e.target.style.cursor = 'pointer')} />
					</div>
					<input
						className='input input--non-border'
						placeholder='Sê-ri bộ sách'
						disabled
						value={temporarySeriesName}
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
						{listSeries.map((item, index) => {
							return (
								<label key={index} className='row-options'>
									<Col xs={10}>
										<div className='series-options-title'>{item.name}</div>
									</Col>
									<Col xs={2} className='series-options-checkbox'>
										<div className='series-options-container'>
											<input
												type='radio'
												name='title'
												checked={temporarySeries.id === item.id}
												onChange={() => onItemChange(item)}
											/>
											<div className='series-options-checkmark'></div>
										</div>
									</Col>
								</label>
							);
						})}
					</div>
					<AddSeriesForm updateSeries={updateSeries} />
				</div>
				<div className='modal-series__footer'>
					<button
						onClick={handleConfirm}
						style={buttonDisable ? { cursor: 'not-allowed', backgroundColor: '#d9dbe9' } : null}
						disabled={buttonDisable ? true : false}
					>
						<span>{currentSeries ? 'Thêm vào series' : 'Xác nhận'}</span>
					</button>
				</div>
			</Modal.Body>
		</Modal>
	);
};

ModalSeries.defaultProps = {
	showModalSeries: false,
	addToSeriesImmediately: false,
	temporarySeriesName: '',
};

ModalSeries.propTypes = {
	showModalSeries: PropTypes.bool,
	handleCloseModalSeries: PropTypes.func,
	series: PropTypes.object,
	setSeries: PropTypes.func,
	temporarySeries: PropTypes.object,
	setTemporarySeries: PropTypes.func,
	bookId: PropTypes.number,
	currentSeries: PropTypes.object,
	handleGetBookDetail: PropTypes.func,
	temporarySeriesName: PropTypes.string,
	setTemporarySeriesName: PropTypes.func,
};

export default ModalSeries;
