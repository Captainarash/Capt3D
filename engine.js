var Vertex = function(x, y, z) {
	this.x = parseFloat(x);
	this.y = parseFloat(y);
	this.z = parseFloat(z);
};

var Vertex2D = function(x, y) {
	this.x = parseFloat(x);
	this.y = parseFloat(y);
};

var Pyramid = function(center, side) {
	var d = side / 2;

	this.vertices = [
		new Vertex(center.x, center.y, center.z + d),
		new Vertex(center.x - d, center.y - d, center.z - d),
		new Vertex(center.x - d, center.y + d, center.z - d),
		new Vertex(center.x + d, center.y - d, center.z - d),
		new Vertex(center.x + d, center.y + d, center.z - d)
	];

	this.faces = [
		[this.vertices[1],this.vertices[3],this.vertices[4],this.vertices[2]],
		[this.vertices[4],this.vertices[3],this.vertices[0]],
		[this.vertices[1],this.vertices[3],this.vertices[0]],
		[this.vertices[1],this.vertices[2],this.vertices[0]],
		[this.vertices[2],this.vertices[4],this.vertices[0]]
	];
};

var Cube = function(center, side) {

	var d = side / 2;

	this.vertices = [
		new Vertex(center.x - d, center.y - d, center.z + d),
		new Vertex(center.x - d, center.y - d, center.z - d),
		new Vertex(center.x + d, center.y - d, center.z - d),
		new Vertex(center.x + d, center.y - d, center.z + d),
		new Vertex(center.x + d, center.y + d, center.z + d),
		new Vertex(center.x + d, center.y + d, center.z - d),
		new Vertex(center.x - d, center.y + d, center.z - d),
		new Vertex(center.x - d, center.y + d, center.z + d)
	];


	this.faces = [
			[this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
			[this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
			[this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
			[this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
			[this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
			[this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
		];
};

function project(M) {
	return new Vertex2D(M.x,M.z);
}

function render(objects, ctx, dx, dy) {
	ctx.clearRect(0, 0, 2*dx, 2*dy);

	for (var i = 0; i < objects.length; i++) {

		for (var j = 0; j < objects[i].faces.length; j++) {

			var face = objects[i].faces[j];

			var P = project(face[0]);
			ctx.beginPath();
			ctx.moveTo(P.x + dx, -P.y + dy);

			for (var f = 1; f < face.length; f++) {
				P = project(face[f]);
				ctx.lineTo(P.x + dx, -P.y + dy);
			}
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		}
	}
}


function generatePyramid() {
	var canvas = document.getElementById('cnv');
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	var dx = canvas.width / 2;
	var dy = canvas.height / 2;

	var ctx = canvas.getContext('2d');
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
	ctx.fillStyle = 'rgba(0, 255, 150, 0.3)';
	var pyramid_center = new Vertex(0,11*dy/10,0);
	var pyramid = new Pyramid(pyramid_center,dy);
	var objects = [pyramid];
	render(objects, ctx, dx, dy);
	var mousedown = false;
	var mx = 0;
	var my = 0;

	canvas.addEventListener('mousedown', initMove);
	document.addEventListener('mousemove', move);
	document.addEventListener('mouseup', stopMove);

	function rotate(M, center, theta, phi) {

		var ct = Math.cos(theta);
		var st = Math.sin(theta);
		var cp = Math.cos(phi);
		var sp = Math.sin(phi);


		var x = M.x - center.x;
		var y = M.y - center.y;
		var z = M.z - center.z;

		M.x = ct * x - st * cp * y + st * sp * z + center.x;
		M.y = st * x + ct * cp * y - ct * sp * z + center.y;
		M.z = sp * y + cp * z + center.z;
	}

	function initMove(evt) {
		clearTimeout(autorotate_timeout);
		mousedown = true;
		mx = evt.clientX;
		my = evt.clientY;
	}

	function move(evt) {
		if (mousedown) {
			var theta = (evt.clientX - mx) * Math.PI / 360;
			var phi = (evt.clientY - my) * Math.PI / 180;

			for (var i = 0; i < 5; ++i)
				rotate(pyramid.vertices[i], pyramid_center, theta, phi);

			mx = evt.clientX;
			my = evt.clientY;

			render(objects, ctx, dx, dy);
		}
	}

	function stopMove() {
		mousedown = false;
		autorotate_timeout = setTimeout(autorotate, 1000);
	}

	function autorotate() {
		for (var i = 0; i < 5; ++i)
			rotate(pyramid.vertices[i], pyramid_center, -Math.PI / 720, Math.PI / 720);

		render(objects, ctx, dx, dy);

		autorotate_timeout = setTimeout(autorotate, 30);
	}
	autorotate_timeout = setTimeout(autorotate, 1000);
}

function generateCube() {
	var alerted = 0;
	var canvas = document.getElementById('cnv');
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	var dx = canvas.width / 2;
	var dy = canvas.height / 2;

	var ctx = canvas.getContext('2d');
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
	ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';

	var cube_center = new Vertex(0,11*dy/10,0);
	var cube = new Cube(cube_center,dy);

	var objects = [cube];

	render(objects, ctx, dx, dy);

	var mousedown = false;
	var mx = 0;
	var my = 0;

	canvas.addEventListener('mousedown', initMove);
	document.addEventListener('mousemove', move);
	document.addEventListener('mouseup', stopMove);

	function rotate(M, center, theta, phi) {

		var ct = Math.cos(theta);
		var st = Math.sin(theta);
		var cp = Math.cos(phi);
		var sp = Math.sin(phi);


		var x = M.x - center.x;
		var y = M.y - center.y;
		var z = M.z - center.z;

		M.x = ct * x - st * cp * y + st * sp * z + center.x;
		M.y = st * x + ct * cp * y - ct * sp * z + center.y;
		M.z = sp * y + cp * z + center.z;
	}

	function initMove(evt) {
		clearTimeout(autorotate_timeout);
		mousedown = true;
		mx = evt.clientX;
		my = evt.clientY;
	}

	function move(evt) {
		if (mousedown) {
			var theta = (evt.clientX - mx) * Math.PI / 360;
			var phi = (evt.clientY - my) * Math.PI / 180;

			for (var i = 0; i < 8; ++i)
				rotate(cube.vertices[i], cube_center, theta, phi);

			mx = evt.clientX;
			my = evt.clientY;

			render(objects, ctx, dx, dy);
		}
	}

	function stopMove() {
		mousedown = false;
		autorotate_timeout = setTimeout(autorotate, 1000);
	}

	function autorotate() {
		for (var i = 0; i < 8; ++i)
			rotate(cube.vertices[i], cube_center, -Math.PI / 720, Math.PI / 720);

		render(objects, ctx, dx, dy);

		autorotate_timeout = setTimeout(autorotate, 30);
	}
	autorotate_timeout = setTimeout(autorotate, 1000);
}
