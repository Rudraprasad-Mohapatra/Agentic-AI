export interface WordTiming {
  w: string;
  line: number;
  s: number;
  e: number;
}

export interface LineTiming {
  start: number;
  end: number;
  text: string;
}

export interface ScriptLine {
  text: string;
  voice_text?: string;
  caps?: string;
  gap?: number;
}

export interface ScriptData {
  title: string;
  voice?: string;
  speed?: number;
  music?: string;
  lines: ScriptLine[];
}

export interface ShortVideoProps {
  title: string;
  words: WordTiming[];
  audioSrc?: string;
  musicSrc?: string;
  sceneType?: 'walking-road' | 'explainer-3d' | 'mystery-3d';
}
