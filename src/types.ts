
export type Gender = 'Laki-laki' | 'Perempuan';

export interface ParentData {
  namaAyah?: string;
  nikAyah?: string;
  pekerjaanAyah?: string;
  penghasilanAyah?: string;
  namaIbu?: string;
  nikIbu?: string;
  pekerjaanIbu?: string;
  penghasilanIbu?: string;
}

export interface Student {
  id: string; // From Spreadsheet row or ID
  timestamp: string;
  nama: string;
  nik: string;
  nis: string; // Year + Class + 3 digits
  academicYear: '2627' | '2728' | '2829' | '2930';
  class: '01' | '02' | '03' | '04' | '05';
  gender: Gender;
  pob: string; // Tempat Lahir
  dob: string; // Tanggal Lahir
  address: string;
  parentData: ParentData;
}

export const ACADEMIC_YEARS = ['2627', '2728', '2829', '2930'] as const;
export const CLASSES = ['01', '02', '03', '04', '05'] as const;
