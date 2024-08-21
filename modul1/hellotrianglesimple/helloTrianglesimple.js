import {WebGLCanvas} from '../../base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../../base/helpers/WebGLShader.js';

/**
 * Et WebGL-program som tegner en enkel trekant.
 * Bruker ikke klasser, kun funksjoner.
 */
export function main() {
	// Oppretter et webGLCanvas for WebGL-tegning:
	const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 820, 560);
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
			vertexColor: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexColor')
		},
		uniformLocations: {
			fragmentColor: gl.getUniformLocation(glslShader.shaderProgram, 'uFragmentColor'),
		},
	};
}

/**
 * Oppretter verteksbuffer for trekanten.
 * Et posisjonsbuffer og et fargebuffer.
 * MERK: Må være likt antall posisjoner og farger.
 */
function initBuffers(gl) {
	const positions = new Float32Array([
		0.6, 0.6, 0,      // X Y Z
		0.4, -0.6, 0,  // X Y Z
		0.8, -0.6, 0,   // X Y Z

		-0.6, 0.6, 0,      // X Y Z
		-0.4, -0.6, 0,  // X Y Z
		-0.8, -0.6, 0,   // X Y Z

		0.0, -0.6, 0,      // X Y Z
		0.2, 0.6, 0,  // X Y Z
		-0.2, 0.6, 0,   // X Y Z
	]);

	const colors = new Float32Array([
        1.0, 0.0, 0.0, 1.0,  // Triangle 1: Red
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        0.0, 1.0, 0.0, 1.0,  // Triangle 2: Green
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,

        0.0, 0.0, 1.0, 1.0,  // Triangle 3: Blue
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
    ]);

	const positionBuffer = gl.createBuffer();
	// Kopler til
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	// Fyller
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	// Kopler fra
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		vertexCount: positions.length/3,

		colors: colorBuffer,
		colorCount: colors.length/4,
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

function connectColorAttribute(gl, baseShaderInfo, colorBuffer) {
	const numComponents = 4;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
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
function connectColorUniform(gl, baseShaderInfo) {
	let colorRGBA = [1.0, 0.3, 0.0, 1.0];
	gl.uniform4f(baseShaderInfo.uniformLocations.fragmentColor, colorRGBA[0],colorRGBA[1],colorRGBA[2],colorRGBA[3]);
}
*/

/**
 * Tegner!
 */
function draw(gl, baseShaderInfo, buffers) {
	clearCanvas(gl);

	// Aktiver shader:
	gl.useProgram(baseShaderInfo.program);

	// Kople posisjon-attributtet til tilhørende buffer:
	connectPositionAttribute(gl, baseShaderInfo, buffers.position);
	// Kople til farge uniform:
	//connectColorUniform(gl, baseShaderInfo);
	// Tegn!
	connectColorAttribute(gl, baseShaderInfo, buffers.colors)
	                                                                                                                                                                                                                                                                  

	gl.drawArrays(gl.TRIANGLES, 0, buffers.vertexCount);
	gl.drawArrays(gl.TRIANGLES, 3, buffers.vertexCount);
	gl.drawArrays(gl.TRIANGLES, 6, buffers.vertexCount);
}
