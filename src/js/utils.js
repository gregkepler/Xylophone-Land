
export var mix = (pt1, pt2, a) => {
	var p1 = pt1.clone().multiplyScalar(1.0 - a);
	var p2 = pt2.clone().multiplyScalar(a);
	return p1.add(p2);
}