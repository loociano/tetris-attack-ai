/** 
 * Util functions
 * 
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */

/** Returns the CSS transform matrix given an HTML Element */ 
function matrixToArray(str){
    return str.match(/(-?[0-9\.]+)/g);
}

/** Returns the CSS transform matrix given an HTML Element */ 
function arrayToMatrix(array) {
	return "matrix("+array[0]+","+array[1]+","+array[2]+","+array[3]+","+array[4]+","+array[5]+")";
};

/** Returns the CSS transform horizontal position given an HTML Element */
function getPositionX(elt) {
	return parseFloat(matrixToArray(elt.style.transform)[4]);
}

/** Returns the CSS transform vertical position given an HTML Element */
function getPositionY(elt){
	return parseFloat(matrixToArray(elt.style.transform)[5]);
}

/** Sets the CSS transform vertical position for an HTML Element */
function setPositionY(elt, y) {
	var array = matrixToArray(elt.style.transform);
	array[5] = y;
	elt.style.transform = arrayToMatrix(array);
}

/** Sets the CSS transform horizontal position for an HTML Element */
function setPositionX(elt, x) {
	var array = matrixToArray(elt.style.transform);
	array[4] = x;
	elt.style.transform = arrayToMatrix(array);
}

/** Sets the CSS transform vertical position for an HTML Element */
function addOffsetY(elt, offset) {

	var array = matrixToArray(elt.style.transform);
	var y = parseFloat(array[5]);
	y += offset;

	if (y < 0) {
		return false;
	} else {
		array[5] = y.toString();
		elt.style.transform = arrayToMatrix(array);
		return true;
	}
};