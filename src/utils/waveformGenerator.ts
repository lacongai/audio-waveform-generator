import { WaveformStyleType } from '../types';

export interface WaveformDrawOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  data: Float32Array;
  style: WaveformStyleType;
  color: string;
  thickness: number;
  sensitivity: number;
  glow: boolean;
  glowIntensity: number;
  opacity: number;
  progress?: number;
  particles?: boolean;
  particleCount?: number;
}

export class WaveformGenerator {
  static draw(options: WaveformDrawOptions): void {
    const { 
      ctx, width, height, data, style, color, thickness, 
      sensitivity, glow, glowIntensity, opacity = 1,
      progress = 1, particles = false, particleCount = 100 
    } = options;

    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = opacity;

    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = glowIntensity * 30;
    }

    const drawMethods: Record<WaveformStyleType, Function> = {
      circle: this.drawCircle,
      line: this.drawLine,
      bars: this.drawBars,
      horizontal: this.drawHorizontal,
      mirror: this.drawMirror,
      '3d': this.draw3D,
      heart: this.drawHeart,
      logo: this.drawLogo,
      spiral: this.drawSpiral,
      radial: this.drawRadial
    };

    const method = drawMethods[style] || this.drawLine;
    method.call(this, ctx, width, height, data, color, thickness, sensitivity, progress);

