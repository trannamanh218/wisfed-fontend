import { toSlug } from './Common';

class RouteLink {
	categoryDetail(id, name) {
		return `/category/detail/${id}/${toSlug(name)}`;
	}
}

export default new RouteLink();
