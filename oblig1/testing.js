import {WebGLCanvas} from '../base/helpers/WebGLCanvas.js';
import {Camera} from '../base/helpers/Camera.js';
import {WebGLShader} from '../base/helpers/WebGLShader.js';
import {Mesh} from './mesh.js';



export function main() {
    const webGLCanvas = new WebGLCanvas("myCanvas", document.body, 800, 800);
    const gl = webGLCanvas.gl;

    let baseShaders = initBS(gl);
    let buffers = initBuff(gl);
    draw(gl, baseShaders, buffers);
}

function initBS(gl) {

    let vertShaderS = document.getElementById('base-vertex-shader').innerHTML;
    let fragShaderS = document.getElementById('base-fragment-shader').innerHTML;

    const glslShader = new WebGLShader(gl, vertShaderS, fragShaderS);
    const shaderProg = glslShader.shaderProgram;

    return {
        program: shaderProg,
        attribLocs: {
            vertPos: gl.getAtrribLocation(shaderProg, 'aVertexPosition'),
            vertCol: gl.getAtrribLocation(shaderProg, 'aVertexColor')
        },
        uniformLocs: {
            projectionMat: gl.getUniformLocation(shaderProg, 'uProjectionMatrix'),
            modelViewMat: gl.getUniformLocation(shaderProg, 'uModelViewMatrix')
        }
    };
}

function initBuff(gl) {
    const w = 5;
    const h = 5;

    const posAndCol = new Float32Array([
        0,     h/2, 0,   0, 1, 0, 1,
        -w/2, -h/2, 0,   0, 1, 0, 1,
         w/2, -h/2, 0,   0, 1, 0, 1
    ])

    const posAndColBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posAndColBuff);
    gl.bufferData(gl.ARRAY_BUFFER, posAndCol, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return {
        posAndCol: posAndColBuff,
        vertC: posAndCol.length / 7 //FORDI XYZ + RGBA = 7
    };
}

function draw(gl, baseShaders, buffers) {
    clearCanvas(gl);

    gl.useProgram(baseShaders.program);

    connectPositionAttribute(gl, baseShaders, buffers.posAndCol);
    connectColorAttribute(gl, baseShaders, buffers.posAndCol);

    let modelMat = new Matrix4();
    modelMat.setIdentity();
    modelMat.translate(-3, 1, 0);
    modelMat.rotate(30, 0, 0, 1);

    let camMat = initCam(gl);
    let modelViewMat = new Matrix4(camMat.viewMat.multiply(modelMat));

    gl.uniformMatrix4fv(
        baseShaders.uniformLocs.modelViewMat, 
        false,
        modelViewMat.elements
    );

    gl.uniformMatrix4fv(
        baseShaders.uniformLocs.projectionMatm,
        false,
        camMat.projectionMat.elements
    );

    gl.drawArrays(mode = gl.TRIANGLES, first = 0, count = buffers.vertC);
}

function connectPositionAttribute(gl, shaders, posAndCol) {
    gl.bindBuffer(gl.ARRAY_BUFFER, posAndCol);
    gl.vertexAttribPointer(
        index = shaders.attribLocs.vertPos, 
        size = 3, 
        type = gl.FLOAT, 
        normalized = false, 
        stride = 7*4, 
        offset = 0);
    
    gl.enableVertexAttribArray(shaders.attribLocs.vertPos);
}

function connectColorAttribute(gl, shaders, posAndCol) {
    gl.bindBuffer(gl.ARRAY_BUFFER, posAndCol);
    gl.vertexAttribPointer(
        index = shaders.attribLocs.vertCol,
        size = 4,
        type = gl.FLOAT,
        normalized = false,
        stride = 7*4,
        offset = 3*4);

    gl.enableVertexAttribArray(shaders.attribLocs.vertCol);
}

function clearCanvas(gl) {
    gl.clearColor(0.9, 0.9, 0.9, 1);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function initCam(gl) {
    let viewMat = new Matrix4();
    let projectionMat = new Matrix4();

    viewMat.setLookAt(
        camPosX = 0, camPosY = 0, camPosZ = 10,
        lookAtX = 0, lookAtY = 0, lookAtZ = 0,
        upX = 0    , upY = 1    , upZ = 0
    )

    const asp = gl.canvas.clientWidth / gl.canvas.clientHeight;
    projectionMat.setPerspective(
        fieldOfView = 45,
        aspect = asp,
        near = 0.1,
        far = 1000
    )

    return {
        viewMat: viewMat,
        projectionMat: projectionMat
    };
}