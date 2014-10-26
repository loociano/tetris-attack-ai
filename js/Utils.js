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
function matrix3dToArray(str){
	str = str.substr("matrix3d".length);
    return str.match(/(-?[0-9\.]+)/g);
}

/** Returns the CSS transform matrix given an array of 6 elements */ 
function arrayToMatrix(array) {
	return "matrix("+array[0]+","+array[1]+","+array[2]+","+array[3]+","+array[4]+","+array[5]+")";
};

/** Returns the CSS transform matrix given an array of 16 elements */ 
function arrayToMatrix3d(array) {
	var result = "matrix3d("
	for (var i = 0; i < array.length; i++){
		result += array[i];
		if (i < array.length-1)
			result += ",";
		else
			result += ")";
	}
	return result;
};

/** Returns the CSS transform horizontal position given an HTML Element */
function getPositionX(elt) {
	return parseFloat(matrixToArray(elt.style.transform)[4]);
}

/** Returns the CSS transform horizontal position given an HTML Element */
function get3dPositionX(elt) {
	return parseFloat(matrixToArray(elt.style.transform)[12]);
}

/** Returns the CSS transform vertical position given an HTML Element */
function getPositionY(elt){
	return parseFloat(matrixToArray(elt.style.transform)[5]);
}

/** Returns the CSS transform vertical position given an HTML Element */
function get3dPositionY(elt){
	return parseFloat(matrixToArray(elt.style.transform)[13]);
}

/** Returns the CSS transform vertical position given an HTML Element */
function get3dPositionZ(elt){
	return parseFloat(matrixToArray(elt.style.transform)[14]);
}

/** Sets the CSS transform horizontal position for an HTML Element */
function setPositionX(elt, x) {
	var array = matrixToArray(elt.style.transform);
	array[4] = x;
	elt.style.transform = arrayToMatrix(array);
}

/** Sets the CSS transform vertical position for an HTML Element */
function setPositionY(elt, y) {
	var array = matrixToArray(elt.style.transform);
	array[5] = y;
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

/** Sets the CSS transform 3d position for an HTML Element */
function set3dPosition(elt, x, y, z) {
	var array = get3dPosition(elt);
	array[12] = x;
	array[13] = y;
	array[14] = z;
	elt.style.transform = arrayToMatrix3d(array);
};

function set3dPositionArray(elt, array){
	elt.style.transform = arrayToMatrix3d(array);
};

/** Sets an element to the back: rotate 180deg and position */
function setBack(elt, x, y, z){
	var array = get3dPosition(elt);
	array[5] = -array[5];
	array[10] = -array[10];
	set3dPositionArray(elt, array);
	set3dPosition(elt, x, -y, -z);
};

/** Sets an element to the right: rotate +90deg and position it */
function setRight(elt, x, y, z){
	rotateRight(elt);
	set3dPosition(elt, z, y, x);
};

/** Rotates an element 90deg to the right */
function rotateRight(elt){
	var array = get3dPosition(elt);
	array[0] = "0";
	array[2] = "-1";
	set3dPositionArray(elt, array);
};

/** Sets an element to the left and positions it */
function setLeft(elt, x, y, z){
	rotateLeft(elt);
	set3dPosition(elt, -z, y, x);
}

/** Rotates an element 90deg to the left */
function rotateLeft(elt){
	var array = get3dPosition(elt);
	array[0] = "0";
	array[2] = "1";
	set3dPositionArray(elt, array);
};

/** Sets an element to the top and positions it */
function setTop(elt, x, y, z){
	rotateTop(elt);
	set3dPosition(elt, x, -z, y);
};

/** Rotates an element 90deg to the top */
function rotateTop(elt){
	var array = get3dPosition(elt);
	array[0] = "1";
	array[5] = "0";
	array[6] = "1";
	array[9] = "-1";
	set3dPositionArray(elt, array);
};

/** Sets an element to the bottom and positions it */
function setBottom(elt, x, y, z){
	rotateTop(elt);
	set3dPosition(elt, x, z, y);
};

/** Rotates an element to the bottom */
function rotateBottom(elt){
	var array = get3dPosition(elt);
	array[0] = "1";
	array[5] = "0";
	array[6] = "-1";
	array[9] = "1";
	set3dPositionArray(elt, array);
};

/** Returns the 3d position */
function get3dPosition(elt){
	var array = matrix3dToArray(elt.style.transform);
	if (array == null) 
		array = ["1", "0", "0", "0", "0", "1", "0", "0", "0", "0", "1", "0", "0", "0", "0", "1"];
	return array;
};

/** Switches css class */
function switchClass(elt, oldClass, newClass){
	if (elt.classList.contains(oldClass)){
		elt.classList.remove(oldClass);
	}
	
	elt.classList.add(newClass);
};