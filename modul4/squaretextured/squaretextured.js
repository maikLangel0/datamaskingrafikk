import {WebGLCanvas} from '../../base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../../base/helpers/WebGLShader.js';
import {Camera} from '../../base/helpers/Camera.js';
import {ImageLoader} from '../../base/helpers/ImageLoader.js';
import {isPowerOfTwo1} from '../../base/lib/utility-functions.js';

/**
 * Et WebGL-program som tegner et teksturert rektangel.
 */
export function main() {
	// Oppretter et canvas for WebGL-tegning:
	const canvas = new WebGLCanvas('myCanvas', document.body, 960, 640);

	// Starter med å laste teksturer:
	let imageLoader = new ImageLoader();
	let textureUrls = ['../../base/textures/bricks1.png'];
	imageLoader.load((textureImages) => {
		const textureImage = textureImages[0];
		if (isPowerOfTwo1(textureImage.width) && isPowerOfTwo1(textureImage.height)) {
			// Fortsetter:

			// Hjelpeobjekt som holder på objekter som trengs for rendring:
			const renderInfo = {
				gl: canvas.gl,
				baseShader: initBaseShaders(canvas.gl),
				textureShader: initTextureShaders(canvas.gl),
				coordBuffers: initCoordBuffers(canvas.gl),
				squareBuffers: initSquareTextureAndBuffers(canvas.gl, textureImage),
				currentlyPressedKeys: [],
				lastTime: 0,
				fpsInfo: {  // Brukes til å beregne og vise FPS (Frames Per Seconds):
					frameCount: 0,
					lastTimeStamp: 0
				}
			};

			initKeyPress(renderInfo);
			const camera = new Camera(renderInfo.gl, renderInfo.currentlyPressedKeys);
			animate( 0, renderInfo, camera);
		} else {
			console.log("Feil bildestørrelse");
		}
	}, textureUrls);
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

function initTextureShaders(gl) {
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
			vertexTextureCoordinate: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexTextureCoordinate'),
		},
		uniformLocations: {
			sampler: gl.getUniformLocation(glslShader.shaderProgram, 'uSampler'),
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

function initSquareTextureAndBuffers(gl, textureImage) {
	let positions = [
		-1, 1, 0,
		1, 1, 0,
		-1, -1, 0,
		1, -1, 0
	];

	let colors = [
		0, 1, 0, 1.0,
		0, 1, 0, 1.0,
		0, 1, 0, 1.0,
		0, 1, 0, 1.0,
	];

	let textureCoordinates = [
		0, 0,
		5, 0,
		0, 5,
		5, 5
	];

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	//Texture:
	const rectangleTexture = gl.createTexture();
	//Teksturbildet er nå lastet fra server, send til GPU:
	gl.bindTexture(gl.TEXTURE_2D, rectangleTexture);
	//Unngaa at bildet kommer opp-ned:
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);   //NB! FOR GJENNOMSIKTIG BAKGRUNN!! Sett også gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	//Laster teksturbildet til GPU/shader:
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
	//Teksturparametre:
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	gl.bindTexture(gl.TEXTURE_2D, null);

	const textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

	return  {
		position: positionBuffer,
		color: colorBuffer,
		texture: textureBuffer,
		textureObject: rectangleTexture,
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
 * Kopler til og aktiverer teksturkoordinat-bufferet.
 */
function connectTextureAttribute(gl, textureShader, textureBuffer, textureObject) {
	const numComponents = 2;    //NB!
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	//Bind til teksturkoordinatparameter i shader:
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.vertexAttribPointer(
		textureShader.attribLocations.vertexTextureCoordinate,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(textureShader.attribLocations.vertexTextureCoordinate);

	//Aktiver teksturenhet (0):
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureObject);
	//Send inn verdi som indikerer hvilken teksturenhet som skal brukes (her 0):
	let samplerLoc = gl.getUniformLocation(textureShader.program, textureShader.uniformLocations.sampler);
	gl.uniform1i(samplerLoc, 0);
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
	calculateFps(currentTime, renderInfo.fpsInfo);
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
 * Beregner og viser FPS.
 * @param currentTime
 * @param renderInfo
 */
function calculateFps(currentTime, fpsInfo) {
	if (!currentTime) currentTime = 0;
	// Sjekker om  ET sekund har forløpt...
	if (currentTime - fpsInfo.lastTimeStamp >= 1000) {
		// Viser FPS i .html ("fps" er definert i .html fila):
		document.getElementById('fps').innerHTML = fpsInfo.frameCount;
		// Nullstiller fps-teller:
		fpsInfo.frameCount = 0;
		//Brukes for å finne ut om det har gått 1 sekund - i så fall beregnes FPS på nytt.
		fpsInfo.lastTimeStamp = currentTime;
	}
	// Øker antall frames per sekund:
	fpsInfo.frameCount++;
}

/**
 * Tegner!
 */
function draw(currentTime, renderInfo, camera) {
	clearCanvas(renderInfo.gl);
	// Tegn koordinatsystemet:
	drawCoord(renderInfo, camera);
	// Tegner torusen:
	drawSquare(renderInfo, camera);
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

function drawSquare(renderInfo, camera) {
	// Aktiver shader:
	renderInfo.gl.useProgram(renderInfo.textureShader.program);

	// Kople posisjon og farge-attributtene til tilhørende buffer:
	connectPositionAttribute(renderInfo.gl, renderInfo.textureShader, renderInfo.squareBuffers.position);
	connectColorAttribute(renderInfo.gl, renderInfo.textureShader, renderInfo.squareBuffers.color);
	connectTextureAttribute(renderInfo.gl, renderInfo.textureShader, renderInfo.squareBuffers.texture, renderInfo.squareBuffers.textureObject);

	let modelMatrix = new Matrix4();
	modelMatrix.setIdentity();
	camera.set();
	let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix)); // NB! rekkefølge!
	renderInfo.gl.uniformMatrix4fv(renderInfo.textureShader.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.textureShader.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);

	renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLE_STRIP, 0, renderInfo.squareBuffers.vertexCount);
}
