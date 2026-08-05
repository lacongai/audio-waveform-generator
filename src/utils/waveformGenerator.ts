import { WaveformStyleType } from '../types';

export class WaveformGenerator {
  static draw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: Float32Array,
    style: WaveformStyleType,
    color: string,
    thickness: number,
    sensitivity: number,
    progress: number
  ) {
    ctx.clearRect(0, 0, width, height);

    switch (style) {
      case 'line':
        this.drawLineSpectrum(ctx, width, height, data, color, thickness, sensitivity, progress);
        break;
      case 'bars':
        this.drawBars(ctx, width, height, data, color, thickness, sensitivity, progress);
        break;
      case 'mirror':
        this.drawMirror(ctx, width, height, data, color, thickness, sensitivity, progress);
        break;
      case 'circle':
        this.drawCircle(ctx, width, height, data, color, thickness, sensitivity, progress);
        break;
      default:
        this.drawLineSpectrum(ctx, width, height, data, color, thickness, sensitivity, progress);
    }
  }

  // ═══════════════════════════════════════════════════
  // 1. ĐƯỜNG THẲNG - GIỐNG CAPCUT/VIVAVIEW
  // ═══════════════════════════════════════════════════
  private static drawLineSpectrum(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: Float32Array,
    color: string,
    thickness: number,
    sensitivity: number,
    progress: number
  ) {
    const baseY = height * 0.82; // Đường ngang ở dưới
    const barWidth = Math.max(2, width / data.length);
    const visible = Math.floor(data.length * progress);

    // Vẽ đường ngang cố định
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(width, baseY);
    ctx.strokeStyle = color + '44';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Vẽ các cột sóng từ đường ngang lên trên
    for (let i = 0; i < visible; i++) {
      const value = data[i] * sensitivity;
      const barHeight = Math.max(1, value * height * 0.55);
      const x = i * barWidth;
      const y = baseY - barHeight;

      // Gradient từ màu chính xuống mờ dần
      const gradient = ctx.createLinearGradient(x, y, x, baseY);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.3, color);
      gradient.addColorStop(1, color + '22');
      ctx.fillStyle = gradient;

      // Bo góc nhẹ
      const radius = Math.min(barWidth / 2, 3);
      this.roundRect(ctx, x, y, Math.max(1, barWidth - 1), barHeight, radius);
      ctx.fill();
    }

    // Hiệu ứng glow ở đỉnh
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < visible; i++) {
      const value = data[i] * sensitivity;
      const barHeight = Math.max(1, value * height * 0.55);
      const x = i * barWidth;
      const y = baseY - barHeight;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, Math.max(1, barWidth - 1), 2);
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  // ═══════════════════════════════════════════════════
  // 2. THANH DỌC - EQUALIZER
  // ═══════════════════════════════════════════════════
  private static drawBars(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: Float32Array,
    color: string,
    thickness: number,
    sensitivity: number,
    progress: number
  ) {
    const centerY = height / 2;
    const barWidth = Math.max(2, width / data.length);
    const visible = Math.floor(data.length * progress);

    for (let i = 0; i < visible; i++) {
      const value = data[i] * sensitivity;
      const barHeight = Math.max(1, value * height * 0.42);
      const x = i * barWidth;
      const y = centerY - barHeight;

      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight * 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, color + '44');
      ctx.fillStyle = gradient;
      this.roundRect(ctx, x, y, Math.max(1, barWidth - 1), barHeight * 2, 2);
      ctx.fill();
    }
  }

  // ═══════════════════════════════════════════════════
  // 3. ĐỐI XỨNG - MIRROR
  // ═══════════════════════════════════════════════════
  private static drawMirror(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: Float32Array,
    color: string,
    thickness: number,
    sensitivity: number,
    progress: number
  ) {
    const centerY = height / 2;
    const visible = Math.floor(data.length * progress);
    const barWidth = Math.max(2, width / data.length);

    // Đường giữa
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.strokeStyle = color + '33';
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let i = 0; i < visible; i++) {
      const value = data[i] * sensitivity;
      const barHeight = Math.max(1, value * height * 0.4);
      const x = i * barWidth;

      // Trên
      const yTop = centerY - barHeight;
      const gradTop = ctx.createLinearGradient(x, yTop, x, centerY);
      gradTop.addColorStop(0, color);
      gradTop.addColorStop(0.5, color);
      gradTop.addColorStop(1, color + '33');
      ctx.fillStyle = gradTop;
      this.roundRect(ctx, x, yTop, Math.max(1, barWidth - 1), barHeight, 1);
      ctx.fill();

      // Dưới
      const gradBottom = ctx.createLinearGradient(x, centerY, x, centerY + barHeight);
      gradBottom.addColorStop(0, color + '33');
      gradBottom.addColorStop(0.5, color);
      gradBottom.addColorStop(1, color);
      ctx.fillStyle = gradBottom;
      this.roundRect(ctx, x, centerY, Math.max(1, barWidth - 1), barHeight, 1);
      ctx.fill();
    }
  }

  // ═══════════════════════════════════════════════════
  // 4. TRÒN - CIRCLE
  // ═══════════════════════════════════════════════════
  private static drawCircle(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: Float32Array,
    color: string,
    thickness: number,
    sensitivity: number,
    progress: number
  ) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    const count = Math.min(data.length, 180);
    const visible = Math.floor(count * progress);
    const step = Math.floor(data.length / count);

    for (let i = 0; i < visible; i++) {
      const value = data[Math.min(i * step, data.length - 1)] * sensitivity;
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const r = radius + value * radius * 0.4;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      const size = Math.max(1, value * 8 + 2);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.3 + value * 0.7;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color + '33';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private static roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}