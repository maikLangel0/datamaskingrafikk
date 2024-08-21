import {WebGLCanvas} from '../../base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../../base/helpers/WebGLShader.js';
import {Camera} from "../../base/helpers/Camera.js";
import {Stack} from "../../base/helpers/Stack.js";

/**
 * Et WebGL-program som tegner en 2D "papirmann".
 * Bruker en egen Stack-klasse.
 * Bruker en egen Camera-klasse som håndterer view, viewmodel og projection-matrisene.
 */

export function main() {
	// Oppretter et webGLCanvas for WebGL-tegning:
	const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 960, 640);
	// Hjelpeobjekt som holder på objekter som trengs for rendring:
	const renderInfo = {
		gl: webGLCanvas.gl,
		baseShaderInfo: initBaseShaders(webGLCanvas.gl),
		rectangleBuffer: initRectangleBuffers(webGLCanvas.gl),
		currentlyPressedKeys: [],
		stack: new Stack(),
		lastTime: 0,
		fpsInfo: {  // Brukes til å beregne og vise FPS (Frames Per Seconds):
			frameCount: 0,
			lastTimeStamp: 0
		},
		animationInfo: {
			rightShoulderRotation: 0
		}
	};

	initKeyPress(renderInfo.currentlyPressedKeys);
	const camera = new Camera(renderInfo.gl, renderInfo.currentlyPressedKeys);
	animate( 0, renderInfo, camera);
}

/**
 * Knytter tastatur-evnents til eventfunksjoner.
 */
function initKeyPress(currentlyPressedKeys) {
	document.addEventListener('keyup', (event) => {
		currentlyPressedKeys[event.code] = false;
	}, false);
	document.addEventListener('keydown', (event) => {
		currentlyPressedKeys[event.code] = true;
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
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uProjectionMatrix'),
			modelMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uModelMatrix'),
			viewMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uViewMatrix'),
			fragmentColor: gl.getUniformLocation(glslShader.shaderProgram, 'uFragmentColor'),
		},
	};
}

/**
 * Oppretter verteksbuffer for trekanten.
 * Et posisjonsbuffer og et fargebuffer.
 * MERK: Må være likt antall posisjoner og farger.
 */
function initRectangleBuffers(gl) {
	const positions = new Float32Array([
		-1,1,0,
		-1,-1,0,
		1,-1,0,
		1,-1,0,
		1,1,0,
		-1,1,0
	]);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		vertexCount: positions.length/3
	};
}

/**
 * Aktiverer position-bufferet.
 * Kalles fra draw()
 */
function connectPositionAttribute(gl, baseShaderInfo, positionBuffer) {
	const numComponents = 3;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(
		baseShaderInfo.attribLocations.vertexPosition,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(baseShaderInfo.attribLocations.vertexPosition);
}

function connectColorUniform(gl, baseShaderInfo, colorRGBA) {
	gl.uniform4f(baseShaderInfo.uniformLocations.fragmentColor, colorRGBA[0],colorRGBA[1],colorRGBA[2],colorRGBA[3]);
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
	handleKeys(renderInfo);

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
	drawPaperMan(renderInfo, camera);
}

function drawPaperMan(renderInfo, camera) {
	// Aktiver shader:
	renderInfo.gl.useProgram(renderInfo.baseShaderInfo.program);

	// Kople posisjon og farge-attributtene til tilhørende buffer:
	connectPositionAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.rectangleBuffer.position);
	// Bruker en uniform til å sette/endre farge på de ulike kroppsdelene:
	let colorRGBA = [1.0, 1.0, 0.0, 1.0];

	let modelMatrix = new Matrix4();
	//M=I*T*O*R*S, der O=R*T
	modelMatrix.setIdentity();
	//modelMatrix.translate(-10,3,-10);
	renderInfo.stack.pushMatrix(modelMatrix);   //Identitetsmatrisa ligger nå på toppen av stacken.

	//TORSO:
	modelMatrix = renderInfo.stack.peekMatrix();      // Bruker toppen av stack som utgangspunkt.
	modelMatrix.scale(4, 6, 1);	          // 8 bred, 12 høy. NB! skalering er ikke med matrisa som legges på stacken.
	drawRectangle(renderInfo, modelMatrix, camera, colorRGBA) ;  // Tegner torso/rota.

	//HALSEN:
	modelMatrix = renderInfo.stack.peekMatrix();      // Bruker toppen av stack som utgangspunkt.
	modelMatrix.translate(0, 6, 0);         // Legger til en translate
	renderInfo.stack.pushMatrix(modelMatrix);         // PUSHER (øsnker ikke å ha med skaleringa, pusher derfor før skalering)!
	modelMatrix.scale(0.6, 1, 1);
	colorRGBA = [0.0, 1.0, 0.0, 1.0];                // Endrer farge:
	drawRectangle(renderInfo, modelMatrix, camera, colorRGBA) ;  // Tegner halsen.

	//HODET:
	modelMatrix = renderInfo.stack.peekMatrix();      // Bruker toppen av stack som utgangspunkt
	modelMatrix.translate(0, 3, 0);         // Translerer ...
	modelMatrix.scale(2, 2, 1);             // Skalerer
	colorRGBA = [0.8, 0.0, 0.3, 1.0];                 // Endrer farge:
	drawRectangle(renderInfo, modelMatrix, camera, colorRGBA);   // Tegner hodet.

	// HØYRE ARM:
	renderInfo.stack.popMatrix();
	drawArm(renderInfo, camera, modelMatrix, 1);
	// VENSTRE ARM:
	renderInfo.stack.popMatrix();
	drawArm(renderInfo, camera, modelMatrix, -1);

	// HØYRE FOT:
	renderInfo.stack.popMatrix();
	drawFoot(renderInfo, camera, modelMatrix, 1);
	// VENSTRE FOT:
	renderInfo.stack.popMatrix();
	drawFoot(renderInfo, camera, modelMatrix, -1);
}

