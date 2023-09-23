var gl;

// Global variables (accessed in render)
var locPosition;
var locColor;
var bufferIdA;
var bufferIdB;
var colorA = vec4(1.0, 0.0, 0.0, 1.0);
var colorB = vec4(0.0, 1.0, 0.0, 1.0);

// Núverandi staðsetning miðju ferningsins
var box = vec2( 0.0, 0.0 );

// Stefna (og hraði) fernings
var dX;
var dY;

// Svæðið er frá -maxX til maxX og -maxY til maxY
var maxX = 1.0;
var maxY = 1.0;

// Hálf breidd/hæð ferningsins
var boxRad = 0.05;
var mouseX;             // Old value of x-coordinate  
var movement = false;   // Do we move the paddle?

// Ferningurinn er upphaflega í miðjunni
var vertices = new Float32Array([-0.05, -0.05, 0.05, -0.05, 0.05, 0.05, -0.05, 0.05]);
var paddle_vertices = [
    vec2( -0.1, -0.9 ),
    vec2( -0.1, -0.86 ),
    vec2(  0.1, -0.86 ),
    vec2(  0.1, -0.9 ) 
];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    dX = Math.random()*0.04-0.02;
    dY = Math.random()*0.04-0.02;
    
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 0.9, 0.9, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Define two VBOs and load the data into the GPU
    bufferIdA = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(paddle_vertices), gl.STATIC_DRAW );

    bufferIdB = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdB );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Get location of shader variable vPosition
    locPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( locPosition );

    locColor = gl.getUniformLocation( program, "rcolor" );
    locBox = gl.getUniformLocation( program, "boxPos" );
    type = gl.getUniformLocation(program, "type");

    // Event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        mouseX = e.offsetX;
    } );
    
    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );
    
    canvas.addEventListener("mousemove", function(e){
        if(movement) {
            var xmove = 2*(e.offsetX - mouseX)/canvas.width;
            mouseX = e.offsetX;
            for(i=0; i<4; i++) {
                paddle_vertices[i][0] += xmove;
            }
    
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdA);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(paddle_vertices));
        }
    } );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Draw paddle 
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform2fv(type, vec2(1, 1));
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );


    // Láta ferninginn skoppa af veggjunum
    if (Math.abs(box[0] + dX) > maxX - boxRad) dX = -dX;
    if (box[1] + dY > maxY - boxRad) dY = -dY;
    if (Math.abs(box[1] + dY) > 0.86 && Math.abs(box[1] + dY) < 0.9 && box[0] > paddle_vertices[0][0] && box[0] < paddle_vertices[2][0]) dY = -dY;

    // Uppfæra staðsetningu
    box[0] += dX;
    box[1] += dY;
    // draw box
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdB );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorB) );
    gl.uniform2fv(type, vec2(0, 0));
    gl.uniform2fv( locBox, flatten(box) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    window.requestAnimationFrame(render);
}
