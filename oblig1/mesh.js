export function cubeMesh(dimentions, color) {
    const x = dimentions[0];
    const y = dimentions[1]; 
    const z = dimentions[2];
    const r = color[0];
    const g = color[1];
    const b = color[2];
    const a = color[3];

    return [
        // Front face (two triangles)
        -x, 0.0,  z,  r, g, b, a,  // Bottom-left
         x, 0.0,  z,  r, g, b, a,  // Bottom-right
         x, y,    z,  r, g, b, a,  // Top-right

        -x, 0.0,  z,  r, g, b, a,  // Bottom-left
         x, y,    z,  r, g, b, a,  // Top-right
        -x, y,    z,  r, g, b, a,  // Top-left

        // Back face (two triangles)
        -x, 0.0, -z,  r, g, b, a,  // Bottom-left
         x, 0.0, -z,  r, g, b, a,  // Bottom-right
         x, y,   -z,  r, g, b, a,  // Top-right

        -x, 0.0, -z,  r, g, b, a,  // Bottom-left
         x, y,   -z,  r, g, b, a,  // Top-right
        -x, y,   -z,  r, g, b, a,  // Top-left

        // Top face (two triangles)
        -x, y,  z,  r, g, b, a,  // Front-left
         x, y,  z,  r, g, b, a,  // Front-right
         x, y, -z,  r, g, b, a,  // Back-right

        -x, y,  z,  r, g, b, a,  // Front-left
         x, y, -z,  r, g, b, a,  // Back-right
        -x, y, -z,  r, g, b, a,  // Back-left

        /*
        // Bottom face (two triangles)
        -x, 0.0,  z,  r, g, b, a,  // Front-left
         x, 0.0,  z,  r, g, b, a,  // Front-right
         x, 0.0, -z,  r, g, b, a,  // Back-right

        -x, 0.0,  z,  r, g, b, a,  // Front-left
         x, 0.0, -z,  r, g, b, a,  // Back-right
        -x, 0.0, -z,  r, g, b, a,  // Back-left
        */

        // Right face (two triangles)
         x, 0.0,  z,  r, g, b, a,  // Bottom-front
         x, 0.0, -z,  r, g, b, a,  // Bottom-back
         x, y,   -z,  r, g, b, a,  // Top-back

         x, 0.0,  z,  r, g, b, a,  // Bottom-front
         x, y,   -z,  r, g, b, a,  // Top-back
         x, y,    z,  r, g, b, a,  // Top-front

        // Left face (two triangles)
        -x, 0.0,  z,  r, g, b, a,  // Bottom-front
        -x, 0.0, -z,  r, g, b, a,  // Bottom-back
        -x, y,   -z,  r, g, b, a,  // Top-back

        -x, 0.0,  z,  r, g, b, a,  // Bottom-front
        -x, y,   -z,  r, g, b, a,  // Top-back
        -x, y,    z,  r, g, b, a   // Top-front
    ];
}

export function groundMesh(dimentions) {
    const x = dimentions[0]; 
    const y = dimentions[1]; 
    const z = dimentions[2];

    return new Float32Array([
        x, y,  z,  0, 0.4, 0, 1,  // Top-right
       -x, y,  z,  0, 0.4, 0, 1,  // Top-left
        x, y, -z,  0, 0.4, 0, 1,  // Bottom-right

        x, y, -z,  0, 0.4, 0, 1,  // Bottom-right
       -x, y, -z,  0, 0.4, 0, 1,  // Bottom-left
       -x, y,  z,  0, 0.4, 0, 1   // Top-left
    ]);
}

export function pointedRoofMesh(dimentions, color, height = 0) {
    const x = dimentions[0];
    const y = dimentions[1]; 
    const z = dimentions[2]; 
    const r = color[0];
    const g = color[1];
    const b = color[2];
    const a = color[3];

    return [
        // Bottom
         x, 0 + height, -z,  r, g, b, a,  // X Y Z + Color
         x, 0 + height,  z,  r, g, b, a,  // X Y Z + Color
        -x, 0 + height,  z,  r, g, b, a,  // X Y Z + Color
        -x, 0 + height,  z,  r, g, b, a,  // X Y Z + Color
        -x, 0 + height, -z,  r, g, b, a,  // X Y Z + Color
         x, 0 + height, -z,  r, g, b, a,  // X Y Z + Color
        // Front

         0, y + height, 0,   r, g, b, a,  // X Y Z + Color
         x, 0 + height, z,   r, g, b, a,  // X Y Z + Color
        -x, 0 + height, z,   r, g, b, a,  // X Y Z + Color
        // Back

         0, y + height, 0,   r, g, b, a,  // X Y Z + Color
         x, 0 + height, -z,  r, g, b, a,  // X Y Z + Color
        -x, 0 + height, -z,  r, g, b, a,  // X Y Z + Color
        // Left

         0, y + height, 0,   r, g, b, a,  // X Y Z + Color
        -x, 0 + height, z,   r, g, b, a,  // X Y Z + Color
        -x, 0 + height, -z,  r, g, b, a,  // X Y Z + Color

        // Right
         0, y + height, 0,   r, g, b, a,  // X Y Z + Color
         x, 0 + height, z,   r, g, b, a,  // X Y Z + Color
         x, 0 + height, -z,  r, g, b, a,  // X Y Z + Color
    ];
}

