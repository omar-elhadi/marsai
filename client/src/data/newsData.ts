export interface NewsItem {
  id: string;
  tag: string;
  date: string;
  image: string;
  title: string;
  content: string;
}

export interface NewsSection {
  type: string;
  label?: string;
  title?: string;
  paragraphs?: string[];
  text?: string;
  author?: string;
  items?: Array<{
    value?: string;
    label?: string;
    time?: string;
    title?: string;
    sub?: string;
    meta?: string;
    category?: string;
  }>;
}

export interface NewsDetail {
  id: string;
  tag: string;
  date: string;
  image: string;
  title: string;
  lead: string;
  category: string;
  sections: NewsSection[];
  related: number[];
}

export const newsItems: NewsItem[] = [];

export const tagColors: Record<string, string> = {
  festival: "#f0ece4",
  technic: "#e2d1c3",
  interview: "#d4c4b0",
  edition: "#c4b8a8",
};

export const newsDetailData: Record<number, NewsDetail> = {};
