import {WebGLCanvas} from '../../base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../../base/helpers/WebGLShader.js';

/**
 * Et WebGL-program som tegner en enkel trekant.
 * Bruker ikke klasser, kun funksjoner.
 */
export function main() {
	// Oppretter et webGLCanvas for WebGL-tegning:
	const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 960, 640);
	const gl = webGLCanvas.gl;
	let baseShaderInfo = initBaseShaders(gl);
	let buffers = initBuffers(gl);
	draw(gl, baseShaderInfo, buffers);
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
	};
}

/**
 * Oppretter verteksbuffer for trekanten.
 * Et posisjonsbuffer og et fargebuffer.
 * MERK: Må være likt antall posisjoner og farger.
 */
function initBuffers(gl) {
	const vertices = new Float32Array([
		0.6, 0.6, 0, 0.0, 1.0, 0.5, 1.0,     // X Y Z R, G, B, A
		0.4, -0.6, 0, 1.0, 0.5, 1.0,     // X Y Z R, G, B, A
		0.8, -0.6, 0, 1.0, 0.5, 1.0,     // X Y Z R, G, B, A
	]);
	const vertexBuffer = gl.createBuffer();
	// Kopler til
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	// Fyller
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	// Kopler fra
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		vertex: vertexBuffer,
		vertexCount: vertices.length/3
	};
}

/**
 * Aktiverer vertex-bufferet.
 * Kalles fra draw()
 */
function connectAttributes(gl, baseShaderInfo, vertexBuffer) {
	const numComponents = 4;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 7*4;
	let offset = 0;

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(
		baseShaderInfo.attribLocations.vertexPosition,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(baseShaderInfo.attribLocations.vertexPosition);

	offset = 4;
	gl.vertexAttribPointer(
		baseShaderInfo.attribLocations.vertexColor,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(baseShaderInfo.attribLocations.vertexColor);
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

/**
 * Tegner!
 */
function draw(gl, baseShaderInfo, buffers) {
	clearCanvas(gl);

	// Aktiver shader:
	gl.useProgram(baseShaderInfo.program);

	// Kople posisjon OG farge-attributtene til tilhørende buffer:
	connectAttributes(gl, baseShaderInfo, buffers.vertex);

	// Tegn!
	gl.drawArrays(gl.TRIANGLES, 0, buffers.vertexCount);
}