function drawArm(renderInfo, camera, modelMatrix, leftRight) {
	//OVERARM:
	modelMatrix = renderInfo.stack.peekMatrix();
	// * Translate
	modelMatrix.translate(4*leftRight, 6, 0);
	// * Orbit
	modelMatrix.rotate(renderInfo.animationInfo.rightShoulderRotation, 0, 0, 1);    // 3) Roter om Z-aksen
	modelMatrix.translate(2*leftRight, 0, 0);

	renderInfo.stack.pushMatrix(modelMatrix);
	// * Scale
	modelMatrix.scale(2, 0.5, 1);
	let colorRGBA = [0.3, 0.0, 0.8, 1.0];
	drawRectangle(renderInfo, modelMatrix, camera, colorRGBA)

	//UNDERARM:
	modelMatrix = renderInfo.stack.peekMatrix();
	//* Translate
	modelMatrix.translate(2*leftRight, 0, 0);     // 4) Flytt til korrekt posisjon på overarm, dvs. 2 til høyre (side overarmen er 2 lang).
	//* Orbit
	modelMatrix.rotate(-60, 0, 0, 1);   // 3) Roter om Z-aksen
	modelMatrix.translate(2*leftRight, 0, 0);     // 2) Flytter 3 til høyre slik at venstre kant kommer i X=0
	renderInfo.stack.pushMatrix(modelMatrix);	 // PUSHER!

	modelMatrix.scale(2, 0.5, 1);       // 1) Skaler, armlengde = 6:
	colorRGBA = [0.8, 0.4, 0.2, 1.0];
	drawRectangle(renderInfo, modelMatrix, camera, colorRGBA);

	//FINGER-1:
	//* Translate
	modelMatrix = renderInfo.stack.peekMatrix();
	modelMatrix.translate(2*leftRight, 0, 0);     // 4) Flytt til korrekt posisjon på underarm, dvs. 3 til høyre (side overarmen er 2 lang).
	//* Orbit:
	modelMatrix.rotate(-30, 0, 0, 1);   // 3) Roter om Z-aksen
	modelMatrix.translate(1*leftRight, 0, 0);     // 2) Flytter 1 til høyre slik at venstre kant kommer i X=0
	//* Scale:
	modelMatrix.scale(1, 0.15, 0.15);   // 1) Skaler, fingerlengde=2:
	colorRGBA = [0.1, 0.9, 0.7, 1.0];
	drawRectangle(renderInfo, modelMatrix, camera, colorRGBA);

	//FINGER-2:
	//* Translate
	modelMatrix = renderInfo.stack.peekMatrix();
	modelMatrix.translate(2*leftRight, 0, 0);
	//* Orbit:
	modelMatrix.rotate(0, 0, 0, 1);
	modelMatrix.translate(1*leftRight, 0, 0);
	//* Scale:
	modelMatrix.scale(1, 0.15, 0.15);
	drawRectangle(renderInfo, modelMatrix, camera, colorRGBA);

	//FINGER-3:
	//* Translate
	modelMatrix = renderInfo.stack.peekMatrix();
	modelMatrix.translate(2*leftRight, 0, 0);
	//* Orbit:
	modelMatrix.rotate(30, 0, 0, 1);
	modelMatrix.translate(1*leftRight, 0, 0);
	//* Scale:
	modelMatrix.scale(1, 0.15, 0.15);
	drawRectangle(renderInfo, modelMatrix, camera, colorRGBA);

	renderInfo.stack.popMatrix();
}

function drawFoot(renderInfo, camera, modelMatrix, leftRight) {
	//LÅR:
	modelMatrix = renderInfo.stack.peekMatrix();
	// * Translate
	modelMatrix.translate(-3*leftRight, -11, 0);
	// * Orbit
	modelMatrix.rotate(85*leftRight, 0, 0, 1);
	modelMatrix.translate(2*leftRight, 0, 0);
	// * Scale
	modelMatrix.scale(3, 1, 1);
	let colorRGBA = [0.3, 0.0, 0.8, 1.0];
	drawRectangle(renderInfo, modelMatrix, camera, colorRGBA)

	//LEGGER:
	modelMatrix = renderInfo.stack.peekMatrix();
	//* Translate
	modelMatrix.translate(-3*leftRight, -17, 0);
	//* Orbit
	modelMatrix.rotate(90*leftRight, 0, 0, 1);
	modelMatrix.translate(2*leftRight, 0, 0);
	renderInfo.stack.pushMatrix(modelMatrix);

	modelMatrix.scale(3, 1, 1);
	colorRGBA = [0.8, 0.4, 0.2, 1.0];
	drawRectangle(renderInfo, modelMatrix, camera, colorRGBA);
}

function drawRectangle(renderInfo, modelMatrix, camera, colorRGBA) {
	camera.set();

	// Setter farge (ved å endre verdien på en uniform-variabel):
	connectColorUniform(renderInfo.gl, renderInfo.baseShaderInfo, colorRGBA);

	// Send kameramatrisene til shaderen:
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.modelMatrix, false, modelMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.viewMatrix, false, camera.viewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);
	// Tegn:
	renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLES, 0, renderInfo.rectangleBuffer.vertexCount);
}

function handleKeys(renderInfo) {

	if (renderInfo.currentlyPressedKeys['KeyF']) {    //F
		renderInfo.animationInfo.rightShoulderRotation += 1;
	}
	if (renderInfo.currentlyPressedKeys['KeyG']) {	//G
		renderInfo.animationInfo.rightShoulderRotation -= 1;
	}
}