export function aFrameRoofMesh(dimentions, color, height) {
    const x = dimentions[0];
    const y = dimentions[1]; 
    const z = dimentions[2]; 
    const r = color[0];
    const g = color[1];
    const b = color[2];
    const a = color[3];

    return [
        // front
        x, 0 + height, z,    r, g, b, a, // X Y Z R G B A
        0, y + height, z,    r, g, b, a, // X Y Z R G B A
        -x, 0 + height, z,    r, g, b, a, // X Y Z R G B A

        // back
        x, 0 + height, -z,    r, g, b, a, // X Y Z R G B A
        0, y + height, -z,    r, g, b, a, // X Y Z R G B A
        -x, 0 + height, -z,    r, g, b, a, // X Y Z R G B A

        // side 1
        0, y + height, z,    r, g, b, a, // X Y Z R G B A
        x, 0 + height, z,    r, g, b, a, // X Y Z R G B A
        x, 0 + height, -z,    r, g, b, a, // X Y Z R G B A

        0, y + height, z,    r, g, b, a, // X Y Z R G B A
        0, y + height, -z,    r, g, b, a, // X Y Z R G B A
        x, 0 + height, -z,    r, g, b, a, // X Y Z R G B A

        // side 2
        0, y + height, -z,    r, g, b, a, // X Y Z R G B A
        -x, 0 + height, -z,    r, g, b, a, // X Y Z R G B A
        -x, 0 + height, z,    r, g, b, a, // X Y Z R G B A

        0, y + height, -z,    r, g, b, a, // X Y Z R G B A
        0, y + height, z,    r, g, b, a, // X Y Z R G B A
        -x, 0 + height, z,    r, g, b, a, // X Y Z R G B A
    ]
}

export function coneRoofMesh(dimentions, radius, height, segments, color) {
    const offsetX = dimentions[0] - radius;
    const offsetY = height;
    const offsetZ = dimentions[2] - radius;
    const r = color[0];
    const g = color[1];
    const b = color[2];
    const a = color[3];

    const angleStep = (Math.PI * 2) / segments;
    let vertices = [];
    
    for (let i = 0; i < segments; i++) {
        const angle = i * angleStep;
        const nextAngle = (i + 1) * angleStep;

        vertices.push(
            offsetX, offsetY, offsetZ, r, g, b, a,
            offsetX + radius * Math.cos(angle), offsetY, offsetZ + radius * Math.sin(angle), r, g, b, a,
            offsetX + radius * Math.cos(nextAngle), offsetY, offsetZ + radius * Math.sin(nextAngle), r, g, b, a
        );

        vertices.push(
            offsetX + radius * Math.cos(angle), offsetY, offsetZ + radius * Math.sin(angle), r, g, b, a,
            0, (height + offsetY), 0, r, g, b, a,
            0, (height + offsetY), 0, r, g, b, a,
            offsetX + radius * Math.cos(angle), offsetY, offsetZ + radius * Math.sin(angle), r, g, b, a,
            0, (height + offsetY), 0, r, g, b, a,
            offsetX + radius * Math.cos(nextAngle), offsetY, offsetZ + radius * Math.sin(nextAngle), r, g, b, a
        );
    }
    return new Float32Array(vertices);
}

export function windowMesh(offX, offY, offZ, height) {

    return [
        0.2 + offX, 0 + offY, 1.001 +  offZ,  0, 0.4, 1, 1,  // Vertex 7
        0.2 + offX, height + offY, 1.001 +  offZ,  0, 0.4, 1, 1,  // Vertex 8
       -0.2 + offX, height + offY, 1.001 +  offZ,  0, 0.4, 1, 1,  // Vertex 9

        0.2 + offX, 0 + offY, 1.001 +  offZ,  0, 0.4, 1, 1,  // Vertex 10
       -0.2 + offX, 0 + offY, 1.001 +  offZ,  0, 0.4, 1, 1,  // Vertex 11
       -0.2 + offX, height + offY, 1.001 +  offZ,  0, 0.4, 1, 1,  // Vertex 12
    ];
}

