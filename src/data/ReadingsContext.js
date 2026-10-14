import React, { createContext, useContext, useState, useMemo } from 'react';
import { addDays, startOfDay } from '../utils/dates';
import { useAuth } from './AuthContext';

const ReadingsContext = createContext(null);

const initialReadings = [
  {
    id: 'r1',
    date: 'Ontem',
    time: '18:00',
    systolic: 118,
    diastolic: 78,
    glucose: 92,
  },
  {
    id: 'r2',
    date: 'Hoje',
    time: '09:30',
    systolic: 120,
    diastolic: 80,
    glucose: 95,
  },
];

const at = (days, h, m = 0) => {
  const d = addDays(startOfDay(new Date()), days);
  d.setHours(h, m, 0, 0);
  return d;
};

const initialMedications = [
  { id: 'm1', name: 'Glibenclamida', dose: '5mg', period: 'Manhã', time: '08:00', icon: 'pill', done: true },
  { id: 'm2', name: 'Losartana', dose: '50mg', period: 'Manhã', time: '08:00', icon: 'heart', done: false },
  { id: 'm3', name: 'Hidroclorotiazida', dose: '25mg', period: 'Almoço', time: '12:30', icon: 'drop', done: false },
  { id: 'm4', name: 'Insulina NPH (Xarope)', dose: '10 UI/mL', period: 'Jantar', time: '19:00', icon: 'syringe', done: false },
  { id: 'm5', name: 'Enalapril', dose: '10mg', period: 'Noite', time: '21:30', icon: 'heart', done: false },
];

const initialAppointments = [
  {
    id: 'c1',
    title: 'Consulta de Hipertensão - Dr. Carlos Mendes',
    type: 'hipertensao',
    date: at(0, 10),
    place: 'Hospital São Luiz - Sala 204',
  },
  {
    id: 'c2',
    title: 'Consulta de Diabetes - Dra. Ana Silva',
    type: 'diabetes',
    date: at(5, 15),
    place: 'Clínica Glicose - Sala A',
  },
  {
    id: 'c3',
    title: 'Consulta de Hipertensão - Dr. Carlos (Retorno)',
    type: 'hipertensao',
    date: at(-8, 9, 30),
    place: 'Hospital São Luiz - Sala 204',
  },
];

export function ReadingsProvider({ children }) {
  const [readings, setReadings] = useState(initialReadings);
  const [medications, setMedications] = useState(initialMedications);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [exportItems, setExportItems] = useState([
    { id: 'e1', kind: 'pressao', label: '120/80 mmHg', date: '12 Out' },
    { id: 'e2', kind: 'pressao', label: '118/78 mmHg', date: '10 Out' },
    { id: 'e3', kind: 'pressao', label: '118/78 mmHg', date: '11 Out' },
    { id: 'e4', kind: 'glicemia', label: '95 mg/dL', date: '12 Out' },
    { id: 'e5', kind: 'glicemia', label: '98 mg/dL', date: '11 Out' },
  ]);
  const { profile } = useAuth();
  const userName = (profile?.full_name || 'Você').split(' ')[0];

  const toggleMedication = (id) =>
    setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m)));

  const addMedication = ({ name, dose, period }) => {
    const times = { Manhã: '08:00', Almoço: '12:30', Jantar: '19:00', Noite: '21:30' };
    setMedications((prev) => [
      ...prev,
      { id: `m${Date.now()}`, name, dose, period, time: times[period] || '08:00', icon: 'pill', done: false },
    ]);
  };

  const addAppointment = ({ title, place, date }) =>
    setAppointments((prev) =>
      [...prev, { id: `c${Date.now()}`, title, place, date, type: /diabet/i.test(title) ? 'diabetes' : 'hipertensao' }]
        .sort((a, b) => a.date - b.date)
    );

  const removeExportItem = (id) => setExportItems((prev) => prev.filter((i) => i.id !== id));

  const addReading = ({ systolic, diastolic, glucose }) => {
    const now = new Date();
    const time = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newReading = {
      id: `r${Date.now()}`,
      date: 'Hoje',
      time,
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      glucose: Number(glucose),
    };
    setReadings((prev) => [...prev, newReading]);
    return newReading;
  };

  const latest = readings[readings.length - 1];

  const trend = useMemo(() => {
    const last8 = readings.slice(-8);
    return {
      systolic: last8.map((r) => r.systolic),
      diastolic: last8.map((r) => r.diastolic),
      glucose: last8.map((r) => r.glucose),
    };
  }, [readings]);

  const value = {
    readings,
    medications,
    userName,
    appointments,
    addAppointment,
    toggleMedication,
    addMedication,
    exportItems,
    removeExportItem,
    latest,
    trend,
    addReading,
  };

  return (
    <ReadingsContext.Provider value={value}>
      {children}
    </ReadingsContext.Provider>
  );
}

export function useReadings() {
  const ctx = useContext(ReadingsContext);
  if (!ctx) {
    throw new Error('useReadings deve ser usado dentro de ReadingsProvider');
  }
  return ctx;
}
