import { cubeMesh, pointedRoofMesh, windowMesh, doorMesh, garageMesh, groundMesh, aFrameRoofMesh, coneRoofMesh, cylinderMesh, bladesMesh } from './mesh.js';

export function house(houseDim, houseCol, roofType, roofCol, door = false, garage = false) {
    let houseMesh = cubeMesh(houseDim, houseCol);
    const height = houseDim[1];
    const lengthx = houseDim[0];
    const z = houseDim[2] - 1;
    
    if (door) {
        houseMesh.push(...doorMesh(z));
    }
    else if (garage) {
        houseMesh.push(...garageMesh(z));
    }
    const roofDim = [houseDim[0], houseDim[1] * 0.5, houseDim[2]];
    const roofs = [
        pointedRoofMesh(roofDim, roofCol, height), 
        aFrameRoofMesh(roofDim, roofCol, height),
        coneRoofMesh(roofDim, lengthx, height, 20, roofCol)];

    const roof = roofs[roofType];
    houseMesh.push(...roof);

    for (let i = 0; i < height; i++) {
        for (let j = -1; j < 2; j++) {
            let window = windowMesh(j* lengthx * 0.6, 0.3 + (i), z, 0.5);
            houseMesh.push(...window);
        }
    }
    return new Float32Array(houseMesh)
}

export function ground(groundDim) {
    return groundMesh(groundDim);
}

export function cylinder(cylDim, cylCol) {
    return cylinderMesh(cylDim, cylDim[0], cylDim[1], 20, cylCol);
}

export function blades(bladesDim, bladesCol) {
    return bladesMesh(bladesCol);
}