import PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
import Input from 'shared/input';
import StatisticList from 'shared/statistic-list';
import { nameBookShelve } from 'helpers/Validation';
import { useDispatch, useSelector } from 'react-redux';
import { createLibrary, updateMyAllLibraryRedux } from 'reducers/redux-utils/library';
import { toast } from 'react-toastify';
import './my-shelves-list.scss';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';

const MyShelvesList = ({ list }) => {
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);
	const params = useParams();

	const handleSubmit = async (values, { resetForm }) => {
		const name = values.name.trim();

		if (name) {
			const params = { name };
			try {
				await dispatch(createLibrary(params)).unwrap();
				dispatch(updateMyAllLibraryRedux());
				toast.success('Tạo thư viện thành công!');
			} catch (err) {
				NotificationError(err);
			} finally {
				resetForm();
			}
		}
	};

	const checkAuthorize = () => {
		if (userInfo.id === params.userId) {
			return true;
		} else {
			return false;
		}
	};

	return (
		<div>
			<StatisticList
				className='my-shelves-list'
				title='Giá sách'
				background='light'
				isBackground={false}
				list={list}
				pageText={false}
			/>

			{checkAuthorize() && (
				<Formik
					initialValues={{
						name: '',
					}}
					validationSchema={nameBookShelve}
					onSubmit={handleSubmit}
				>
					<Form>
						<Field name='name'>
							{({ field, meta }) => {
								return (
									<>
										<Input
											className='my-shelves__input'
											type='text'
											placeholder='Nhập để thêm giá sách'
											{...field}
										/>
										{meta.touched && meta.error && (
											<small className='error-message'>{meta.error}</small>
										)}
									</>
								);
							}}
						</Field>
						<button type='submit' className='my-shelves__btn__submit btn btn-primary'>
							Áp dụng
						</button>
					</Form>
				</Formik>
			)}
		</div>
	);
};

MyShelvesList.defaultProps = {
	list: [],
};

MyShelvesList.propTypes = {
	list: PropTypes.array,
};

export default MyShelvesList;
