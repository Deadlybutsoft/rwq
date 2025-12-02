"use client"

import { useEffect, useRef } from "react"

export default function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) {
      console.error("WebGL not supported")
      return
    }

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    // Fragment shader source
    const fragmentShaderSource = `
      #ifdef GL_ES
      precision mediump float;
      #endif

      uniform vec2 u_resolution;
      uniform float u_time;

      const float pi = 3.1415926;

      vec3 palette3(float t, float factor) {
        vec3 a = vec3(0.5) + 0.3 * sin(vec3(0.1, 0.3, 0.5) * factor);
        vec3 b = vec3(0.5) + 0.3 * cos(vec3(0.2, 0.4, 0.6) * factor);
        vec3 c = vec3(1.0) + 0.5 * sin(vec3(0.3, 0.7, 0.9) * factor);
        vec3 d = vec3(0.25, 0.4, 0.55) + 0.2 * cos(vec3(0.5, 0.6, 0.7) * factor);
        return a + b * cos(6.28318 * (c * t + d));
      }

      vec2 rotate(vec2 pos, float angle) {
        float cosAngle = cos(angle);
        float sinAngle = sin(angle);
        mat2 rotationMatrix = mat2(cosAngle, -sinAngle, sinAngle, cosAngle);
        return rotationMatrix * pos;
      }

      float oscillate(float time, float minVal, float maxVal) {
        float sineWave = sin(time);
        float normalizedSine = (sineWave + 1.0) / 2.0;
        return mix(minVal, maxVal, normalizedSine);
      }

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
                   u.y);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy / u_resolution) * 2.0 - 1.0;
        vec2 centerUV = uv; // Store original UV for vignette calculation
        uv.x *= u_resolution.x / u_resolution.y;
        uv = rotate(uv, u_time * 0.03);
        uv *= 15.0;
        float t = u_time * 0.2;
        float r = length(uv);
        float a = atan(uv.y, uv.x);

        float N = 18.0;
        a = abs(mod(a, (pi * 2.0) / N) - pi / N);
        uv = vec2(cos(a), sin(a)) * r;
        uv *= noise(uv + u_time * oscillate(u_time * 0.01, 0.01, 0.1)) * 0.05;

        float v = 5.0 + 0.5 * sin(5.0 * uv.x + 10.0 * uv.y + t * 3.0) * (0.5 + 0.2 * sin(0.5 * r - t * 5.0));

        // Base lime color #D0FE17 (RGB: 208, 254, 23) - enhanced brightness
        vec3 limeColor = vec3(0.950, 1.0, 0.4);
        
        // Create variations based on the pattern with enhanced intensity
        float intensity = 0.8 + 0.8 * cos(pi * 2.0 * v * 0.1);
        vec3 col = limeColor * intensity;
        
        // Inverse vignette: make edges MORE visible instead of darker
        // This will boost visibility at top and bottom corners
        float distFromCenter = length(centerUV);
        float edgeBoost = smoothstep(0.3, 1.4, distFromCenter) * 0.6 + 1.2;
        col *= edgeBoost;
        
        gl_FragColor = vec4(col, 1.0);
      }
    `

    function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
      const shader = gl.createShader(type)
      if (!shader) return null

      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders:", gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }

      return shader
    }

    function createProgram(
      gl: WebGLRenderingContext,
      vertexShader: WebGLShader,
      fragmentShader: WebGLShader
    ): WebGLProgram | null {
      const program = gl.createProgram()
      if (!program) return null

      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program:", gl.getProgramInfoLog(program))
        return null
      }

      return program
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) return

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    const positions = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    gl.useProgram(program)

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
    const timeLocation = gl.getUniformLocation(program, "u_time")

    let animationFrameId: number

    function resize() {
      if (!canvas) return
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * devicePixelRatio)
      canvas.height = Math.floor(window.innerHeight * devicePixelRatio)
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"
    }

    function render(time: number) {
      if (!canvas) return

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.uniform1f(timeLocation, time * 0.001)

      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      animationFrameId = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener("resize", resize)
    animationFrameId = requestAnimationFrame(render)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: 1.0,
      }}
    />
  )
}
