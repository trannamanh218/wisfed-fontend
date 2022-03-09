import { CloseX } from 'components/svg';
import { generateQuery } from 'helpers/Common';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, ModalBody } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getListBookLibrary } from 'reducers/redux-utils/library';
import Button from 'shared/button';
import EyeIcon from 'shared/eye-icon';
import { useModal } from 'shared/hooks';
import PaginationGroup from 'shared/pagination-group';
import SearchField from 'shared/search-field';
import SelectBox from 'shared/select-box';
import Shelf from 'shared/shelf';
import './main-shelves.scss';
import SearchBook from './SearchBook';

const MainShelves = () => {
	const [isPublic, setIsPublic] = useState(true);
	const { modalOpen, toggleModal } = useModal(false);
	const [allBooks, setAllBooks] = useState({ rows: [], count: 0 });
	const [currentLibrary, setCurrentLibrary] = useState({ value: 'all', title: 'Tất cả' });
	const params = useParams();
	const dispatch = useDispatch();

	const {
		library: {
			libraryData: { rows = [] },
		},
		auth: { userInfo = {} },
	} = useSelector(state => state);

	const libraryList = !_.isEmpty(rows)
		? [{ value: 'all', title: 'Tất cả' }].concat(rows.map(item => ({ ...item, title: item.name, value: item.id })))
		: [];

	useEffect(() => {
		const isMount = true;
		if (isMount) {
			const fetchData = async () => {
				const filter = [];
				if (_.isEmpty(params) && !_.isEmpty(userInfo)) {
					filter.push({ 'operator': 'eq', 'value': userInfo.id, 'property': 'updatedBy' });
				}

				if (currentLibrary.value !== 'all') {
					filter.push({ 'operator': 'eq', 'value': currentLibrary.value, 'property': 'id' });
				}

				const query = generateQuery(1, 10, JSON.stringify(filter));
				try {
					const data = await dispatch(getListBookLibrary(query)).unwrap();
					setAllBooks(data);
				} catch (err) {
					return err;
				}
			};

			fetchData();
		}
	}, [currentLibrary]);

	const handlePublic = () => {
		setIsPublic(!isPublic);
	};

	const onChangeLibrary = data => {
		setCurrentLibrary(data);
	};

	return (
		<div className='main-shelves'>
			<div className='main-shelves__header'>
				<h4>Tủ sách của tôi</h4>
				<SearchField placeholder='Tìm kiếm sách' className='main-shelves__search' />
			</div>
			<div className='main-shelves__pane'>
				<div className='main-shelves__filters'>
					<SelectBox
						name='library'
						list={libraryList}
						defaultOption={currentLibrary}
						onChangeOption={onChangeLibrary}
					/>
					<Button className='btn-private' isOutline={true} onClick={handlePublic}>
						<EyeIcon isPublic={isPublic} handlePublic={handlePublic} />
						<span>{isPublic ? 'Công khai' : 'Không công khai'}</span>
					</Button>
				</div>
				{/* <SearchBook/> */}
				<Shelf list={allBooks.rows} isMyShelve={true} />
				{allBooks.count > 10 && <PaginationGroup />}
				<Modal className='main-shelves__modal' show={modalOpen} onHide={toggleModal} keyboard={false} centered>
					<span className='btn-closeX' onClick={toggleModal}>
						<CloseX />
					</span>
					<ModalBody>
						<h4 className='main-shelves__modal__title'>Bạn có muốn xóa cuốn sách?</h4>
						<p className='main-shelves__modal__subtitle'>
							{' '}
							Cuốn sách sẽ được xoá khỏi giá sách “giasach2022”
						</p>
						<button className='btn main-shelves__modal__btn-delete btn-danger'>Xóa</button>
						<button className='btn-cancel' onClick={toggleModal}>
							Không
						</button>
					</ModalBody>
				</Modal>
			</div>
		</div>
	);
};

MainShelves.propTypes = {};

export default MainShelves;
