import { Student } from '../types';

const STORAGE_KEY = 'ppdb_data_mock';

export const gasService = {
  async getStudents(): Promise<Student[]> {
    const gasUrl = import.meta.env.VITE_GAS_URL;
    if (!gasUrl) {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    
    try {
      const response = await fetch(gasUrl);
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  },

  async saveStudent(student: Omit<Student, 'id' | 'timestamp'>, id?: string): Promise<boolean> {
    const gasUrl = import.meta.env.VITE_GAS_URL;
    if (!gasUrl) {
      const stored = localStorage.getItem(STORAGE_KEY);
      const students: Student[] = stored ? JSON.parse(stored) : [];
      
      if (id) {
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
          students[index] = { ...students[index], ...student };
        }
      } else {
        const newStudent: Student = {
          ...student,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString()
        };
        students.unshift(newStudent); // Newest at top
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
      return true;
    }

    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: id ? 'UPDATE' : 'CREATE',
          data: { ...student, id }
        })
      });
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Post error:', error);
      return false;
    }
  },

  async deleteStudent(id: string): Promise<boolean> {
    const gasUrl = import.meta.env.VITE_GAS_URL;
    if (!gasUrl) {
      const stored = localStorage.getItem(STORAGE_KEY);
      let students: Student[] = stored ? JSON.parse(stored) : [];
      students = students.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
      return true;
    }

    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE',
          data: { id }
        })
      });
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }
};
