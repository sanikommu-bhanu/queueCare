import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...args) => twMerge(clsx(args));
export const pad = (n) => String(n).padStart(3, '0');
export const initials = (name) => name ? name.split(' ').map(p=>p[0]).join('').toUpperCase().slice(0,2) : '?';
export const formatWait = (mins) => {
  if (!mins || mins <= 0) return 'Now';
  if (mins < 60) return `${mins} min`;
  const h=Math.floor(mins/60), m=mins%60;
  return m>0 ? `${h}h ${m}m` : `${h}h`;
};

export const STATUS = {
  waiting: { bg:'#e8f4fd', text:'#0984e3', dot:'#0984e3', label:'Waiting' },
  called:  { bg:'#fef3c7', text:'#d97706', dot:'#f59e0b', label:'Called!' },
  serving: { bg:'#e8f8f5', text:'#00b894', dot:'#00b894', label:'In Consultation' },
  done:    { bg:'#f1f5f9', text:'#64748b', dot:'#94a3b8', label:'Done' },
  skipped: { bg:'#fff5f5', text:'#e17055', dot:'#e17055', label:'Skipped' },
};

export const SPECIALTY_STYLE = {
  'General Medicine':  { bg:'#e8f4fd', color:'#0984e3' },
  'Cardiology':        { bg:'#fff5f5', color:'#e17055' },
  'Neurology':         { bg:'#f3e8ff', color:'#7c3aed' },
  'Dentistry':         { bg:'#e0f2f1', color:'#00897b' },
  'Ophthalmology':     { bg:'#fef3c7', color:'#d97706' },
  'Multi-Specialty':   { bg:'#e8f8f5', color:'#00b894' },
  'Orthopedics':       { bg:'#fce7f3', color:'#db2777' },
  'Pediatrics':        { bg:'#ecfdf5', color:'#059669' },
  'Dermatology':       { bg:'#fff7ed', color:'#ea580c' },
  'ENT':               { bg:'#f0fdf4', color:'#16a34a' },
};
