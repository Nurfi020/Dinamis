'use client';

import React from 'react';
import Link from 'next/link';

export const ValueStrip: React.FC = () => {
  const values = [
    {
      num: '01',
      title: 'Software & CRM',
      desc: 'Kelola alur bisnis dengan sistem yang tepat.',
      micro: 'Lebih rapi.',
      href: '/crm',
    },
    {
      num: '02',
      title: 'AI Tools',
      desc: 'Asisten AI untuk tugas rutin dan follow-up.',
      micro: 'Lebih cepat.',
      href: '/ai-tools',
    },
    {
      num: '03',
      title: 'Digital Products',
      desc: 'Template, toolkit, dan panduan siap digunakan.',
      micro: 'Siap pakai.',
      href: '/digital-products',
    },
    {
      num: '04',
      title: 'Free Tools',
      desc: 'Kalkulator dan generator bisnis tanpa registrasi.',
      micro: 'Gratis.',
      href: '/free-tools',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-[#E2EAE5] text-[#10231B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-[#E2EAE5]">
          {values.map((val, idx) => (
            <Link
              key={idx}
              href={val.href}
              className={`pt-4 sm:pt-0 ${idx !== 0 ? 'lg:pl-8' : ''} group block hover:translate-y-[-1px] transition duration-150`}
            >
              <div className="flex items-baseline justify-between pr-2">
                <span className="text-xs font-mono font-bold text-[#16A36A]">
                  {val.num}
                </span>
                <span className="text-[10px] font-mono text-[#64756D] bg-[#F7FAF8] px-2 py-0.5 rounded border border-[#E2EAE5]">
                  {val.micro}
                </span>
              </div>
              <h3 className="font-bold text-[#0B3D2E] text-base group-hover:text-[#16A36A] transition mt-1.5">
                {val.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#64756D] leading-relaxed">
                {val.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
