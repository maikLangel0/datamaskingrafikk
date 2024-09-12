import { cubeMesh, pointedRoofMesh, windowMesh, doorMesh, garageMesh, groundMesh, aFrameRoofMesh, coneRoofMesh, cylinderMesh, bladesMesh, roadMesh, plankMesh } from './mesh.js';
import { colors } from './colors.js';

function roofChoice(roofDim, roofCol, roofType, height, length){
    let options = [
        pointedRoofMesh(roofDim, roofCol, height), 
        aFrameRoofMesh(roofDim, roofCol, height),
        coneRoofMesh(roofDim, length, height, 20, roofCol)];

    return options[roofType];
}

export function house(houseDim, houseCol, roofType, roofCol, door = false, garage = false) {
    let houseMesh = cubeMesh(houseDim, houseCol);
    const height = houseDim[1];
    const length = houseDim[0];
    const width = houseDim[2];
    
    if (door) {houseMesh.push(...doorMesh(width));
    }
    else if (garage) {
        houseMesh.push(...garageMesh(width));
    }
    const roofDim = [houseDim[0], houseDim[1] * 0.5, houseDim[2]];
    const roof = roofChoice(roofDim, roofCol, roofType, height, length);
    houseMesh.push(...roof);

    for (let i = 0; i < height; i++) {
        for (let j = -1; j < 2; j++) {
            let window = windowMesh(j* length * 0.6, 0.3 + (i), width, 0.5);
            houseMesh.push(...window);
        }
    }
    houseMesh.push(...roadMesh([length, 0.005, 2.5], colors.lightGray, 2.5));

    return new Float32Array(houseMesh)
}

// not used but cool
export function houseCluster(housesDim, colors, roofs, doorOrGarage) {
    if (housesDim.length == colors.length == roofs.length == doorOrGarage) {
        console.log("Instancing of houses" + housesDim + "did not work");
        return new Float32Array([]);
    }

    let housesMesh = [];
    let maxLength = 0;
    let maxWidth = 0;

    for (let i = 0; i < housesDim.length; i ++) {
        let houseMesh = [];
        let currDim = housesDim[i];
        let currCol = colors[i];
        let currRoof = roofs[i];

        let length = housesDim[i][0];
        let height = housesDim[i][1];
        let width = housesDim[i][2];

        let z = width - 1;

        if (maxLength < length) {
            maxLength = length;
        }
        if (maxWidth < width) {
            maxWidth = width;
        }

        houseMesh.push(...cubeMesh(currDim, colors[i]));

        if (doorOrGarage[i] == 1) {
            houseMesh.push(...doorMesh(z));
            //mb for å recognize at her skal det være et path.
        }
        else if (doorOrGarage[i] == 2) {
            houseMesh.push(...garageMesh(z));
        }

        let roofDim = [currDim[0], currDim[1] * 0.5, currDim[2]];
        let roof = roofChoice(roofDim, currCol, currRoof, height, length);
        houseMesh.push(...roof);

        for (let i = 0; i < height; i++) {
            for (let j = -1; j < 2; j++) {
                let window = windowMesh(j* length * 0.6, 0.3 + (i), z, 0.5);
                houseMesh.push(...window);
            }
        }
        housesMesh.push(houseMesh);
    }

    mesh = [];
    for (let houses of housesMesh) {
        mesh.push(new Float32Array([houses]));
    }

    return [mesh, maxLength, maxWidth];
}

export function ground(groundDim) {
    return groundMesh(groundDim);
}

export function cylinder(cylDim, cylCol) {
    return cylinderMesh(cylDim, cylDim[0], cylDim[1], 20, cylCol);
}

export function blades(bladesCol) {
    return bladesMesh(bladesCol);
}

export function road(roadDim, roadCol, offZ) {
    return roadMesh(roadDim, roadCol, offZ);
}

// firstHouseDim[0] + lastHouseDim[0] + 
export function fence(housesDim) {
    const gap = 0.5;
    let fenceLength = 0;
    let fenceWidth = 0;
    let firstHouseLength = housesDim[0][0];

    for (let house of housesDim) {
        fenceLength += house[0];

        if (house[2] > fenceWidth) {
            fenceWidth = house[2];
        }
    }
    let fenceMesh = [];

    fenceMesh.push(...plankMesh((fenceLength + gap) * 2, 0.5, 0.25, - gap - firstHouseLength, -fenceWidth -gap, true, 0.584, 0.271, 0.125, 1));
    fenceMesh.push(...plankMesh(fenceWidth * 2 + 1, 0.5, 0.25, - firstHouseLength - gap, -fenceWidth - gap, false, 0.584, 0.271, 0.125, 1));
    fenceMesh.push(...plankMesh(fenceWidth * 2 + 1, 0.5, 0.25, (fenceLength - firstHouseLength / 2) * 2 + gap, -fenceWidth -gap, false, 0.584, 0.271, 0.125, 1));

    fenceMesh.push(...cylinderMesh([- firstHouseLength - gap, 0, fenceWidth], 0.2, 1, 10, [0.310, 0.125, 0.059, 1]));
    fenceMesh.push(...cylinderMesh([- firstHouseLength - gap,0,-fenceWidth -gap], 0.2, 1, 10, [0.310, 0.125, 0.059, 1]));

    fenceMesh.push(...cylinderMesh([(fenceLength - firstHouseLength / 2) * 2 + gap, 0, -fenceWidth -gap], 0.2, 1, 10, [0.310, 0.125, 0.059, 1]));
    fenceMesh.push(...cylinderMesh([(fenceLength - firstHouseLength / 2) * 2 + gap, 0, fenceWidth], 0.2, 1, 10, [0.310, 0.125, 0.059, 1]));

    return new Float32Array(fenceMesh)
}