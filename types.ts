
export interface SymptomAnalysis {
  summary: string;
  considerations: string[];
  redFlagStatus: 'Normal' | 'Urgent' | 'Emergency';
  redFlagDetails: string;
  nextSteps: string;
  medicalEducation: string;
  disclaimer: string;
  isEmergencyOverride: boolean;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: number;
  input: string;
  result: SymptomAnalysis;
}
