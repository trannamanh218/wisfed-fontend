import './authors-search.scss';
import AuthorCard from 'shared/author-card';
import { data } from '../json';
const AuthorSearch = () => {
	return (
		<div className='authors__search__container'>
			<AuthorCard item={data} size={'lg'} checkAuthors={true} />
		</div>
	);
};

export default AuthorSearch;
