var camera, scene, renderer;
var controls;
var objects = [];
var counts = [];
var targets = {
	table: [],
	sphere: [],
	helix: [],
	grid: []
};
init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 2000;
	scene = new THREE.Scene();
	// table
	for (var i = 0; i < table.length; i++) {
		var element = document.createElement('div');
		element.className = 'element';
		element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';
		var number = document.createElement('div');
		number.className = 'number';
		number.textContent = table[i][4];
		element.appendChild(number);
		var symbol = document.createElement('div');
		symbol.className = 'symbol';
		symbol.textContent = table[i][0];
		element.appendChild(symbol);
		
		var details = document.createElement('div');
		details.className = 'details';
		details.innerHTML = table[i][1] + '<br>' + table[i][2];
		element.appendChild(details);
		
		var intro = document.createElement("div");
		intro.className='intro';
		intro.innerHTML=table[i][5];
		element.appendChild(intro);
		
		
		var object = new THREE.CSS3DObject(element);
		object.position.x = Math.random() * 4000 - 2000;
		object.position.y = Math.random() * 4000 - 2000;
		object.position.z = Math.random() * 4000 - 2000;
		scene.add(object);
		objects.push(object);
		if (counts[table[i][3]] == undefined) counts[table[i][3]] = 0;
		counts[table[i][3]] ++;
		//
		var object = new THREE.Object3D();
		object.position.x = (counts[table[i][3]] * 140) - 800;
		object.position.y = -(table[i][3] * 180) + 990;
		targets.table.push(object);
	}
	// sphere
	var vector = new THREE.Vector3();
	for (var i = 0, l = objects.length; i < l; i++) {
		var phi = Math.acos(-1 + (2 * i) / l);
		var theta = Math.sqrt(l * Math.PI) * phi;
		var object = new THREE.Object3D();
		object.position.x = 800 * Math.cos(theta) * Math.sin(phi);
		object.position.y = 800 * Math.sin(theta) * Math.sin(phi);
		object.position.z = 800 * Math.cos(phi);
		vector.copy(object.position).multiplyScalar(2);
		object.lookAt(vector);
		targets.sphere.push(object);
	}
	// helix
	var vector = new THREE.Vector3();
	for (var i = 0, l = objects.length; i < l; i++) {
		var phi = i * 0.175 + Math.PI;
		var object = new THREE.Object3D();
		object.position.x = 900 * Math.sin(phi);
		object.position.y = -(i * 8) + 450;
		object.position.z = 900 * Math.cos(phi);
		vector.x = object.position.x * 2;
		vector.y = object.position.y;
		vector.z = object.position.z * 2;
		object.lookAt(vector);
		targets.helix.push(object);
	}
	// grid
	for (var i = 0; i < objects.length; i++) {
		var object = new THREE.Object3D();
		object.position.x = ((i % 5) * 400) - 800;
		object.position.y = (-(Math.floor(i / 5) % 5) * 400) + 800;
		object.position.z = (Math.floor(i / 25)) * 1000 - 2000;
		targets.grid.push(object);
	}
	//
	renderer = new THREE.CSS3DRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = 'absolute';
	document.getElementById('container').appendChild(renderer.domElement);
	//控制器
	controls = new THREE.TrackballControls(camera, renderer.domElement);
	controls.rotateSpeed = 1;
	controls.minDistance = 1;
	controls.maxDistance = 6000;
	controls.addEventListener('change', render);
	//按钮们
	var button = document.getElementById('table');
	button.addEventListener('click', function(event) {
		transform(targets.table, 2000);
	}, false);
	var button = document.getElementById('sphere');
	button.addEventListener('click', function(event) {
		transform(targets.sphere, 2000);
	}, false);
	var button = document.getElementById('helix');
	button.addEventListener('click', function(event) {
		transform(targets.helix, 2000);
	}, false);
	var button = document.getElementById('grid');
	button.addEventListener('click', function(event) {
		transform(targets.grid, 2000);
	}, false);
	transform(targets.table, 2000);
	//
	window.addEventListener('resize', onWindowResize, false);
}

function transform(targets, duration) {
	TWEEN.removeAll();
	for (var i = 0; i < objects.length; i++) {
		var object = objects[i];
		var target = targets[i];
		new TWEEN.Tween(object.position)
			.to({
				x: target.position.x,
				y: target.position.y,
				z: target.position.z
			}, Math.random() * duration + duration)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start();
		new TWEEN.Tween(object.rotation)
			.to({
				x: target.rotation.x,
				y: target.rotation.y,
				z: target.rotation.z
			}, Math.random() * duration + duration)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start();
	}
	new TWEEN.Tween(this)
		.to({}, duration * 2)
		.onUpdate(render)
		.start();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	render();
}

function animate() {
	requestAnimationFrame(animate);
	TWEEN.update();
	controls.update();
}

function render() {
	renderer.render(scene, camera);
}

$('div.element').click(function(){
	var major = $(this).children('.number')[0].innerHTML;
	var name = $(this).children('.details')[0].innerHTML;
	var intro = $(this).children('.intro')[0].innerHTML;
	$("#info").html(name+'<br />'+major+'<br/>'+intro);
});