export function doorMesh(offZ) {
    return [
        0.3, 0, 1.005 +  offZ,  0, 0, 0, 1,  // Vertex 1
        0.3, 1.1, 1.005 +  offZ,  0, 0, 0, 1,  // Vertex 2
       -0.3, 1.1, 1.005 +  offZ,  0, 0, 0, 1,  // Vertex 3

        0.3, 0, 1.005 +  offZ,  0, 0, 0, 1,  // Vertex 4
       -0.3, 0, 1.005 +  offZ,  0, 0, 0, 1,  // Vertex 5
       -0.3, 1.1, 1.005 +  offZ,  0, 0, 0, 1  // Vertex 6
    ];
}

export function garageMesh(offZ) {
    return [
        0.9, 0.0, 1.005 +  offZ,  0, 0, 0, 1,  // Vertex 1
        0.9, 1.1, 1.005 +  offZ,  0, 0, 0, 1,  // Vertex 2
       -0.9, 1.1, 1.005 +  offZ,  0, 0, 0, 1,  // Vertex 3

        0.9, 0.0, 1.005 +  offZ,  0, 0, 0, 1,  // Vertex 4
       -0.9, 0.0, 1.005 +  offZ,  0, 0, 0, 1,  // Vertex 5
       -0.9, 1.1, 1.005 +  offZ,  0, 0, 0, 1  // Vertex 6
    ];
}

export function cylinderMesh(dimentions, radius, height, segments, color) {
    const offsetX = dimentions[0] - radius;
    const offsetY = 0;
    const offsetZ = dimentions[2] - radius;
    const r = color[0];
    const g = color[1];
    const b = color[2];
    const a = color[3];

    const angleStep = (Math.PI * 2) / segments;
    let vertices = [];
    
    for (let i = 0; i < segments; i++) {
        const angle = i * angleStep;
        const nextAngle = (i + 1) * angleStep;

        vertices.push(
            offsetX, height + offsetY, offsetZ, r, g, b, a,
            offsetX + radius * Math.cos(angle), height + offsetY, offsetZ + radius * Math.sin(angle), r, g, b, a,
            offsetX + radius * Math.cos(nextAngle), height + offsetY, offsetZ + radius * Math.sin(nextAngle), r, g, b, a
        );

        vertices.push(
            offsetX, offsetY, offsetZ, r, g, b, a,
            offsetX + radius * Math.cos(angle), offsetY, offsetZ + radius * Math.sin(angle), r, g, b, a,
            offsetX + radius * Math.cos(nextAngle), offsetY, offsetZ + radius * Math.sin(nextAngle), r, g, b, a
        );

        vertices.push(
            offsetX + radius * Math.cos(angle), offsetY, offsetZ + radius * Math.sin(angle), r, g, b, a,
            offsetX + radius * Math.cos(angle), height + offsetY, offsetZ + radius * Math.sin(angle), r, g, b, a,
            offsetX + radius * Math.cos(nextAngle), height + offsetY, offsetZ + radius * Math.sin(nextAngle), r, g, b, a,
            offsetX + radius * Math.cos(angle), offsetY, offsetZ + radius * Math.sin(angle), r, g, b, a,
            offsetX + radius * Math.cos(nextAngle), height + offsetY, offsetZ + radius * Math.sin(nextAngle), r, g, b, a,
            offsetX + radius * Math.cos(nextAngle), offsetY, offsetZ + radius * Math.sin(nextAngle), r, g, b, a
        );
    }
    return new Float32Array(vertices);
}

export function bladesMesh(color) {
    const r = color[0];
    const g = color[1];
    const b = color[2];
    const a = color[3];

    return new Float32Array([
    0, 0, 1,  r, g, b, a,  // Vertex 1
    0, 3, 1,  r, g, b, a,  // Vertex 2
    3, 3, 1,  r, g, b, a,  // Vertex 3

    0, 0, 1,  r, g, b, a,  // Vertex 1
    0, -3, 1,  r, g, b, a,  // Vertex 2
    -3, -3, 1,  r, g, b, a,  // Vertex 3

    0, 0, 1,  r, g, b, a,  // Vertex 1
    3, 0, 1,  r, g, b, a,  // Vertex 2
    3, -3, 1,  r, g, b, a,  // Vertex 3

    0, 0, 1,  r, g, b, a,  // Vertex 1
    -3, 0, 1,  r, g, b, a,  // Vertex 2
    -3, 3, 1,  r, g, b, a,  // Vertex 3
   ])
}