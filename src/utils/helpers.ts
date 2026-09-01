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

export function formatRupiah(amount?: number | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

export type WhatsAppTemplateType = 'sapaan_awal' | 'followup_h3' | 'penawaran_khusus';

export function getWhatsAppTemplate(type: WhatsAppTemplateType, name: string, product?: string): string {
  const cleanName = name || 'Bpk/Ibu';
  const prodName = (product || 'layanan kami').split('—')[0].trim();
  switch (type) {
    case 'sapaan_awal':
      return `Halo Kak ${cleanName}, perkenalkan saya dari tim sales. Terima kasih atas ketertarikan Kakak terhadap ${prodName}. Apakah ada informasi detail mengenai spesifikasi atau penawaran yang ingin kami jelaskan?`;
    case 'followup_h3':
      return `Halo Kak ${cleanName}, semoga harinya menyenangkan. Saya ingin menindaklanjuti informasi mengenai ${prodName} yang kemarin sempat kita diskusikan. Apakah ada waktu yang nyaman untuk kita jadwalkan sesi diskusi singkat?`;
    case 'penawaran_khusus':
      return `Halo Kak ${cleanName}, ada kabar baik khusus minggu ini untuk pemesanan ${prodName}. Kami sedang ada program penawaran spesial dan bonus implementasi. Apakah Kakak berkenan kami kirimkan proposal resminya?`;
    default:
      return `Halo Kak ${cleanName}, menindaklanjuti ketertarikan mengenai ${prodName}, ada yang bisa kami bantu?`;
  }
}

export function generateWhatsAppUrl(phone: string, name: string, product?: string, customText?: string): string {
  const cleaned = cleanPhoneNumber(phone);
  let message = customText;
  if (!message) {
    message = getWhatsAppTemplate('sapaan_awal', name, product);
  }
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function getStatusTheme(status: LeadStatus) {
  switch (status) {
    case 'Cold':
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-[#64748B]',
        glow: 'shadow-none',
        label: 'Cold',
        desc: 'Belum cukup tertarik',
        badgeBg: 'bg-slate-200/70',
      };
    case 'Warm':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        dot: 'bg-[#F59E0B]',
        glow: 'shadow-none',
        label: 'Warm',
        desc: 'Tertarik & mempertimbangkan',
        badgeBg: 'bg-amber-100/70',
      };
    case 'Hot':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-[#EF4444]',
        glow: 'shadow-none',
        label: 'Hot',
        desc: 'Peluang beli tinggi',
        badgeBg: 'bg-rose-100/70',
      };
    case 'Closing':
      return {
        bg: 'bg-[#E8F7EF]',
        text: 'text-[#006B3C]',
        border: 'border-[#A7F3D0]',
        dot: 'bg-[#10B981]',
        glow: 'shadow-none',
        label: 'Closing',
        desc: 'Berhasil transaksi',
        badgeBg: 'bg-[#E8F7EF]',
      };
    case 'Tidak Berhasil':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border-gray-300',
        dot: 'bg-[#6B7280]',
        glow: 'shadow-none',
        label: 'Tidak Berhasil',
        desc: 'Tidak berlanjut',
        badgeBg: 'bg-gray-200/70',
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
  if (typeof window === 'undefined') return;
  try {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#00A651', '#10B981', '#006B3C', '#F59E0B', '#F4FBF7'],
    });
  } catch (e) {
    console.error('Confetti error:', e);
  }
}