import { WebGLShader, WebGLCanvas, Camera, clearCanvas, connectAttribute } from "./elp.js";
import '../base/lib/gl-matrix.js';
import {cubeMesh, ground, pointedRoof, height} from './mesh.js';

const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 1916, 920);
const gl = webGLCanvas.gl;

let vertexShaderS = document.getElementById('base-vertex-shader').innerHTML;
let fragShaderS = document.getElementById('base-fragment-shader').innerHTML; 

export function main(){

    let camera = new Camera(
        vec3.fromValues(10, 10, 10),
        vec3.fromValues(0, 0, 0),
        45,
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.1,
        100
    );

    let baseShaders = initBaseShaders();

    //initMesh(Mesh: Float32Array, Color: vec4, position: vec3, shader: Shader, mode: gl.xxx)
    let cubeObj = initMesh(cubeMesh, vec4.fromValues(1,0,0,1), 
        vec3.fromValues(3,0,2), baseShaders, gl.TRIANGLES);

    let groundObj = initMesh(ground, vec4.fromValues(0,0.4,0,0.5),
        vec3.fromValues(0,0,0), baseShaders, gl.TRIANGLES);

    let pRoofObj = initMesh(pointedRoof, vec4.fromValues(0.2,0,0,1),
        vec3.fromValues(3,height,2), baseShaders, gl.TRIANGLES);

    draw([cubeObj, groundObj, pRoofObj], camera);
}

function initMesh(mesh, color, pos, shader, mode) {

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return {
        posBuffer: posBuffer,
        vertexCount: mesh.length / 3,
        color: color,
        pos: pos,
        shader: shader,
        mode: mode
    }
}

function initBaseShaders() {
    
    const glslShader = new WebGLShader(gl, vertexShaderS, fragShaderS);
    const shaderProgram = glslShader.shaderProgram;

    return {
        program: shaderProgram,
        attribLocs: {
            vertexPos: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexCol: gl.getAttribLocation(shaderProgram, 'aVertexColor')
        },
        uniformLocs: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            uFragColor: gl.getUniformLocation(shaderProgram, 'uFragColor')
        }
    }
}

function draw(meshObjects, camera) {
    clearCanvas(gl);

    for (let meshObj of meshObjects) {
        gl.useProgram(meshObj.shader.program)
        connectAttribute(gl, meshObj.shader.attribLocs.vertexPos, meshObj.posBuffer);

        gl.uniform4fv(meshObj.shader.uniformLocs.uFragColor, meshObj.color);
        
        let modelMatrix = mat4.create();
        mat4.identity(modelMatrix);

        mat4.translate(modelMatrix, modelMatrix, meshObj.pos)

        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, camera.viewMatrix, modelMatrix)

        gl.uniformMatrix4fv(meshObj.shader.uniformLocs.modelViewMatrix, false, modelViewMatrix);
	    gl.uniformMatrix4fv(meshObj.shader.uniformLocs.projectionMatrix, false, camera.projectionMatrix);

        gl.drawArrays(meshObj.mode, 0, meshObj.vertexCount)
    }
}
