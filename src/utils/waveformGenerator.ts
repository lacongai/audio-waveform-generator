import { WaveformStyleType } from '../types';

export class WaveformGenerator {
  static draw(ctx: CanvasRenderingContext2D, width: number, height: number, data: Float32Array, style: WaveformStyleType, color: string, thickness: number, sensitivity: number, progress: number) {
    ctx.clearRect(0, 0, width, height);
    
    const centerY = height / 2;
    const visible = Math.floor(data.length * progress);

    if (style === 'circle') {
      const centerX = width / 2;
      const radius = Math.min(width, height) * 0.35;
      const count = Math.min(data.length, 360);
      const step = Math.floor(data.length / count);
      
      ctx.beginPath();
      for (let i = 0; i < Math.floor(count * progress); i++) {
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
    } 
    else if (style === 'bars') {
      const barWidth = Math.max(1, width / data.length);
      for (let i = 0; i < visible; i++) {
        const value = data[i] * sensitivity;
        const barHeight = value * height * 0.45;
        const x = i * barWidth;
        const y = centerY - barHeight;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight * 2);
      }
    }
    else if (style === 'horizontal') {
      const barHeight = Math.max(1, height / data.length);
      for (let i = 0; i < visible; i++) {
        const value = data[i] * sensitivity;
        const barWidth = value * width * 0.45;
        const y = i * barHeight;
        ctx.fillStyle = color;
        ctx.fillRect(0, y, barWidth, Math.max(1, barHeight - 1));
      }
    }
    else if (style === 'mirror') {
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
    }
    else if (style === '3d') {
      const barWidth = Math.max(1, width / data.length);
      for (let i = 0; i < visible; i++) {
        const value = data[i] * sensitivity;
        const barHeight = value * height * 0.4;
        const x = i * barWidth;
        const y = centerY - barHeight;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, Math.max(1, barWidth - 2), barHeight * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x + barWidth * 0.7, y, barWidth * 0.3, barHeight * 2);
      }
    }
    else if (style === 'heart') {
      const centerX = width / 2;
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
    }
    else if (style === 'logo') {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.3;
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
    }
    else {
      // line (default)
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
  }
}