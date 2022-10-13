import { BackArrow } from 'components/svg';
import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from './mainLayout';
import SidebarLeft from './sidebarLeft';
import PopupCreateGroup from '../PopupCreateGroup';
import { getMyAdminGroup, getMyGroup } from 'reducers/redux-utils/group';
import './style.scss';
import { useDispatch } from 'react-redux';
import GroupPageLayout from 'components/layout/group-layout';
import SearchField from 'shared/search-field';
import _ from 'lodash';
import { NotificationError } from 'helpers/Error';
import { useVisible } from 'shared/hooks';
import MainLayoutSearch from './MainLayoutSearch';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Layout from 'components/layout';

export const SearchGroup = ({ valueInput, handleChange, handleShowModal, title }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const handleClick = () => {
		if (location.pathname.includes('/group')) {
			navigate('/');
		} else {
			navigate('/group');
		}
	};

	return (
		<div className='search-group-container'>
			<div className='group-btn-back'>
				<button onClick={() => handleClick()}>
					<BackArrow />
				</button>
				<span>{title}</span>
			</div>
			<div className='search'>
				<SearchField placeholder='Tìm kiếm group' handleChange={handleChange} value={valueInput} />
				<button onClick={() => handleShowModal()}>Tạo nhóm</button>
			</div>
		</div>
	);
};

const LayoutGroup = () => {
	const [myGroup, setMyGroup] = useState([]);
	const [adminGroup, setAdminGroup] = useState([]);
	const [inputSearchValue, setInputSearchValue] = useState('');
	const [valueGroupSearch, setValueGroupSearch] = useState('');
	const [show, setShow] = useState(false);

	const { ref: showRef } = useVisible(false);

	const dispatch = useDispatch();

	const listMyGroup = async () => {
		try {
			const actionListMyGroup = await dispatch(getMyGroup()).unwrap();
			setMyGroup(actionListMyGroup.data);
		} catch (error) {
			NotificationError(error);
		}
	};

	const listAdminMyGroup = async () => {
		try {
			const actionlistAdminMyGroup = await dispatch(getMyAdminGroup()).unwrap();
			setAdminGroup(actionlistAdminMyGroup.data);
		} catch (error) {
			NotificationError(error);
		}
	};

	useEffect(() => {
		listMyGroup();
		listAdminMyGroup();
	}, []);

	const handleChange = e => {
		setInputSearchValue(e.target.value);
		debounceSearch(e.target.value);
	};

	const updateInputSearch = value => {
		const filterValue = value.toLowerCase().trim();
		setValueGroupSearch(filterValue);
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 700), []);

	const handleCloseModal = () => setShow(false);

	return (
		<Layout>
			<div className='groups-container'>
				{!valueGroupSearch.trim().length ? (
					<GroupPageLayout
						sub={
							<SearchGroup
								title='Nhóm'
								handleChange={handleChange}
								valueInput={inputSearchValue}
								handleShowModal={() => setShow(true)}
							/>
						}
						right={
							(myGroup.length > 0 || adminGroup.length > 0) && (
								<SidebarLeft listMyGroup={myGroup} listAdminMyGroup={adminGroup} />
							)
						}
						main={<MainLayout listMyGroup={myGroup} listAdminMyGroup={adminGroup} />}
					/>
				) : (
					<div className='result-search'>
						<GroupPageLayout
							sub={
								<SearchGroup
									title='Nhóm'
									handleChange={handleChange}
									valueInput={inputSearchValue}
									handleShowModal={() => setShow(true)}
								/>
							}
							main={<MainLayoutSearch valueGroupSearch={valueGroupSearch} />}
						/>
					</div>
				)}

				<Modal className='create-group-modal' show={show} onHide={handleCloseModal}>
					<Modal.Body>
						<PopupCreateGroup handleClose={handleCloseModal} showRef={showRef} />
					</Modal.Body>
				</Modal>
			</div>
		</Layout>
	);
};

SearchGroup.propTypes = {
	valueInput: PropTypes.string,
	handleChange: PropTypes.func,
	handleShowModal: PropTypes.func,
	title: PropTypes.string,
};

export default LayoutGroup;
