import React, { useState, useEffect } from 'react';
import './chooseTopic.scss';
import Logo from 'assets/images/Logo 2.png';
import SearchField from 'shared/search-field';
import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getCategoryList } from 'reducers/redux-utils/category';
import { addToFavoriteCategory } from 'reducers/redux-utils/user';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ChooseTopic() {
	const [listCategory, setListCategory] = useState([]);
	const [addFavorite, setAddFavorite] = useState([]);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const getListCategory = async () => {
		const querry = {
			start: 0,
			limit: 26,
		};
		const listCategoryAction = await dispatch(getCategoryList(querry)).unwrap();
		setListCategory(listCategoryAction.rows);
	};

	const updateUser = async () => {
		try {
			const params = {
				id: 'bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
				favoriteCategory: addFavorite,
			};
			await dispatch(addToFavoriteCategory(params));
		} catch {
			toast.error('Lỗi hệ thống');
		} finally {
			navigate('/');
		}
	};

	useEffect(() => {
		getListCategory();
	}, []);

	const handleChange = e => {
		const keyData = Number(e.target.value);
		if (addFavorite.indexOf(keyData) !== -1) {
			addFavorite.splice(addFavorite.indexOf(keyData), 1);
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
					<SearchField placeholder='Tìm kiếm chủ đề' />
				</div>
				<div className='choose-topic__box'>
					{listCategory.map(item => {
						return (
							<>
								<div key={item.id} className='form-check-wrapper'>
									<Form.Check className='form-check-custom' type={'checkbox'} id={item.id}>
										<Form.Check.Input
											className={`form-check-custom--'checkbox'`}
											type={'checkbox'}
											isValid
											name={item.name}
											value={item.id}
											onClick={handleChange}
											// defaultChecked={data.value === value}
										/>
										<Form.Check.Label className='form-check-label--custom'>
											{item.name}
										</Form.Check.Label>
									</Form.Check>
								</div>
							</>
						);
					})}
				</div>
				<div
					className={'choose-topic__button ' + `${addFavorite.length >= 2 ? '' : 'disabled-bnt'}`}
					onClick={() => {
						updateUser();
					}}
				>
					<button>TIếp tục</button>
				</div>
			</div>
		</div>
	);
}

export default ChooseTopic;
