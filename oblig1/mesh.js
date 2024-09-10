export const height = 4;
export const pRoofHeight = 3;

export const cubeMesh = new Float32Array([
    // Front face (two triangles)
    -1.0, 0.0,  1.0,  // Bottom-left
     1.0, 0.0,  1.0,  // Bottom-right
     1.0, height,  1.0,  // Top-right

    -1.0, 0.0,  1.0,  // Bottom-left
     1.0, height,  1.0,  // Top-right
    -1.0, height,  1.0,  // Top-left

    // Back face (two triangles)
    -1.0, 0.0, -1.0,  // Bottom-left
     1.0, 0.0, -1.0,  // Bottom-right
     1.0, height, -1.0,  // Top-right

    -1.0, 0.0, -1.0,  // Bottom-left
     1.0, height, -1.0,  // Top-right
    -1.0, height, -1.0,  // Top-left

    // Top face (two triangles)
    -1.0, height,  1.0,  // Front-left
     1.0, height,  1.0,  // Front-right
     1.0, height, -1.0,  // Back-right

    -1.0, height,  1.0,  // Front-left
     1.0, height, -1.0,  // Back-right
    -1.0, height, -1.0,  // Back-left

    /*
    // Bottom face (two triangles)
    -1.0, 0.0,  1.0,  // Front-left
     1.0, 0.0,  1.0,  // Front-right
     1.0, 0.0, -1.0,  // Back-right

    -1.0, 0.0,  1.0,  // Front-left
     1.0, 0.0, -1.0,  // Back-right
    -1.0, 0.0, -1.0,  // Back-left
    */

    // Right face (two triangles)
     1.0, 0.0,  1.0,  // Bottom-front
     1.0, 0.0, -1.0,  // Bottom-back
     1.0, height, -1.0,  // Top-back

     1.0, 0.0,  1.0,  // Bottom-front
     1.0, height, -1.0,  // Top-back
     1.0, height,  1.0,  // Top-front

    // Left face (two triangles)
    -1.0, 0.0,  1.0,  // Bottom-front
    -1.0, 0.0, -1.0,  // Bottom-back
    -1.0, height, -1.0,  // Top-back

    -1.0, 0.0,  1.0,  // Bottom-front
    -1.0, height, -1.0,  // Top-back
    -1.0, height,  1.0   // Top-front
]);

export const ground = new Float32Array([
    50, 0, 50,
    -50, 0, 50,
    50, 0, -50,
    
    50, 0, -50,
    -50, 0, -50,
    -50, 0, 50,
]);

export const pointedRoof = new Float32Array([
    // Bottom
    1.2, 0, -1.2,     // X Y Z
    1.2, 0, 1.2,      // X Y Z
    -1.2, 0, 1.2,     // X Y Z

    -1.2, 0, 1.2,     // X Y Z
    -1.2, 0, -1.2,    // X Y Z
    1.2, 0, -1.2,     // X Y Z

    // Front
    0, pRoofHeight, 0,      // X Y Z
    1.2, 0, 1.2,       // X Y Z
    -1.2, 0, 1.2,      // X Y Z

    // Back
    0, pRoofHeight, 0,     // X Y Z
    1.2, 0, -1.2,      // X Y Z
    -1.2, 0, -1.2,     // X Y Z

    // Left
    0, pRoofHeight, 0,       // X Y Z
    -1.2, 0, 1.2,      // X Y Z
    -1.2, 0, -1.2,      // X Y Z

    // Right
    0, pRoofHeight, 0,      // X Y Z
    1.2, 0, 1.2,     // X Y Z
    1.2, 0, -1.2,     // X Y Z

]);
