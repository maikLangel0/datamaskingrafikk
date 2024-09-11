import { WebGLShader, WebGLCanvas, Camera, clearCanvas, connectAttribute } from "./elp.js";
import '../base/lib/gl-matrix.js';
import { house, ground, cylinder, blades } from "./meshGen.js";

const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 700, 920);
const gl = webGLCanvas.gl;

let vertexShaderS = document.getElementById('base-vertex-shader').innerHTML;
let fragShaderS = document.getElementById('base-fragment-shader').innerHTML; 
let input = document.getElementById('inputField');

let keys = {};

let baseShaders = initBaseShaders();

window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
})

window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
})

export function main(){

    let camera = new Camera(
        vec3.fromValues(10, 10, 30),
        vec3.fromValues(0, 0, 0),
        45,
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.1,
        100
    );
    const darkGreen = vec4.fromValues(0,0.4,0,0.5);
    const red = vec4.fromValues(1,0,0,1);
    const darkRed = vec4.fromValues(0.2,0,0,1);
    const maroon = vec4.fromValues(0.5,0.1,0.2,0.5);
    const lightBlue = vec4.fromValues(0, 0.4, 1, 1);
    const black = vec4.fromValues(0,0,0,1);
    const darkBlue = vec4.fromValues(0.1,0,0.4,0.2);
    const white = vec4.fromValues(1,1,1,1);
    const gray = vec4.fromValues(0,0,0,0.1);

    const groundDim = vec3.fromValues(50,0,50);
    const groundPos = vec3.fromValues(0,0,0);

    const redHouseDim = vec3.fromValues(1,4,1);
    const redHousePos = vec3.fromValues(-2,0,0);

    const deepBlueHouseDim = vec3.fromValues(1,3,1);
    const deepBlueHousePos = vec3.fromValues(-4,0,0);

    const deepRedHouseDim = vec3.fromValues(2,6,2);
    const deepRedHousePos = vec3.fromValues(-7,0,0);

    const windmillDim = vec3.fromValues(1,10,1);
    const windmillPos = vec3.fromValues(0, 0,-10);

    const bladesDim = vec3.fromValues(3, 3, 3);
    const bladesPos = vec3.fromValues(0, 10, -10);

    /*initMesh(
        mesh: Float32Array, 
        dimentions: vec3, 
        color: vec4, 
        position: vec3, 
        shader: Shader, 
        mode: gl.---)
    */

    const redHouse = house(redHouseDim, red, 1, black, true);
    const deepBlueHouse = house(deepBlueHouseDim, darkBlue, 2, black, false);
    const deepRedHouse = house(deepRedHouseDim, darkRed, 0, black, false, true);
    const windmillPole = cylinder(windmillDim, white);
    const windmillBlades = blades(bladesDim, gray);
    const grass = ground(groundDim)

    let groundObj = initMesh(grass,groundPos, baseShaders, gl.TRIANGLES);
    let redHouseObj = initMesh(redHouse, redHousePos, baseShaders, gl.TRIANGLES);
    let deepBlueHouseObj = initMesh(deepBlueHouse, deepBlueHousePos, baseShaders, gl.TRIANGLES);
    let deepRedHouseObj = initMesh(deepRedHouse, deepRedHousePos, baseShaders, gl.TRIANGLES);
    let windMillObj = initMesh(windmillPole, windmillPos, baseShaders, gl.TRIANGLES);
    let windmillBladesObj = initMesh(windmillBlades, bladesPos, baseShaders, gl.TRIANGLES);

    let objects = [groundObj, redHouseObj, deepBlueHouseObj, deepRedHouseObj, windMillObj, windmillBladesObj];

    renderloop(objects, camera);
}

function initMesh(mesh, pos, shader = baseShaders, mode = gl.TRIANGLES) {

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return {
        posBuffer: posBuffer,
        vertexCount: mesh.length / 7,
        pos: pos,
        rotation: mat4.create(),
        shader: shader,
        mode: mode
    }
}

function renderloop(objects, camera) {

    function loop() {
        handleCam(camera);

        mat4.rotateZ(objects[5].rotation, objects[5].rotation, 0.01* (input.value));

        draw(objects, camera);

        requestAnimationFrame(loop);
    }
    loop();
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
        connectAttribute(gl, meshObj.shader.attribLocs.vertexPos, meshObj.posBuffer, 
            undefined, undefined, undefined, 7*Float32Array.BYTES_PER_ELEMENT);
            
        connectAttribute(gl, meshObj.shader.attribLocs.vertexCol, meshObj.posBuffer, 
            4, undefined, undefined, 7*Float32Array.BYTES_PER_ELEMENT, 3*Float32Array.BYTES_PER_ELEMENT);
        
        let modelMatrix = mat4.create();
        mat4.identity(modelMatrix);

        mat4.multiply(modelMatrix, modelMatrix, meshObj.rotation);

        mat4.translate(modelMatrix, modelMatrix, meshObj.pos)

        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, camera.viewMatrix, modelMatrix)

        gl.uniformMatrix4fv(meshObj.shader.uniformLocs.modelViewMatrix, false, modelViewMatrix);
	    gl.uniformMatrix4fv(meshObj.shader.uniformLocs.projectionMatrix, false, camera.projectionMatrix);

        gl.drawArrays(meshObj.mode, 0, meshObj.vertexCount)
    }
}

function handleCam(camera) {
    const moveSpeed = 0.01;
    const rotX = mat4.create();
    const rotY = mat4.create();

    if (keys['KeyA']) {
        mat4.rotateY(rotY, mat4.create(), -moveSpeed);
        vec3.transformMat4(camera.pos, camera.pos, rotY);
    }
    if (keys['KeyD']) {
        mat4.rotateY(rotY, mat4.create(), moveSpeed);
        vec3.transformMat4(camera.pos, camera.pos, rotY);
    }
    if (keys['KeyW']) {
        mat4.rotateX(rotX, mat4.create(), -moveSpeed);
        vec3.transformMat4(camera.pos, camera.pos, rotX);
    }
    if (keys['KeyS']) {
        mat4.rotateX(rotX, mat4.create(), moveSpeed);
        vec3.transformMat4(camera.pos, camera.pos, rotX);
    }

    camera.updateViewMatrix();
}