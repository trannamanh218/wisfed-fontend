import { useState, useEffect } from 'react';
import './chooseTopic.scss';
import Logo from 'assets/images/Logo 2.png';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryList } from 'reducers/redux-utils/category';
import { editUserInfo } from 'reducers/redux-utils/user';
import { useNavigate } from 'react-router-dom';
import SearchIcon from 'assets/icons/search.svg';
import SearchCategoryChooseTopic from './searchCateChooseTopic';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';

function ChooseTopic() {
	const { userInfo } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [listCategory, setListCategory] = useState([]);
	const [listCategorySearched, setListCategorySearched] = useState([]);
	const [addFavorite, setAddFavorite] = useState([]);
	const [inputValue, setInputValue] = useState('');

	const getListCategory = async () => {
		let listCategoryActionArray = [];

		const params = {
			start: 0,
			limit: 10,
			filter: JSON.stringify([
				{
					operator: 'eq',
					value: true,
					property: 'isTopCategory',
				},
			]),
		};
		const listCategoryAction = await dispatch(getCategoryList({ option: false, params })).unwrap();
		listCategoryActionArray = listCategoryAction.rows;

		const totalCount = listCategoryAction.count;

		if (listCategoryAction.rows.length < totalCount) {
			// Chạy vòng lặp gọi toàn bộ chủ đề thuộc top
			for (let i = 10; i < totalCount; i += 10) {
				const params = {
					start: i,
					limit: 10,
					filter: JSON.stringify([
						{
							operator: 'eq',
							value: true,
							property: 'isTopCategory',
						},
					]),
				};
				const result = await dispatch(getCategoryList({ option: false, params })).unwrap();
				const haveBook = result.rows.filter(item => item.numberBooks > 0);
				listCategoryActionArray = listCategoryActionArray.concat(haveBook);
			}
		}

		setListCategory(listCategoryActionArray);
	};

	const handleSearchCategory = e => {
		setInputValue(e.target.value);
		setListCategorySearched(
			listCategory.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
		);
	};

	const updateUser = async () => {
		try {
			const params = {
				favoriteCategory: addFavorite,
			};
			await dispatch(editUserInfo(params)).unwrap();
		} catch (err) {
			NotificationError(err);
		} finally {
			navigate('/');
		}
	};

	useEffect(() => {
		if (!_.isEmpty(userInfo) && userInfo.favoriteCategory.length > 0) {
			navigate('/');
		} else {
			getListCategory();
		}
	}, [userInfo]);

	const handleChange = e => {
		const keyData = Number(e.target.value);
		if (addFavorite.indexOf(keyData) !== -1) {
			const removeItem = addFavorite[addFavorite.indexOf(keyData)];
			const newArr = addFavorite.filter(item => item !== removeItem);
			setAddFavorite(newArr);
		} else {
			const newFavorite = [...addFavorite, keyData];
			setAddFavorite(newFavorite);
		}
	};

	return (
		<div className='choose-topic__container'>
			<div className='choose-topic__header'>
				<img src={Logo} alt='img' />
			</div>
			<div className='choose-topic__body'>
				<div className='choose-topic__title'>
					<span>Lựa chọn ít nhất 03 chủ đề bạn yêu thích</span>
				</div>
				<div className='choose-topic__subcribe'>
					<span>
						Chúng tôi sử dụng lựa chọn chủ đề yêu thích của bạn để gợi ý các nội dung tốt nhất và phù hợp
						nhất cho bạn
					</span>
				</div>
				<div className='choose-topic__search'>
					<div className='search-field'>
						<img className='search-field__icon' src={SearchIcon} alt='search-icon' />
						<input
							className='search-field__input'
							placeholder='Tìm kiếm chủ đề'
							onChange={handleSearchCategory}
						/>
					</div>
				</div>
				<div className='choose-topic__box'>
					{inputValue === '' ? (
						<>
							{listCategory.map(item => {
								return (
									<>
										<div key={item.id} className='form-check-wrapper'>
											<Form.Check className='form-check-custom' type={'checkbox'} id={item.id}>
												<Form.Check.Input
													className={`form-check-custom--'checkbox'`}
													type={'checkbox'}
													name={item.name}
													checked={addFavorite.includes(item.id)}
													value={item.id}
													onClick={handleChange}
													readOnly
												/>
												<Form.Check.Label className='form-check-label--custom'>
													{item.name}
												</Form.Check.Label>
											</Form.Check>
										</div>
									</>
								);
							})}
						</>
					) : (
						<SearchCategoryChooseTopic
							searchCategories={listCategorySearched}
							addFavorite={addFavorite}
							handleChange={handleChange}
						/>
					)}
				</div>

				<div
					className={'choose-topic__button ' + `${addFavorite.length >= 3 ? '' : 'disabled-btn'}`}
					onClick={() => {
						updateUser();
					}}
				>
					<button>Tiếp tục</button>
				</div>
			</div>
		</div>
	);
}

export default ChooseTopic;