    if (particles) {
      this.drawParticles(ctx, width, height, data, color, particleCount);
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  private static drawCircle(ctx: CanvasRenderingContext2D, width: number, height: number, data: Float32Array, color: string, thickness: number, sensitivity: number, progress: number) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    const count = Math.min(data.length, 360);
    const step = Math.floor(data.length / count);
    const visible = Math.floor(count * progress);

    ctx.beginPath();
    for (let i = 0; i < visible; i++) {
      const angle = (i / count) * Math.PI * 2;
      const value = data[Math.min(i * step, data.length - 1)] * sensitivity;
      const r = radius + value * radius * 0.5;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();

    // Fill gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.2);
    gradient.addColorStop(0, color + '33');
    gradient.addColorStop(0.5, color + '11');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  private static drawLine(ctx: CanvasRenderingContext2D, width: number, height: number, data: Float32Array, color: string, thickness: number, sensitivity: number, progress: number) {
    const centerY = height / 2;
    const visible = Math.floor(data.length * progress);

    // Fill under curve
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let i = 0; i < visible; i++) {
      const x = (i / data.length) * width;
      const y = centerY - data[i] * height * 0.45 * sensitivity;
      ctx.lineTo(x, y);
    }
    ctx.lineTo((visible / data.length) * width, height);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color + '66');
    gradient.addColorStop(0.5, color + '33');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Main line
    ctx.beginPath();
    for (let i = 0; i < visible; i++) {
      const x = (i / data.length) * width;
      const y = centerY - data[i] * height * 0.45 * sensitivity;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
  }

  private static drawBars(ctx: CanvasRenderingContext2D, width: number, height: number, data: Float32Array, color: string, thickness: number, sensitivity: number, progress: number) {
    const centerY = height / 2;
    const visible = Math.floor(data.length * progress);
    const barWidth = Math.max(1, width / data.length);

    for (let i = 0; i < visible; i++) {
      const value = data[i] * sensitivity;
      const barHeight = value * height * 0.45;
      const x = i * barWidth;
      const y = centerY - barHeight;
      
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight * 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, color + '88');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight * 2);
    }
  }

  private static drawHorizontal(ctx: CanvasRenderingContext2D, width: number, height: number, data: Float32Array, color: string, thickness: number, sensitivity: number, progress: number) {
    const visible = Math.floor(data.length * progress);
    const barHeight = Math.max(1, height / data.length);

    for (let i = 0; i < visible; i++) {
      const value = data[i] * sensitivity;
      const barWidth = value * width * 0.45;
      const y = i * barHeight;
      
      const gradient = ctx.createLinearGradient(0, y, barWidth, y);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + '33');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y, barWidth, Math.max(1, barHeight - 1));
    }
  }

  private static drawMirror(ctx: CanvasRenderingContext2D, width: number, height: number, data: Float32Array, color: string, thickness: number, sensitivity: number, progress: number) {
    const centerY = height / 2;
    const visible = Math.floor(data.length * progress);

    // Top
    ctx.beginPath();
    for (let i = 0; i < visible; i++) {
      const x = (i / data.length) * width;
      const y = centerY - data[i] * height * 0.45 * sensitivity;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();

    // Bottom mirror
    ctx.beginPath();
    for (let i = 0; i < visible; i++) {
      const x = (i / data.length) * width;
      const y = centerY + data[i] * height * 0.45 * sensitivity;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = thickness * 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Fill between
    ctx.beginPath();
    for (let i = 0; i < visible; i++) {
      const x = (i / data.length) * width;
      const y = centerY - data[i] * height * 0.45 * sensitivity;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    for (let i = visible - 1; i >= 0; i--) {
      const x = (i / data.length) * width;
      const y = centerY + data[i] * height * 0.45 * sensitivity;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color + '33');
    gradient.addColorStop(0.5, color + '11');
    gradient.addColorStop(1, color + '33');
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  private static draw3D(ctx: CanvasRenderingContext2D, width: number, height: number, data: Float32Array, color: string, thickness: number, sensitivity: number, progress: number) {
    const centerY = height / 2;
    const visible = Math.floor(data.length * progress);
    const barWidth = Math.max(1, width / data.length);

    for (let i = 0; i < visible; i++) {
      const value = data[i] * sensitivity;
      const barHeight = value * height * 0.4;
      const x = i * barWidth;
      const y = centerY - barHeight;

      // Front face
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight * 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, color + '88');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, Math.max(1, barWidth - 2), barHeight * 2);

      // Top face (3D effect)
      ctx.fillStyle = color + '44';
      ctx.fillRect(x, y - barHeight * 0.1, Math.max(1, barWidth - 2), barHeight * 0.1);
      
      // Right face (shadow)
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(x + barWidth * 0.7, y, barWidth * 0.3, barHeight * 2);
    }
  }

  private static drawHeart(ctx: CanvasRenderingContext2D, width: number, height: number, data: Float32Array, color: string, thickness: number, sensitivity: number, progress: number) {
    const centerX = width / 2;
    const centerY = height / 2;
    const visible = Math.floor(data.length * progress);
    const scale = Math.min(width, height) * 0.25;

    ctx.beginPath();
    for (let i = 0; i < visible; i++) {
      const value = data[i] * sensitivity;
      const t = (i / data.length) * Math.PI * 2;
      
      const heartX = 16 * Math.pow(Math.sin(t), 3);
      const heartY = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      
      const x = centerX + heartX * scale * 0.03 * (1 + value * 0.5);
      const y = centerY - heartY * scale * 0.03 * (1 + value * 0.5);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();

    // Fill heart
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, scale);
    gradient.addColorStop(0, color + '66');
    gradient.addColorStop(0.7, color + '33');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  private static drawLogo(ctx: CanvasRenderingContext2D, width: number, height: number, data: Float32Array, color: string, thickness: number, sensitivity: number, progress: number) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    const visible = Math.floor(data.length * progress);

    // Logo ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color + '44';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Waveform inside logo
    for (let i = 0; i < visible; i++) {
      const value = data[i] * sensitivity;
      const angle = (i / data.length) * Math.PI * 2;
      const r = radius + value * radius * 0.3;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      const size = Math.max(2, thickness * value * 3);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.3 + value * 0.7;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Center logo text
    ctx.fillStyle = color + '88';
    ctx.font = `${radius * 0.3}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♪', centerX, centerY);
  }

  private static drawSpiral(ctx: CanvasRenderingContext2D, width: number, height: number, data: Float32Array, color: string, thickness: number, sensitivity: number, progress: number) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    const visible = Math.floor(data.length * progress);
    const turns = 3;

    ctx.beginPath();
    for (let i = 0; i < visible; i++) {
      const value = data[i] * sensitivity;
      const t = i / data.length;
      const angle = t * Math.PI * 2 * turns;
      const radius = t * maxRadius * (1 + value * 0.3);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();

    // Glow trail
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0, color + '22');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  private static drawRadial(ctx: CanvasRenderingContext2D, width: number, height: number, data: Float32Array, color: string, thickness: number, sensitivity: number, progress: number) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.45;
    const count = Math.min(data.length, 180);
    const visible = Math.floor(count * progress);
    const step = Math.floor(data.length / count);

    for (let i = 0; i < visible; i++) {
      const value = data[Math.min(i * step, data.length - 1)] * sensitivity;
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const r = maxRadius * (0.1 + value * 0.9);
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
      gradient.addColorStop(0, color + '99');
      gradient.addColorStop(0.5, color + '55');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(2, value * 20), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private static drawParticles(ctx: CanvasRenderingContext2D, width: number, height: number, data: Float32Array, color: string, count: number) {
    const centerY = height / 2;
    
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * data.length);
      const value = data[index] || 0;
      const x = Math.random() * width;
      const y = centerY - value * height * 0.45 * 0.8 + (Math.random() - 0.5) * 20;
      const size = Math.max(1, value * 5 + Math.random() * 2);
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.2 + value * 0.6;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}