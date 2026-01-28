
import React from 'react';

export const APP_CONFIG = {
  TITLE: 'Med-Symptom Assistant',
  SUBTITLE: 'Educational Health Awareness & Clinical Reasoning Exploration Tool',
  AUTHORS: 'Talha & Vareesha',
  INSTITUTION: 'Khyber Medical College, Peshawar',
  BATCH: 'Batch of 2030',
  COPYRIGHT: '© 2026 Med-Symptom Assistant. All Rights Reserved.',
  MANDATORY_DISCLAIMER: 'This information is provided for educational and informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare professional with any questions regarding a medical condition. In case of emergency, contact local emergency services immediately.',
  MOTTO: 'Our Aim Is To Transform Patient Care In Pakistan'
};

export const BLOGS = [
  {
    id: '1',
    date: 'Jan 28, 2026',
    title: 'The Future of Clinical Reasoning: Bridging AI and Medical Expertise',
    excerpt: 'Exploring how second-year medical students are leveraging generative models to enhance educational clinical reasoning and patient awareness across Pakistan.',
    author: 'Talha & Vareesha'
  }
];

export const FOUNDERS = {
  talha: {
    name: 'Talha',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
    bio: 'Second-year medical student at KMC with a focus on integrating AI into clinical diagnostics and healthcare accessibility. Passionate about health tech innovation in Pakistan.',
    socials: {
      linkedin: 'https://linkedin.com/in/talha',
      twitter: 'https://twitter.com/talha',
      instagram: 'https://instagram.com/talha'
    }
  },
  vareesha: {
    name: 'Vareesha',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Second-year medical student at KMC, dedicated to public health advocacy and pediatric clinical reasoning. Aiming to bridge the gap between education and clinical awareness.',
    socials: {
      linkedin: 'https://linkedin.com/in/vareesha',
      twitter: 'https://twitter.com/vareesha',
      instagram: 'https://instagram.com/vareesha'
    }
  }
};

export const HEALTH_ISSUES_PAKISTAN = [
  {
    title: 'Cardiovascular Diseases',
    description: 'Hypertension and Ischemic Heart Disease are leading causes of mortality in Pakistan due to high salt intake and lifestyle factors.'
  },
  {
    title: 'Diabetes Mellitus',
    description: 'Pakistan has one of the highest prevalence rates of Type 2 Diabetes globally, requiring massive public awareness campaigns.'
  },
  {
    title: 'Hepatitis (B & C)',
    description: 'Viral hepatitis remains a significant burden, often linked to unsafe clinical practices and lack of screening.'
  },
  {
    title: 'Respiratory Infections',
    description: 'Pneumonia and TB continue to be major public health concerns, exacerbated by air quality and population density.'
  }
];

export const HOW_IT_WORKS = [
  { step: '1', title: 'Symptom Entry', desc: 'Input your symptoms and medical history into the clinical module.' },
  { step: '2', title: 'Clinical Reasoning', desc: 'The AI model analyzes the descriptions based on academic medical protocols.' },
  { step: '3', title: 'Educational Output', desc: 'Receive a summary of considerations, triage advice, and academic context.' }
];

export const Icons = {
  LinkedIn: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
  ),
  Twitter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  Instagram: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
  ),
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  History: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
  ),
  Stethoscope: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2h0a2 2 0 0 0-2 2v12a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h0a.3.3 0 1 0 .2.3"/><path d="M9 16V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11"/><circle cx="12" cy="19" r="2"/></svg>
  ),
  Microphone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
  ),
  Print: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
  )
};
