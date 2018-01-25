var StaticVertexBufferObject = /** @class */ (function () {
    function StaticVertexBufferObject(gl, drawArraysMode, vertexData) {
        this.drawArraysMode = drawArraysMode;
        this.buffer = null;
        this.gl = null;
        this.bufferLength = 0;
        this.count = 0;
        this.buffer = gl.createBuffer();
        if (!this.buffer)
            return;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        this.bufferLength = vertexData.length * 4;
        this.count = vertexData.length / 4;
        this.gl = gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    StaticVertexBufferObject.prototype.Render = function (vertexLoc) {
        if (!this.buffer || !this.gl || vertexLoc < 0)
            return;
        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(vertexLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexLoc);
        gl.drawArrays(this.drawArraysMode, 0, this.count);
        gl.disableVertexAttribArray(vertexLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    return StaticVertexBufferObject;
}());
var ShaderProgram = /** @class */ (function () {
    function ShaderProgram(gl, vertShaderSource, fragShaderSource) {
        this.gl = gl;
        this.vertShaderSource = vertShaderSource;
        this.fragShaderSource = fragShaderSource;
        this.program_ = null;
        var vshader = this.createShader(gl.VERTEX_SHADER, vertShaderSource);
        var fshader = this.createShader(gl.FRAGMENT_SHADER, fragShaderSource);
        if (!vshader || !fshader)
            return;
        this.program_ = gl.createProgram();
        if (!this.program_)
            return;
        gl.attachShader(this.program_, vshader);
        gl.attachShader(this.program_, fshader);
        gl.linkProgram(this.program_);
        if (!gl.getProgramParameter(this.program_, gl.LINK_STATUS)) {
            console.error("Program Link Error");
            console.error(this.gl.getProgramInfoLog(this.program_));
            gl.deleteShader(vshader);
            gl.deleteShader(fshader);
            gl.deleteProgram(this.program_);
            this.program_ = null;
            return;
        }
    }
    ShaderProgram.prototype.Use = function () {
        if (!this.program_)
            return;
        this.gl.useProgram(this.program_);
    };
    ShaderProgram.prototype.GetVertexPosition = function (vertexName) {
        return this.gl.getAttribLocation(this.program_, vertexName);
    };
    ShaderProgram.prototype.createShader = function (type, sourceCode) {
        var shader = this.gl.createShader(type);
        if (!shader)
            return null;
        this.gl.shaderSource(shader, sourceCode);
        this.gl.compileShader(shader);
        var status = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!status) {
            if (type == this.gl.VERTEX_SHADER)
                console.error("Vertex shader compile error");
            if (type == this.gl.FRAGMENT_SHADER)
                console.error("Fragment shader compile error");
            console.error(this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    };
    return ShaderProgram;
}());
var MyWebGLAppHW0 = /** @class */ (function () {
    function MyWebGLAppHW0(width, height) {
        if (width === void 0) { width = 512; }
        if (height === void 0) { height = 384; }
        this.width = width;
        this.height = height;
        this.divElement_ = null;
        this.canvasElement_ = null;
        this.gl = null;
        this.vbo = null;
        this.program = null;
        this.divElement_ = document.createElement("div");
        this.canvasElement_ = document.createElement("canvas");
        if (this.canvasElement_) {
            this.gl = this.canvasElement_.getContext("webgl");
            if (!this.gl) {
                this.gl = this.canvasElement_.getContext("experimental-webgl");
            }
            if (!this.gl) {
                this.canvasElement_ = null;
                this.divElement_.innerText = "WebGL not supported.";
            }
            else {
                this.divElement_.appendChild(this.canvasElement_);
                this.divElement_.align = "center";
            }
        }
        document.body.appendChild(this.divElement_);
    }
    MyWebGLAppHW0.prototype.run = function () {
        if (!this.gl)
            return;
        this.init(this.gl);
        this.mainloop(0);
    };
    MyWebGLAppHW0.prototype.mainloop = function (timestamp) {
        var self = this;
        this.display(timestamp / 1000.0);
        window.requestAnimationFrame(function (t) {
            self.mainloop(t);
        });
    };
    MyWebGLAppHW0.prototype.init = function (gl) {
        this.vbo = new StaticVertexBufferObject(gl, gl.TRIANGLES, new Float32Array([
            -1, -1, 0, 1,
            1, -1, 0, 1,
            0, 1, 0, 1
        ]));
        this.program = new ShaderProgram(gl, "attribute vec4 position; void main(){ gl_Position = position; }", "void main() { gl_FragColor = vec4(1.0, 0., 0., 1.0); }");
    };
    MyWebGLAppHW0.prototype.display = function (t) {
        if (!this.gl || !this.canvasElement_)
            return;
        var gl = this.gl;
        // gl.clearColor(0.2, 0.15 * Math.sin(t) + 0.15, 0.4, 1.0);
        gl.clearColor(0., 0., 0., 1.);
        gl.clear(this.gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, this.canvasElement_.width, this.canvasElement_.height);
        if (this.vbo && this.program) {
            this.program.Use();
            this.vbo.Render(this.program.GetVertexPosition("position"));
        }
        gl.useProgram(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    return MyWebGLAppHW0;
}());
