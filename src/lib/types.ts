
export interface TableData {
  id: number;
  title: string;
  content: string;
  type: string;
}

export interface Scene {
  num: number;
  headword: string;
  storyboard: string;
  pickey: string;
}

export interface CozeResponse {
  Foun_PIC: string;
  PIC_thum: string;
  excl: string;
  json: Array<{ image_url: string }>;
  output: string;
}

export interface CozeRequest {
  URL: string;
  Title: string;
  words?: number;
}
