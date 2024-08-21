import {WebGLCanvas} from '../../base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../../base/helpers/WebGLShader.js';
import {Camera} from '../../base/helpers/Camera.js';
/**
 * Et WebGL-program som tegner en enkel torus.
 */

export function main() {
	// Oppretter et canvas for WebGL-tegning:
	const canvas = new WebGLCanvas('myCanvas', document.body, 960, 640);

	// Starter med å laste teksturer:

	// Hjelpeobjekt som holder på objekter som trengs for rendring:
	const renderInfo = {
		gl: canvas.gl,
		baseShader: initBaseShaders(canvas.gl),
		cubeShader: initCubeShaders(canvas.gl),
		coordBuffers: initCoordBuffers(canvas.gl),
		cubeBuffers: initCubeBuffers(canvas.gl),
		currentlyPressedKeys: [],
	};

	initKeyPress(renderInfo);
	const camera = new Camera(renderInfo.gl, renderInfo.currentlyPressedKeys);
	camera.camPosX = 5;
	camera.camPosY = 5;
	camera.camPosZ = 5;
	animate( 0, renderInfo, camera);
}

/**
 * Knytter tastatur-evnents til eventfunksjoner.
 */
function initKeyPress(renderInfo) {
	document.addEventListener('keyup', (event) => {
		renderInfo.currentlyPressedKeys[event.code] = false;
	}, false);
	document.addEventListener('keydown', (event) => {
		renderInfo.currentlyPressedKeys[event.code] = true;
	}, false);
}

function initBaseShaders(gl) {
	// Leser shaderkode fra HTML-fila: Standard/enkel shader (posisjon og farge):
	let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
	let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

	// Initialiserer  & kompilerer shader-programmene;
	const glslShader = new WebGLShader(gl, vertexShaderSource, fragmentShaderSource);

	// Samler all shader-info i ET JS-objekt, som returneres.
	return  {
		program: glslShader.shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexPosition'),
			vertexColor: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexColor'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uModelViewMatrix'),
		},
	};
}

function initCubeShaders(gl) {
	// Leser shaderkode fra HTML-fila: Standard/enkel shader (posisjon og farge):
	let vertexShaderSource = document.getElementById('texture-vertex-shader').innerHTML;
	let fragmentShaderSource = document.getElementById('texture-fragment-shader').innerHTML;

	// Initialiserer  & kompilerer shader-programmene;
	const glslShader = new WebGLShader(gl, vertexShaderSource, fragmentShaderSource);

	// Samler all shader-info i ET JS-objekt, som returneres.
	return  {
		program: glslShader.shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexPosition'),
			vertexColor: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexColor'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uModelViewMatrix'),
		},
	};
}

/**
 * Oppretter verteksbuffer for koordinatsystemet.
 * 6 vertekser, 2 for hver akse.
 * Tegnes vha. gl.LINES
 * Et posisjonsbuffer og et fargebuffer.
 * MERK: Må være likt antall posisjoner og farger.
 */
function initCoordBuffers(gl) {
	const extent =  100;

	const positions = new Float32Array([
		-extent, 0, 0,
		extent, 0, 0,
		0, -extent, 0,
		0, extent, 0,
		0, 0, -extent,
		0, 0, extent
	]);

	const colors = new Float32Array([
		1,0,0,1,   //R G B A
		1,0,0,1,   //R G B A
		0,1,0,1,   //R G B A
		0,1,0,1,   //R G B A
		0,0,1,1,   //R G B A
		0,0,1,1,   //R G B A
	]);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		color: colorBuffer,
		vertexCount: positions.length/3
	};
}

function initCubeBuffers(gl) {
	let positions = [
		//Forsiden (pos):
		-1, 1, 1,
		-1,-1, 1,
		1,-1, 1,

		-1,1,1,
		1, -1, 1,
		1,1,1,

		//H�yre side:

		1,1,1,
		1,-1,1,
		1,-1,-1,

		1,1,1,
		1,-1,-1,
		1,1,-1,

		//Baksiden (pos):
		1,-1,-1,
		-1,-1,-1,
		1, 1,-1,

		-1,-1,-1,
		-1,1,-1,
		1,1,-1,

		//Venstre side:
		-1,-1,-1,
		-1,1,1,
		-1,1,-1,

		-1,-1,1,
		-1,1,1,
		-1,-1,-1,

		//Topp:
		-1,1,1,
		1,1,1,
		-1,1,-1,

		-1,1,-1,
		1,1,1,
		1,1,-1,

		//Bunn:
		-1,-1,-1,
		1,-1,1,
		-1,-1,1,

		-1,-1,-1,
		1,-1,-1,
		1,-1,1,
	];

	let color1 = {red: 1.0, green: 0.0, blue: 0.0, alpha: 0.7}
	let color2 = {red: 0.45, green: 1.0, blue: 0.0, alpha: 0.7}
	let color3 = {red: 0.0, green: 0.0, blue: 1.0, alpha: 0.7}

	let colors = [];
	//Samme farge på alle sider:
	for (let i = 0; i < 12; i++) {
		colors.push(color1.red, color1.green, color1.blue, color1.alpha);
	}
	for (let i = 0; i < 12; i++) {
		colors.push(color2.red, color2.green, color2.blue, color2.alpha);
	}
	for (let i = 0; i < 12; i++) {
		colors.push(color3.red, color3.green, color3.blue, color3.alpha);
	}

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		color: colorBuffer,
		vertexCount: positions.length/3,
	};
}

