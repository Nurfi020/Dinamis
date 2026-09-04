'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Navigation,
  X,
  Building,
  Sparkles,
} from 'lucide-react';
import { DemoSurvey, DemoLead } from './types';

interface SurveyViewProps {
  surveys: DemoSurvey[];
  leads: DemoLead[];
  onAddSurvey: (survey: Omit<DemoSurvey, 'id'>) => void;
  onUpdateStatus: (id: string, status: DemoSurvey['status']) => void;
}

const DUMMY_PRESET_LOCATIONS = [
  { address: 'Jl. Palagan Tentara Pelajar Km 9, Sleman, Yogyakarta', gps: '-7.7125, 110.3842' },
  { address: 'Jl. Senayan Utama No. 45, Kebayoran Baru, Jakarta Selatan', gps: '-6.2255, 106.8001' },
  { address: 'Kawasan Komersial BSD City Blok F-12, Tangerang Selatan', gps: '-6.3012, 106.6521' },
  { address: 'Jl. Raya Sayan No. 88, Ubud, Gianyar, Bali', gps: '-8.5069, 115.2625' },
];

export const SurveyView: React.FC<SurveyViewProps> = ({
  surveys,
  leads,
  onAddSurvey,
  onUpdateStatus,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [date, setDate] = useState('2026-09-08');
  const [locationAddress, setLocationAddress] = useState(DUMMY_PRESET_LOCATIONS[0].address);
  const [gpsCoords, setGpsCoords] = useState(DUMMY_PRESET_LOCATIONS[0].gps);
  const [notes, setNotes] = useState('Pengecekan struktur dak beton dan elevasi lantai.');

  const handleUsePresetLocation = (idx: number) => {
    setLocationAddress(DUMMY_PRESET_LOCATIONS[idx].address);
    setGpsCoords(DUMMY_PRESET_LOCATIONS[idx].gps);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === selectedLeadId) || leads[0];

    onAddSurvey({
      leadId: lead?.id || 'lead-custom',
      leadName: lead?.name || 'Klien Baru',
      projectTitle: lead?.projectType || 'Proyek Lapangan',
      date,
      locationAddress,
      gpsCoords: `${gpsCoords} (Akurasi ±3m)`,
      notes,
      status: 'Dijadwalkan',
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#16A36A]" />
            <h2 className="text-xl font-extrabold text-[#0B3D2E]">Modul Survei GPS Lapangan</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64756D] mt-0.5">
            Pencatatan jadwal survei, titik koordinat GPS lokasi, dan dokumentasi kondisi awal lapangan.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0B3D2E] text-white text-xs font-bold hover:bg-[#16A36A] transition shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Jadwalkan Survei</span>
        </button>
      </div>

      {/* Survey Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {surveys.map((srv) => (
          <div
            key={srv.id}
            className="rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs space-y-4 hover:border-[#16A36A] transition"
          >
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E2EAE5]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#16A36A] bg-[#EAF8F1] px-2 py-0.5 rounded">
                  {srv.date}
                </span>
                <h3 className="font-bold text-[#0B3D2E] text-base mt-1.5">{srv.projectTitle}</h3>
                <p className="text-xs text-[#64756D]">Klien: {srv.leadName}</p>
              </div>

              {/* Status Toggle */}
              <select
                value={srv.status}
                onChange={(e) =>
                  onUpdateStatus(srv.id, e.target.value as DemoSurvey['status'])
                }
                className="text-xs font-bold py-1 px-2.5 rounded-full bg-[#F7FAF8] text-[#0B3D2E] border border-[#D1DDD6] focus:outline-none cursor-pointer"
              >
                <option value="Dijadwalkan">Dijadwalkan</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[#10231B]">
                <Navigation className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Alamat Lokasi:</span>
              </div>
              <p className="text-[#64756D] leading-relaxed">{srv.locationAddress}</p>
              <div className="text-[11px] font-mono text-[#16A36A] font-bold">
                GPS: {srv.gpsCoords}
              </div>
            </div>

            {srv.notes && (
              <div className="text-xs text-[#64756D] space-y-1">
                <span className="font-bold text-[#10231B]">Catatan Survei Lapangan:</span>
                <p className="text-[11px] leading-relaxed bg-white p-3 rounded-xl border border-[#E2EAE5]">
                  &ldquo;{srv.notes}&rdquo;
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Jadwalkan Survei */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E2EAE5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
              <div className="flex items-center gap-2 text-[#0B3D2E] font-bold text-sm">
                <MapPin className="w-4 h-4 text-[#16A36A]" />
                <span>Jadwalkan Survei Lapangan Baru</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#64756D] hover:bg-[#F7FAF8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Pilih Calon Klien / Lead</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {l.projectType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Tanggal Rencana Survei</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              {/* Dummy GPS Location Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#10231B]">Lokasi & Titik GPS Contoh</label>
                  <span className="text-[10px] text-[#16A36A] font-semibold">
                    Klik untuk simulasi
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {DUMMY_PRESET_LOCATIONS.map((loc, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleUsePresetLocation(idx)}
                      className={`p-2.5 rounded-xl border text-left text-[11px] transition ${
                        locationAddress === loc.address
                          ? 'bg-[#EAF8F1] border-[#16A36A] text-[#0B3D2E] font-bold'
                          : 'bg-[#F7FAF8] border-[#E2EAE5] text-[#64756D] hover:bg-white'
                      }`}
                    >
                      <div className="truncate">{loc.address.split(',')[0]}</div>
                      <div className="text-[10px] font-mono text-[#16A36A] mt-0.5">{loc.gps}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Alamat Lengkap</label>
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Catatan Kondisi Lapangan</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#E2EAE5]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#64756D] hover:bg-[#F7FAF8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0B3D2E] text-white hover:bg-[#16A36A] transition shadow-xs active:scale-98"
                >
                  Simpan Jadwal Survei
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
