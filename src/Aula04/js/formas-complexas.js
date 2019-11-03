function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  var scene = new THREE.Scene();
  initDefaultLighting(scene);
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -30;

  var step = 0;
  var spGroup;
  var spGroup02;

//CONTROLS------------------------------------------------------------------------------------------------------------

  // setup the control gui

  //CONTROL-01
  var controls = new function () {
    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;

    this.segments = 12;
    this.phiStart = 0;
    this.phiLength = 2 * Math.PI;

    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function () {
        return generatePoints(controls.segments, controls.phiStart, controls.phiLength)
      });
    };
  };

  //CONTROL-02
  var controls02 = new function () {
    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;

    this.segments = 12;
    this.phiStart = 0;
    this.phiLength = 2 * Math.PI;

    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls02, function () {
        return generatePoints02(controls02.segments, controls02.phiStart, controls02.phiLength)
      });
    };
  };

//GUI-------------------------------------------------------------------------------------------------------------------

  var gui = new dat.GUI();

  //FORMA01
  var forma01 = gui.addFolder("Forma01")
  forma01.add(controls, 'segments', 0, 50).step(1).onChange(controls.redraw);
  forma01.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
  forma01.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);

  // add a material section, so we can switch between materials
  forma01.add(controls,
    'appliedMaterial',
    { meshNormal: applyMeshNormalMaterial, meshStandard: applyMeshStandardMaterial }
  ).onChange(controls.redraw)

  forma01.add(controls, 'redraw');
  forma01.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
  forma01.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

  controls.redraw();
  render();

  //FORMA02
  var forma02 = gui.addFolder("Forma02")
  forma02.add(controls02, 'segments', 0, 50).step(1).onChange(controls02.redraw);
  forma02.add(controls02, 'phiStart', 0, 2 * Math.PI).onChange(controls02.redraw);
  forma02.add(controls02, 'phiLength', 0, 2 * Math.PI).onChange(controls02.redraw);
  
  // add a material section, so we can switch between materials
  forma02.add(controls02, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial,
    meshStandard: applyMeshStandardMaterial
  }).onChange(controls02.redraw)

  forma02.add(controls02, 'castShadow').onChange(function (e) { controls02.mesh.castShadow = e })
  forma02.add(controls02, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })
  forma02.add(controls02, 'redraw');

  controls02.redraw();




//GENERATE-POINTS-----------------------------------------------------------------------------------------------------------

  //POINTS-01
  function generatePoints() {

    if (spGroup) scene.remove(spGroup)
    // add 10 random spheres
    var points = [];
    for (var i = 0; i < 20; i++) {
      var randomX = -15 + Math.round(Math.random() * 30);
      var randomY = -15 + Math.round(Math.random() * 30);
      var randomZ = -15 + Math.round(Math.random() * 30);

      points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }

    spGroup = new THREE.Object3D();
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: false });
    points.forEach(function (point) {
      var spGeom = new THREE.SphereGeometry(0.2);
      var spMesh = new THREE.Mesh(spGeom, material);
      spMesh.position.copy(point);
      spGroup.add(spMesh);
    });
    // add the points as a group to the scene
    scene.add(spGroup);

    // use the same points to create a convexgeometry
    var convexGeometry = new THREE.ConvexGeometry(points);
    convexGeometry.computeVertexNormals();
    convexGeometry.computeFaceNormals();
    convexGeometry.normalsNeedUpdate = true;
    return convexGeometry;
  }

  //POINTS-02
  function generatePoints02(segments, phiStart, phiLength) {

    if (spGroup02) scene.remove(spGroup02)

    var points = [];
    var height = 5;
    var count = 30;
    for (var i = 0; i < count; i++) {
      points.push(
        new THREE.Vector2((Math.sin(i * 0.2) + Math.cos(i * 0.8)) * height + 12,
          (i - count) + count / 2));
    }

    spGroup02 = new THREE.Object3D();

    var material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: false });

    points.forEach(function (point) {
      var spGeom = new THREE.SphereGeometry(0.2);
      var spMesh = new THREE.Mesh(spGeom, material);
      spMesh.position.set(point.x, point.y, 0);

      spGroup02.add(spMesh);
    });
    // add the points as a group to the scene
    scene.add(spGroup02);

    // use the same points to create a LatheGeometry
    var latheGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
    return latheGeometry;
  }

  var step = 0;
  controls02.redraw();
  render();

//RENDER--------------------------------------------------------------------------------------------------

  function render() {
    stats.update();


    if (spGroup) {
      controls.mesh.rotation.y = step += 0.005
      controls.mesh.rotation.x = step
      controls.mesh.rotation.z = step
      controls.mesh.position.x = 50
      controls.mesh.position.z = 25

      spGroup.position.x = controls.mesh.position.x
      spGroup.position.z = controls.mesh.position.z
      spGroup.rotation.y = step
      spGroup.rotation.x = step
      spGroup.rotation.z = step
    }else{
      controls02.mesh.rotation.y = step += 0.005
      controls02.mesh.rotation.x = step
      controls02.mesh.rotation.z = step

      spGroup02.rotation.y = step
      spGroup02.rotation.x = step
      spGroup02.rotation.z = step
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}