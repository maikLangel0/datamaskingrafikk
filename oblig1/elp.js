'use-strict'
export class WebGLCanvas {
	constructor(id, parent, width, height) {
		let divWrapper = document.createElement('div');
		this.canvasElem = document.createElement('canvas');

		parent.appendChild(divWrapper);
		divWrapper.appendChild(this.canvasElem);

		divWrapper.id = id;

		this.canvasElem.width = width;
		this.canvasElem.height = height;
		this.gl = this.canvasElem.getContext('webgl2', {stencil: true} );

		if (!this.gl)
			alert('En feil oppsto ved lesing av WebGL-konteksten.');
	}
}

export class WebGLShader {
	constructor(gl, vsSource, fsSource) {
		this.shaderProgram = null;

		// Compile shaders:
		const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vsSource);
		const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

		// Attach compiled shaders to shaderProgram:
		this.shaderProgram = gl.createProgram();

		gl.attachShader(this.shaderProgram, vertexShader);
		gl.attachShader(this.shaderProgram, fragmentShader);
		gl.linkProgram(this.shaderProgram);

		if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
			alert('Feil ved kompilering og/eller linking av shaderprogrammene: ' + gl.getProgramInfoLog(this.shaderProgram));
		}
	}

	compileShader(gl, type, source) {
		const shader = gl.createShader(type);

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert('En feil oppsto ved kompilering av shaderne: ' + gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}
}

export class Camera {
    /**
     * @param {vec3} pos 
     * @param {vec3} lookAt 
     * @param {Number} FOV 
     * @param {Number} aspectRatio 
     * @param {Number} near 
     * @param {Number} far 
     * @returns
     */
    constructor(pos, look, fov, aspect, close, far) {
        /**@type {vec3} */
        this.pos = pos;
        /**@type {vec3} */
        this.look = look;
        /**@type {Number} */
        this.fov = fov;
        /**@type {Number} */
        this.aspect = aspect;
        /**@type {Number} */
        this.close = close;
        /**@type {Number} */
        this.far = far;

        this.up = vec3.fromValues(0, 1, 0);
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();

        mat4.lookAt(this.viewMatrix, this.pos, this.look, this.up);
        mat4.perspective(this.projectionMatrix,
            this.fov,
            this.aspect,
            this.close,
            this.far
        )
    }
}

export function clearCanvas(gl) {
    gl.clearColor(0.9, 0.9, 0.9, 1);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function connectAttribute(gl, attributeLocation, buffer, numComponents = 3, type = gl.FLOAT, normalize = false, stride = 0, offset = 0) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(
        attributeLocation,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(attributeLocation);
}