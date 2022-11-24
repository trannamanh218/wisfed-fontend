import NormalContainer from 'components/layout/normal-container';
import './result.scss';
import SearchButton from 'shared/search-button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BookSearch from './component/books-search';
import QuoteSearch from './component/quotes-search';
import GroupSearch from './component/group-search';
import AuthorSearch from './component/authors-search';
import UsersSearch from './component/users-search';
import CategorySearch from './component/category-search';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { hashtagRegex } from 'constants';
import { handleUpdateValueInputSearchRedux } from 'reducers/redux-utils/search';
import { useDispatch } from 'react-redux';
import Circle from 'shared/loading/circle';

const Result = () => {
	const { value } = useParams();
	const dispatch = useDispatch();

	const [activeKeyDefault, setActiveKeyDefault] = useState('books');
	const [searchResultInput, setSearchResultInput] = useState('');
	const [updateBooks, setUpdateBooks] = useState(false);
	const [firstTimeRender, setFirstTimeRender] = useState(true);

	const navigate = useNavigate();

	const handleChange = e => {
		setSearchResultInput(e.target.value);
	};

	const handleDirectParam = () => {
		if (searchResultInput) {
			const trimmedValue = searchResultInput.trim();

			// Kiểm tra xem có kí tự hashtag # không
			if (hashtagRegex.test(trimmedValue)) {
				const formatedInpSearchValue = trimmedValue
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/đ/g, 'd')
					.replace(/Đ/g, 'D')
					.replace(/#/g, '');
				navigate(`/hashtag/${formatedInpSearchValue}`);
			} else {
				navigate(`/result/q=${trimmedValue}`);
			}
		}
	};

	const handleClickSearch = () => {
		handleDirectParam();
	};

	const handleSelectKey = eventKey => {
		setActiveKeyDefault(eventKey);
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter' && e.target.value.trim().length) {
			dispatch(handleUpdateValueInputSearchRedux(''));
			handleDirectParam();
		}
	};

	useEffect(() => {
		setSearchResultInput(value);
		if (firstTimeRender) {
			setFirstTimeRender(false);
		} else {
			setUpdateBooks(!updateBooks);
		}
	}, [value]);

	return (
		<NormalContainer>
			<div className='result__container'>
				<div className='result__header'>
					<div className='result__header__content'>Kết quả tìm kiếm cho "{value}"</div>
				</div>
				<div className='result__search'>
					<div className='friends__header'>
						<SearchButton
							handleChange={handleChange}
							value={searchResultInput}
							handleClickSearch={handleClickSearch}
							onKeyDown={handleKeyDown}
						/>
					</div>
				</div>
				<div className='result__main'>
					<Tabs
						defaultActiveKey={'books'}
						activeKey={activeKeyDefault}
						onSelect={eventKey => handleSelectKey(eventKey)}
					>
						<Tab eventKey='books' title='Sách'>
							<BookSearch
								activeKeyDefault={activeKeyDefault}
								searchResultInput={searchResultInput}
								value={value}
								updateBooks={updateBooks}
							/>
						</Tab>
						<Tab eventKey='authors' title='Tác giả'>
							<AuthorSearch
								activeKeyDefault={activeKeyDefault}
								searchResultInput={searchResultInput}
								value={value}
								updateBooks={updateBooks}
							/>
						</Tab>
						<Tab eventKey='users' title='Mọi người'>
							<UsersSearch
								activeKeyDefault={activeKeyDefault}
								searchResultInput={searchResultInput}
								value={value}
								updateBooks={updateBooks}
							/>
						</Tab>
						<Tab eventKey='categories' title='Chủ đề'>
							<CategorySearch
								activeKeyDefault={activeKeyDefault}
								searchResultInput={searchResultInput}
								value={value}
								updateBooks={updateBooks}
							/>
						</Tab>
						<Tab eventKey='quotes' title='Quotes'>
							<QuoteSearch
								activeKeyDefault={activeKeyDefault}
								searchResultInput={searchResultInput}
								value={value}
								updateBooks={updateBooks}
							/>
						</Tab>
						<Tab eventKey='groups' title='Nhóm'>
							<GroupSearch
								activeKeyDefault={activeKeyDefault}
								searchResultInput={searchResultInput}
								value={value}
								updateBooks={updateBooks}
							/>
						</Tab>
					</Tabs>
				</div>
			</div>
		</NormalContainer>
	);
};

export default Result;
