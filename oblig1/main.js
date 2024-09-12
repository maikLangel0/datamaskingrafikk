import { WebGLShader, WebGLCanvas, Camera, clearCanvas, connectAttribute } from "./elp.js";
import '../base/lib/gl-matrix.js';
import { house, ground, cylinder, blades, houseCluster, road, fence } from "./meshGen.js";
import { colors } from "./colors.js";
import { pos, dim } from "./meshDimPositions.js";

const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 1916, 900);
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
        vec3.fromValues(0, 1, 10),
        vec3.fromValues(0, 0, 0),
        45,
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.1,
        1000
    );
    //const [houseCluster1, maxLength, maxWidth] = houseCluster([]);

    const groundObj = initMesh(
        ground(dim.ground), 
        pos.groundPos, baseShaders, gl.TRIANGLES
    );
    //-------------------------------
    const littlePersonObj = initMesh(
        house(dim.littlePerson, colors.green, 2, colors.green, true), 
        pos.littlePersonPos, baseShaders, gl.TRIANGLES
    );
    const widePersonObj = initMesh(
        house(dim.widePerson, colors.darkBlue, 1, colors.black, false, true), 
        pos.widePersonPos, baseShaders, gl.TRIANGLES
    );
    //-------------------------------
    const redHouseObj = initMesh(
        house(dim.redHouse, colors.red, 1, colors.black, true), 
        pos.redHousePos, baseShaders, gl.TRIANGLES
    );
    const deepBlueHouseObj = initMesh(
        house(dim.deepBlueHouse, colors.darkBlue, 2, colors.black, false), 
        pos.deepBlueHousePos, baseShaders, gl.TRIANGLES
    );
    const deepRedHouseObj = initMesh(
        house(dim.deepRedHouse, colors.darkRed, 0, colors.black, false, true), 
        pos.deepRedHousePos, baseShaders, gl.TRIANGLES
    );
    //-------------------------------
    const purpleHouseObj = initMesh(
        house(dim.purpleHouse, colors.purple, 1, colors.black, false, true), 
        pos.purpleHousepos, baseShaders, gl.TRIANGLES
    );
    const whiteHouseObj = initMesh(
        house(dim.whiteHouse, colors.white, 0, colors.maroon, true), 
        pos.whiteHousePos, baseShaders, gl.TRIANGLES
    );
    //-------------------------------
    const pinkHouseObj = initMesh(
        house(dim.pinkHouse, colors.pink, 2, colors.gray, true), 
        pos.pinkHousePos, baseShaders, gl.TRIANGLES
    );
    const usbFlashDriveObj = initMesh(
        house(dim.usbFlashDrive, colors.black, 1, colors.lightBlue), 
        pos.usbFlashDrivePos, baseShaders, gl.TRIANGLES
    );
    const burjObj = initMesh(
        house(dim.burj, colors.gray, 1, colors.gray, false, true), 
        pos.burjPos, baseShaders, gl.TRIANGLES
    );
    //-------------------------------
    const windMillObj = initMesh(
        cylinder(dim.windmill, colors.cream), 
        pos.windmillPos, baseShaders, gl.TRIANGLES
    );
    const windmillBladesObj = initMesh(
        blades(colors.metal), 
        pos.bladesPos, baseShaders, gl.TRIANGLES
    );
    //-------------------------------
    const roadObj = initMesh(
        road(dim.roadDim, colors.lightGray, 0), 
        pos.roadPos, baseShaders, gl.TRIANGLES
    );
    //-------------------------------
    const fenceObj1 = initMesh(
        fence([dim.widePerson, dim.littlePerson]), 
        pos.widePersonPos, baseShaders, gl.TRIANGLES
    );
    const fenceObj2 = initMesh(
        fence([dim.deepRedHouse, dim.deepBlueHouse, dim.redHouse]), 
        pos.deepRedHousePos, baseShaders, gl.TRIANGLES
    );
    const fenceObj3 = initMesh(
        fence([dim.purpleHouse, dim.whiteHouse]), 
        pos.purpleHousepos, baseShaders, gl.TRIANGLES
    );
    const fenceObj4 = initMesh(
        fence([dim.pinkHouse, dim.usbFlashDrive, dim.burj]), 
        pos.pinkHousePos, baseShaders, gl.TRIANGLES
    );

    const objects = [
        groundObj, redHouseObj, deepBlueHouseObj, 
        deepRedHouseObj, windMillObj, windmillBladesObj, 
        purpleHouseObj, whiteHouseObj, pinkHouseObj,
        usbFlashDriveObj, burjObj, littlePersonObj,
        widePersonObj, roadObj, fenceObj1, fenceObj2,
        fenceObj3, fenceObj4
    ];


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
        gl.useProgram(meshObj.shader.program);
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
    const x = mat4.create();
    const y = mat4.create();

    if (keys['KeyA']) {
        mat4.rotateY(y, y, -moveSpeed);
        vec3.transformMat4(camera.pos, camera.pos, y);
    }
    if (keys['KeyD']) {
        mat4.rotateY(y, y, moveSpeed);
        vec3.transformMat4(camera.pos, camera.pos, y);
    }
    if (keys['KeyW']) {
        vec3.scale(camera.pos, camera.pos, 1 - moveSpeed)
        // mat4.rotateX(x, x, -moveSpeed);
        // vec3.transformMat4(camera.pos, camera.pos, x);
    }
    if (keys['KeyS']) {
        vec3.scale(camera.pos, camera.pos, 1 + moveSpeed)
        // mat4.rotateX(x, x, moveSpeed);
        // vec3.transformMat4(camera.pos, camera.pos, x);
    }

    camera.updateViewMatrix();
}