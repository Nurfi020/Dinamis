import confetti from 'canvas-confetti';
import { LeadStatus, LeadSource, FollowUpMethod, FollowUpResult } from '../types';

export function formatIndonesianDate(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    // Check if today, yesterday, or tomorrow
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === -1) return 'Kemarin';
    if (diffDays === 1) return 'Besok';

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export function formatFullIndonesianDate(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function formatDisplayPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('08')) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }
  if (cleaned.startsWith('628')) {
    return `+62 ${cleaned.slice(2, 5)}-${cleaned.slice(5, 9)}-${cleaned.slice(9)}`;
  }
  return phone;
}

export function generateWhatsAppUrl(phone: string, name: string, product?: string, customText?: string): string {
  const cleaned = cleanPhoneNumber(phone);
  let message = customText;
  if (!message) {
    message = `Halo Kak ${name}, perkenalkan saya dari tim sales. Menindaklanjuti ketertarikan Kakak mengenai ${product || 'layanan kami'}, apakah ada yang bisa kami bantu jelaskan lebih lanjut?`;
  }
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function getStatusTheme(status: LeadStatus) {
  switch (status) {
    case 'Cold':
      return {
        bg: 'bg-[#1E3A8A]/30',
        text: 'text-[#60A5FA]',
        border: 'border-[#1D4ED8]/50',
        dot: 'bg-[#3B82F6]',
        glow: 'shadow-[0_0_12px_rgba(59,130,246,0.25)]',
        label: 'Cold',
        desc: 'Belum tertarik cukup',
      };
    case 'Warm':
      return {
        bg: 'bg-[#78350F]/30',
        text: 'text-[#FBBF24]',
        border: 'border-[#B45309]/50',
        dot: 'bg-[#EAB308]',
        glow: 'shadow-[0_0_12px_rgba(234,179,8,0.25)]',
        label: 'Warm',
        desc: 'Sudah tertarik',
      };
    case 'Hot':
      return {
        bg: 'bg-[#7F1D1D]/30',
        text: 'text-[#F87171]',
        border: 'border-[#B91C1C]/50',
        dot: 'bg-[#EF4444]',
        glow: 'shadow-[0_0_12px_rgba(239,68,68,0.25)]',
        label: 'Hot',
        desc: 'Peluang beli tinggi',
      };
    case 'Closing':
      return {
        bg: 'bg-[#064E3B]/30',
        text: 'text-[#34D399]',
        border: 'border-[#047857]/50',
        dot: 'bg-[#10B981]',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
        label: 'Closing',
        desc: 'Berhasil beli',
      };
    case 'Tidak Berhasil':
      return {
        bg: 'bg-[#334155]/40',
        text: 'text-[#94A3B8]',
        border: 'border-[#475569]/50',
        dot: 'bg-[#64748B]',
        glow: 'shadow-none',
        label: 'Tidak Berhasil',
        desc: 'Tidak lanjut',
      };
  }
}

export function isDateOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return target.getTime() < today.getTime();
}

export function isDateToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return target.getTime() === today.getTime();
}

export function isDateUpcoming(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return target.getTime() > today.getTime();
}

export function triggerClosingConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#168BFF', '#22D3EE', '#10B981', '#F59E0B'],
  });
}
