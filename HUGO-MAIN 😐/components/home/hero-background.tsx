"use client"

import { useEffect, useRef } from "react"

class Renderer {
    private vertexSrc = "#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}"
    private fragmtSrc = "#version 300 es\nprecision highp float;\nout vec4 O;\nuniform float time;\nuniform vec2 resolution;\nvoid main() {\n\tvec2 uv=gl_FragCoord.xy/resolution;\n\tO=vec4(uv,sin(time)*.5+.5,1);\n}"
    private vertices = [-1, 1, -1, -1, 1, 1, 1, -1]

    canvas: HTMLCanvasElement
    scale: number
    gl: WebGL2RenderingContext
    shaderSource: string
    mouseCoords: number[]
    pointerCoords: number[]
    nbrOfPointers: number
    buffer?: WebGLBuffer
    program?: WebGLProgram
    vs?: WebGLShader
    fs?: WebGLShader

    constructor(canvas: HTMLCanvasElement, scale: number) {
        this.canvas = canvas
        this.scale = scale
        const gl = canvas.getContext("webgl2")
        if (!gl) throw new Error("WebGL2 not supported")
        this.gl = gl
        this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale)
        this.shaderSource = this.fragmtSrc
        this.mouseCoords = [0, 0]
        this.pointerCoords = [0, 0]
        this.nbrOfPointers = 0
    }

    get defaultSource() {
        return this.fragmtSrc
    }

    updateShader(source: string) {
        this.reset()
        this.shaderSource = source
        this.setup()
        this.init()
    }

    updateMouse(coords: number[]) {
        this.mouseCoords = coords
    }

    updatePointerCoords(coords: number[]) {
        this.pointerCoords = coords
    }

    updatePointerCount(nbr: number) {
        this.nbrOfPointers = nbr
    }

    updateScale(scale: number) {
        this.scale = scale
        this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale)
    }

    compile(shader: WebGLShader, source: string) {
        const gl = this.gl
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader))
            this.canvas.dispatchEvent(new CustomEvent('shader-error', {
                detail: gl.getShaderInfoLog(shader)
            }))
        }
    }

    test(source: string) {
        let result = null
        const gl = this.gl
        const shader = gl.createShader(gl.FRAGMENT_SHADER)
        if (!shader) return "Failed to create shader"

        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            result = gl.getShaderInfoLog(shader)
        }
        if (gl.getShaderParameter(shader, gl.DELETE_STATUS)) {
            gl.deleteShader(shader)
        }
        return result
    }

    reset() {
        const { gl, program, vs, fs } = this
        if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return
        if (vs && gl.getShaderParameter(vs, gl.DELETE_STATUS)) {
            gl.detachShader(program, vs)
            gl.deleteShader(vs)
        }
        if (fs && gl.getShaderParameter(fs, gl.DELETE_STATUS)) {
            gl.detachShader(program, fs)
            gl.deleteShader(fs)
        }
        gl.deleteProgram(program)
    }

    setup() {
        const gl = this.gl
        this.vs = gl.createShader(gl.VERTEX_SHADER)!
        this.fs = gl.createShader(gl.FRAGMENT_SHADER)!
        this.compile(this.vs, this.vertexSrc)
        this.compile(this.fs, this.shaderSource)
        this.program = gl.createProgram()!
        gl.attachShader(this.program, this.vs)
        gl.attachShader(this.program, this.fs)
        gl.linkProgram(this.program)
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(this.program))
        }
    }

    init() {
        const { gl, program } = this
        if (!program) return

        this.buffer = gl.createBuffer()!
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)
        const position = gl.getAttribLocation(program, "position")
        gl.enableVertexAttribArray(position)
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

            ; (program as any).resolution = gl.getUniformLocation(program, "resolution")
            ; (program as any).time = gl.getUniformLocation(program, "time")
            ; (program as any).touch = gl.getUniformLocation(program, "touch")
            ; (program as any).pointerCount = gl.getUniformLocation(program, "pointerCount")
            ; (program as any).pointers = gl.getUniformLocation(program, "pointers")
    }

    render(now = 0) {
        const { gl, program, buffer, canvas, mouseCoords, pointerCoords, nbrOfPointers } = this

        if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.useProgram(program)
        if (buffer) gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.uniform2f((program as any).resolution, canvas.width, canvas.height)
        gl.uniform1f((program as any).time, now * 1e-3)
        gl.uniform2f((program as any).touch, mouseCoords[0], mouseCoords[1])
        gl.uniform1i((program as any).pointerCount, nbrOfPointers)
        gl.uniform2fv((program as any).pointers, pointerCoords)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
}

const fragmentShaderSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*/   
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define FC gl_FragCoord.xy
#define R resolution
#define T time
#define hue(a) (.6+.6*cos(6.3*(a)+vec3(0,83,21)))
float rnd(float a) {
	vec2 p=fract(a*vec2(12.9898,78.233));	p+=dot(p,p*345.);
	return fract(p.x*p.y);
}
vec3 pattern(vec2 uv) {
	vec3 col=vec3(0);
	for (float i=.0; i++<20.;) {
		float a=rnd(i);
		vec2 n=vec2(a,fract(a*34.56)), p=sin(n*(T+7.)+T*.5);
		float d=dot(uv-p,uv-p);
		col+=.00125/d*hue(dot(uv,uv)+i*.125+T);
	}
	return col;
}
void main(void) {
	vec2 uv=(FC-.5*R)/min(R.x,R.y);
	vec3 col=vec3(0);
	float s=2.4,
	a=atan(uv.x,uv.y),
	b=length(uv);
	uv=vec2(a*5./6.28318,.05/tan(b)+T);
	uv=fract(uv)-.5;
	col+=pattern(uv*s);
	O=vec4(col,1);
}`

export default function HeroBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const dpr = Math.max(1, 0.5 * devicePixelRatio)

        const resize = () => {
            const { innerWidth: width, innerHeight: height } = window
            canvas.width = width * dpr
            canvas.height = height * dpr
            if (renderer) {
                renderer.updateScale(dpr)
            }
        }

        let renderer: Renderer | null = null

        try {
            renderer = new Renderer(canvas, dpr)
            renderer.setup()
            renderer.init()
            resize()

            if (renderer.test(fragmentShaderSource) === null) {
                renderer.updateShader(fragmentShaderSource)
            }

            window.addEventListener('resize', resize)

            let animationFrameId: number
            const loop = (now: number) => {
                if (renderer) {
                    renderer.render(now)
                }
                animationFrameId = requestAnimationFrame(loop)
            }
            loop(0)

            return () => {
                window.removeEventListener('resize', resize)
                cancelAnimationFrame(animationFrameId)
            }
        } catch (error) {
            console.error("WebGL initialization failed:", error)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{
                width: "100%",
                height: "100%",
                userSelect: "none",
            }}
        />
    )
}
