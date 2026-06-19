'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Eraser, Undo2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Stroke {
  points: { x: number; y: number }[]
  color: string
  thickness: number
}

const COLORS = ['#1a1a1a', '#ef4444', '#2563eb', '#16a34a', '#ea580c']
const THICKNESSES = [2, 4, 8]

export function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [selectedThickness, setSelectedThickness] = useState(THICKNESSES[1])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes

    for (const stroke of allStrokes) {
      if (stroke.points.length < 2) continue
      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.thickness
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
    }
  }, [strokes, currentStroke])

  useEffect(() => {
    redraw()
  }, [redraw])

  // Resize canvas to container
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      redraw()
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [redraw])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
    const pos = getPos(e)
    setCurrentStroke({ points: [pos], color: selectedColor, thickness: selectedThickness })
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStroke) return
    const pos = getPos(e)
    setCurrentStroke({ ...currentStroke, points: [...currentStroke.points, pos] })
  }

  const endDraw = () => {
    if (currentStroke && currentStroke.points.length > 1) {
      setStrokes([...strokes, currentStroke])
    }
    setCurrentStroke(null)
    setIsDrawing(false)
  }

  const undo = () => {
    setStrokes(strokes.slice(0, -1))
  }

  const clear = () => {
    setStrokes([])
  }

  return (
    <div className="flex h-full flex-col">
      {/* Canvas */}
      <div ref={containerRef} className="relative flex-1 cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          className="absolute inset-0 h-full w-full rounded-lg"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 border-t border-border bg-card px-3 py-2">
        {/* Colors */}
        <div className="flex gap-1.5">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={cn(
                'h-6 w-6 rounded-full border-2 transition-transform',
                selectedColor === color ? 'scale-125 border-primary' : 'border-border'
              )}
              style={{ backgroundColor: color }}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>

        {/* Thickness */}
        <div className="mx-2 h-5 w-px bg-border" />
        <div className="flex gap-1.5">
          {THICKNESSES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedThickness(t)}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded border transition-colors',
                selectedThickness === t ? 'border-primary bg-primary/20' : 'border-border'
              )}
              aria-label={`Thickness ${t}px`}
            >
              <div className="rounded-full bg-foreground" style={{ width: t * 2, height: t * 2 }} />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="mx-2 h-5 w-px bg-border" />
        <button
          onClick={undo}
          disabled={strokes.length === 0}
          className="flex h-7 items-center gap-1 rounded border border-border px-2 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Undo
        </button>
        <button
          onClick={clear}
          disabled={strokes.length === 0}
          className="flex h-7 items-center gap-1 rounded border border-border px-2 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>
    </div>
  )
}
