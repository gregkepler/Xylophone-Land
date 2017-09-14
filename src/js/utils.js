
export var mix = (pt1, pt2, a) => {
	let p1 = pt1.clone().multiplyScalar(1.0 - a);
	let p2 = pt2.clone().multiplyScalar(a);
	return p1.add(p2);
}