// ─── CURATED REAL UNSPLASH IMAGES ─────────────────────────────────────────────
// All images are free to use (Unsplash license)

export const HERO_IMAGES = {
  hospital1:  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=900&q=90',  // modern hospital lobby
  hospital2:  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=90',  // clinic hallway
  reception:  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90',  // hospital exterior
  doctors:    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=90',  // doctors team
  waiting:    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=900&q=90',  // hospital interior
};

export const ONBOARDING_IMAGES = [
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=900&q=90',  // hospital lobby
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=90',  // clinic digital screen
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90',     // doctor with phone
];

export const CLINIC_IMAGES = {
  general:    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=85',
  cardiology: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=600&q=85',
  neurology:  'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&q=85',
  dental:     'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=85',
  eye:        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=85',
  multi:      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=85',
  ortho:      'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=85',
  pediatric:  'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=85',
};

export const DOCTOR_IMAGES = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=85',  // male doctor smiling
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=85',  // female doctor
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=85',  // male doctor stethoscope
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=85',     // female doctor smiling
  'https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&q=85',  // doctor with tablet
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=85',  // doctor in clinic
];

export const PATIENT_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',  // male
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',  // female
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',  // male
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',  // female
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',  // male
  'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&q=80',     // female
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&q=80',  // male
];

// Full clinic data with real images, doctors, ratings
export const DEMO_CLINICS = [
  {
    id: 'c1',
    name: 'Apollo Clinic',
    specialty: 'General Medicine',
    address: '14 MG Road, Koramangala',
    city: 'Bangalore',
    phone: '+91 80 2345 6789',
    image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=85',
    rating: 4.8,
    reviews: 2840,
    avg_wait_minutes: 12,
    queue_size: 8,
    current_token: 3,
    is_open: true,
    timing: '8:00 AM – 8:00 PM',
    doctor: { name: 'Dr. Arjun Mehta', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=85', exp: '12 yrs' },
  },
  {
    id: 'c2',
    name: 'City Heart Center',
    specialty: 'Cardiology',
    address: '22 Park Street, Sector 5',
    city: 'Delhi',
    phone: '+91 11 9876 5432',
    image_url: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=600&q=85',
    rating: 4.6,
    reviews: 1530,
    avg_wait_minutes: 20,
    queue_size: 5,
    current_token: 2,
    is_open: true,
    timing: '9:00 AM – 6:00 PM',
    doctor: { name: 'Dr. Priya Sharma', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=85', exp: '18 yrs' },
  },
  {
    id: 'c3',
    name: 'NeuroLife Clinic',
    specialty: 'Neurology',
    address: '8 Lake View Road, Bandra',
    city: 'Mumbai',
    phone: '+91 22 5678 9012',
    image_url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&q=85',
    rating: 4.7,
    reviews: 980,
    avg_wait_minutes: 18,
    queue_size: 12,
    current_token: 7,
    is_open: true,
    timing: '10:00 AM – 7:00 PM',
    doctor: { name: 'Dr. Vikram Nair', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&q=85', exp: '15 yrs' },
  },
  {
    id: 'c4',
    name: 'Smile Dental Studio',
    specialty: 'Dentistry',
    address: '3 Commercial Street, Jayanagar',
    city: 'Bangalore',
    phone: '+91 80 3456 7890',
    image_url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=85',
    rating: 4.9,
    reviews: 3200,
    avg_wait_minutes: 10,
    queue_size: 3,
    current_token: 1,
    is_open: true,
    timing: '9:00 AM – 9:00 PM',
    doctor: { name: 'Dr. Ananya Patel', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=85', exp: '9 yrs' },
  },
  {
    id: 'c5',
    name: 'ClearVision Eye Care',
    specialty: 'Ophthalmology',
    address: '67 Anna Salai, T Nagar',
    city: 'Chennai',
    phone: '+91 44 7890 1234',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=85',
    rating: 4.5,
    reviews: 760,
    avg_wait_minutes: 15,
    queue_size: 6,
    current_token: 4,
    is_open: true,
    timing: '8:30 AM – 5:30 PM',
    doctor: { name: 'Dr. Rohan Das', img: 'https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=300&q=85', exp: '11 yrs' },
  },
  {
    id: 'c6',
    name: 'Medilife Super Speciality',
    specialty: 'Multi-Specialty',
    address: '45 Hiranandani Gardens, Powai',
    city: 'Mumbai',
    phone: '+91 22 4567 8901',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=85',
    rating: 4.7,
    reviews: 4100,
    avg_wait_minutes: 25,
    queue_size: 20,
    current_token: 12,
    is_open: true,
    timing: '24 Hours',
    doctor: { name: 'Dr. Meera Krishnan', img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&q=85', exp: '22 yrs' },
  },
  {
    id: 'c7',
    name: 'OrthoPlus Bone & Joint',
    specialty: 'Orthopedics',
    address: '12 Jubilee Hills, Road No. 36',
    city: 'Hyderabad',
    phone: '+91 40 2345 6789',
    image_url: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=85',
    rating: 4.6,
    reviews: 1240,
    avg_wait_minutes: 22,
    queue_size: 9,
    current_token: 5,
    is_open: true,
    timing: '9:00 AM – 7:00 PM',
    doctor: { name: 'Dr. Suresh Kumar', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=85', exp: '16 yrs' },
  },
  {
    id: 'c8',
    name: 'Little Stars Pediatrics',
    specialty: 'Pediatrics',
    address: '5 Residency Road, Shivajinagar',
    city: 'Pune',
    phone: '+91 20 3456 7890',
    image_url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=85',
    rating: 4.9,
    reviews: 2100,
    avg_wait_minutes: 14,
    queue_size: 7,
    current_token: 3,
    is_open: true,
    timing: '8:00 AM – 8:00 PM',
    doctor: { name: 'Dr. Kavya Reddy', img: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=300&q=85', exp: '10 yrs' },
  },
];

export const DEMO_QUEUE_PATIENTS = [
  { id:'t1', token_number:1, patient_name:'Priya Sharma',    avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', reason:'General Checkup',     status:'done' },
  { id:'t2', token_number:2, patient_name:'Rahul Mehta',     avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', reason:'Follow-up Visit',    status:'done' },
  { id:'t3', token_number:3, patient_name:'Ananya Patel',    avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', reason:'Prescription Renewal',status:'called' },
  { id:'t4', token_number:4, patient_name:'Vikram Singh',    avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', reason:'Lab Report Review',  status:'waiting' },
  { id:'t5', token_number:5, patient_name:'Meera Nair',      avatar:'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&q=80', reason:'New Complaint',      status:'waiting' },
  { id:'t6', token_number:6, patient_name:'Arjun Kumar',     avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', reason:'General Checkup',   status:'waiting' },
  { id:'t7', token_number:7, patient_name:'Divya Rao',       avatar:'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&q=80', reason:'Follow-up Visit',   status:'waiting' },
];
