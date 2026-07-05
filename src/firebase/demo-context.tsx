
'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type DemoRole = 'student' | 'faculty' | 'hod' | 'advisor' | 'admin';

export interface DemoProfile {
  uid: string;
  fullName: string;
  email: string;
  role: DemoRole;
  department: string;
  isApproved: boolean;
  rollNumber?: string;
  semester?: string;
  subject?: string;
  designation?: string;
  assignedBatch?: string;
  collegeName?: string;
}

const DEMO_PROFILES: Record<DemoRole, DemoProfile> = {
  student: {
    uid: 'demo-student-001',
    fullName: 'Demo Student',
    email: 'student@providence.edu.in',
    role: 'student',
    department: 'Computer Science',
    isApproved: true,
    rollNumber: 'PRC-CS-2024-001',
    semester: '4',
    assignedBatch: 'CS-A',
    collegeName: 'Providence College of Engineering',
  },
  faculty: {
    uid: 'demo-faculty-001',
    fullName: 'Demo Faculty',
    email: 'faculty@providence.edu.in',
    role: 'faculty',
    department: 'Computer Science',
    isApproved: true,
    subject: 'Data Structures',
    designation: 'Assistant Professor',
    assignedBatch: 'CS-A',
    collegeName: 'Providence College of Engineering',
  },
  hod: {
    uid: 'demo-hod-001',
    fullName: 'Demo HOD',
    email: 'hod@providence.edu.in',
    role: 'hod',
    department: 'Computer Science',
    isApproved: true,
    designation: 'Professor & Head',
    collegeName: 'Providence College of Engineering',
  },
  advisor: {
    uid: 'demo-advisor-001',
    fullName: 'Demo Advisor',
    email: 'advisor@providence.edu.in',
    role: 'advisor',
    department: 'Computer Science',
    isApproved: true,
    designation: 'Faculty Advisor',
    assignedBatch: 'CS-A',
    collegeName: 'Providence College of Engineering',
  },
  admin: {
    uid: 'demo-admin-001',
    fullName: 'System Administrator',
    email: 'admin@providence.edu.in',
    role: 'admin',
    department: 'Administration',
    isApproved: true,
    designation: 'System Admin',
    collegeName: 'Providence College of Engineering',
  },
};

interface DemoContextType {
  isDemo: boolean;
  demoRole: DemoRole | null;
  demoProfile: DemoProfile | null;
  loginDemo: (role: DemoRole) => void;
  logoutDemo: () => void;
}

const DemoContext = createContext<DemoContextType>({
  isDemo: false,
  demoRole: null,
  demoProfile: null,
  loginDemo: () => {},
  logoutDemo: () => {},
});

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [demoRole, setDemoRole] = useState<DemoRole | null>(null);

  const loginDemo = useCallback((role: DemoRole) => {
    setDemoRole(role);
  }, []);

  const logoutDemo = useCallback(() => {
    setDemoRole(null);
  }, []);

  const value = useMemo(() => ({
    isDemo: demoRole !== null,
    demoRole,
    demoProfile: demoRole ? DEMO_PROFILES[demoRole] : null,
    loginDemo,
    logoutDemo,
  }), [demoRole, loginDemo, logoutDemo]);

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  return useContext(DemoContext);
}

export { DEMO_PROFILES };
