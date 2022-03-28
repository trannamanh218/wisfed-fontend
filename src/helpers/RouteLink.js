import { toSlug } from './Common';

class RouteLink {
	categoryDetail(id, name) {
		return `/category/detail/${id}/${toSlug(name)}`;
	}

	bookDetail(id, name) {
		return `/book/detail/${id}/${toSlug(name)}`;
	}

	reviewBookDetail(id, name) {
		return `/review/${id}/${toSlug(name)}`;
	}
}

export default new RouteLink();
