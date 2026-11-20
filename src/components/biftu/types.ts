export interface AgentRelease {
  version: string;
  name: string;
  date: string;
  isNew?: boolean;
}

export interface AgentCard {
  id: string;
  number: string;
  title: string;
  description: string;
  youGet: string;
  category: string;
  isNew?: boolean;
  features: string[];
}

export interface BenchmarkModel {
  rank: number;
  name: string;
  passRate: number;
  confidenceInterval: [number, number];
}

export interface MetricFact {
  label: string;
  value: string;
  caption: string;
}

export interface OpenRole {
  id: string;
  title: string;
  description: string;
  location: string;
  team: string;
  type: string;
}