/**
 * Aktiverer position-bufferet.
 * Kalles fra draw()
 */
function connectPositionAttribute(gl, baseShader, positionBuffer) {
	const numComponents = 3;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(
		baseShader.attribLocations.vertexPosition,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(baseShader.attribLocations.vertexPosition);
}

/**
 * Aktiverer color-bufferet.
 * Kalles fra draw()
 */
function connectColorAttribute(gl, baseShader, colorBuffer) {
	const numComponents = 4;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(
		baseShader.attribLocations.vertexColor,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(baseShader.attribLocations.vertexColor);
}

/**
 * Klargjør canvaset.
 * Kalles fra draw()
 */
function clearCanvas(gl) {
	gl.clearColor(0.9, 0.9, 0.9, 1);  // Clear screen farge.
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);           // Enable "depth testing".
	gl.depthFunc(gl.LEQUAL);            // Nære objekter dekker fjerne objekter.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function animate(currentTime, renderInfo, camera) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime, renderInfo, camera);
	});

	// Finner tid siden siste kall på draw().
	let elapsed = getElapsed(currentTime, renderInfo);
	camera.handleKeys(elapsed);
	draw(currentTime, renderInfo, camera);
}

/**
 * Beregner forløpt tid siden siste kall.
 * @param currentTime
 * @param renderInfo
 */
function getElapsed(currentTime, renderInfo) {
	let elapsed = 0.0;
	if (renderInfo.lastTime !== 0.0)	// Først gang er lastTime = 0.0.
		elapsed = (currentTime - renderInfo.lastTime)/1000; // Deler på 1000 for å operere med sekunder.
	renderInfo.lastTime = currentTime;						// Setter lastTime til currentTime.
	return elapsed;
}

/**
 * Tegner!
 */
function draw(currentTime, renderInfo, camera) {
	clearCanvas(renderInfo.gl);

	renderInfo.gl.enable(renderInfo.gl.BLEND);
	renderInfo.gl.blendEquation(renderInfo.gl.FUNC_ADD);
	renderInfo.gl.blendFunc(renderInfo.gl.SRC_ALPHA, renderInfo.gl.ONE_MINUS_SRC_ALPHA);

	//** TEGN ALLE UGJENNOMSIKTIGE OBJEKTER FØRST:
	// ** Slår PÅ depthMask:
	renderInfo.gl.depthMask(true);
	drawCoord(renderInfo, camera);

	//** TEGN ALLE GJENNOMSIKTIGE OBJEKTER, I REKKEFØLGE:
	//** Slår AV depthMask (endrer dermed ikke DEPTH-BUFFER):
	renderInfo.gl.depthMask(false);
	drawCube(renderInfo, camera)
}


function drawCoord(renderInfo, camera) {
	// Aktiver shader:
	renderInfo.gl.useProgram(renderInfo.baseShader.program);

	// Kople posisjon og farge-attributtene til tilhørende buffer:
	connectPositionAttribute(renderInfo.gl, renderInfo.baseShader, renderInfo.coordBuffers.position);
	connectColorAttribute(renderInfo.gl, renderInfo.baseShader, renderInfo.coordBuffers.color);

	let modelMatrix = new Matrix4();
	modelMatrix.setIdentity();
	camera.set();
	let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix)); // NB! rekkefølge!
	// Send kameramatrisene til shaderen:
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShader.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShader.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);
	// Tegn coord:
	renderInfo.gl.drawArrays(renderInfo.gl.LINES, 0, renderInfo.coordBuffers.vertexCount);
}

function drawCube(renderInfo, camera) {
	// Aktiver shader:
	renderInfo.gl.useProgram(renderInfo.cubeShader.program);

	// Kople posisjon og farge-attributtene til tilhørende buffer:
	connectPositionAttribute(renderInfo.gl, renderInfo.cubeShader, renderInfo.cubeBuffers.position);
	connectColorAttribute(renderInfo.gl, renderInfo.cubeShader, renderInfo.cubeBuffers.color);

	let modelMatrix = new Matrix4();
	modelMatrix.setIdentity();
	camera.set();
	let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix)); // NB! rekkefølge!
	renderInfo.gl.uniformMatrix4fv(renderInfo.cubeShader.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.cubeShader.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);

	// Bruker culling for korrekt blending:
	renderInfo.gl.frontFace(renderInfo.gl.CCW);     // Angir vertekser CCW.
	renderInfo.gl.enable(renderInfo.gl.CULL_FACE);  // Aktiverer culling.

	//Tegner baksidene først:
	renderInfo.gl.cullFace(renderInfo.gl.FRONT);    // Skjuler forsider.
	renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLES, 0, renderInfo.cubeBuffers.vertexCount);

	//Tegner deretter forsidene:
	renderInfo.gl.cullFace(renderInfo.gl.BACK);     // Skjuler baksider.
	renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLES, 0, renderInfo.cubeBuffers.vertexCount);

	//renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLES, 0, renderInfo.cubeBuffers.vertexCount);
}
