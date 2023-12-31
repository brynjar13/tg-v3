var gl;
var points;
var locTime;
var iniTime;
var locColor;
var interval = 1000;

var color = vec4(1.0, 0.0, 0.5, 1.0);

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = new Float32Array([-1, -1, 0, 1, 1, -1]);

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    // Associate shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    locColor = gl.getUniformLocation( program, "rcolor" );
    gl.uniform4fv( locColor, flatten(color) );

    locTime = gl.getUniformLocation( program, "time" );

    iniTime = Date.now();

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    var msek = Date.now() - iniTime;
    if (msek > interval) {
        gl.uniform1f( locTime, msek );
        interval += 1000;
    }
    
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    
    window.requestAnimationFrame(render);
}
