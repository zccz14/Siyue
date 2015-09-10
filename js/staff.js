;
(function($) {
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
	var display = false;
	var $el;
	$.get('php/staff.php', function(data) {
		table = (eval(data));
		init();
		animate();
	});

	$('#container').click(function() {
		if (!display)
			$('#info').html('');
		display = false;
	});

	function init() {
		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 1000;
		scene = new THREE.Scene();
		// 表
		for (var i = 0; i < table.length; i++) {
			var it = table[i];
			$el = $('<div/>').addClass('element').append(
				$('<div/>').addClass('index').html(it.idx)
			).append(
				$('<div/>').addClass('class').html(it.major + it.class)
			).append(
				$('<div/>').addClass('name').html(it.name)
			).append(
				$('<div/>').addClass('details').html(it.dept + '<br/>' + it.y_start + '-' + it.y_end)
			).append(
				$('<div/>').addClass('intro').html(it.name)
			);
			//初始随机数字
			var object = new THREE.CSS3DObject($el[0]);
			object.position.x = Math.random() * 4000 - 2000;
			object.position.y = Math.random() * 4000 - 2000;
			object.position.z = Math.random() * 4000 - 2000;
			scene.add(object);
			objects.push(object);

			if (counts[it.y_start] == undefined) counts[it.y_start] = 0;
			counts[it.y_start] ++;
			//
			var object = new THREE.Object3D();
			object.position.x = (counts[it.y_start] * 140) - 800;
			object.position.y = -((it.y_start - 2015) * 180);
			//动画位置
			targets.table.push(object);

			$el.click(function() {
				display = true;
				var it = table[$(this).children('.index').html() - 1];
				$("#info").html(it.dept + it.pos + '-' + it.name + '<br />' + it.major + it.class);
			});

		}
		// 球面
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
		// 螺旋面
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
		// 网格
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
		$(renderer.domElement).css('position', 'absolute');
		$('#container').append(renderer.domElement);
		//控制器
		controls = new THREE.TrackballControls(camera, renderer.domElement);
		$(controls).attr({
				'rotateSpeed': 1,
				'minDistance': 1,
				'maxDistance': 6000
			})
			.change(render);

		//按钮们
		$('#table').click(function() {
			transform(targets.table, 2000);
		});
		$('#sphere').click(function() {
			transform(targets.sphere, 2000);
		});
		$('#helix').click(function() {
			transform(targets.helix, 2000);
		});
		$('#grid').click(function() {
			transform(targets.grid, 2000);
		});
		transform(targets.table, 2000);
		//
		$(window).resize(function() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
			render();
		});

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

	function animate() {
		requestAnimationFrame(animate);
		TWEEN.update();
		controls.update();
	}

	function render() {
		renderer.render(scene, camera);
	}
})(jQuery);