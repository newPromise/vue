function quickSort(arr) {
	if (arr.length <= 1) {
		return arr;
	}
	let leftArr = [];
	let rightArr = [];
	let first = arr[0];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] < first) {
			leftArr.push(arr[i]);
		} else if (arr[i] > first) {
			rightArr.push(arr[i]);
		}
	}
	return [].concat(quickSort(leftArr), [first], quickSort(rightArr));
}