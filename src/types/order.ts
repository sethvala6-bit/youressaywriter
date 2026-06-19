export interface OrderFormData {
  paperType: string;
  topic: string;
  academicLevel: string;
  wordCount: number;
  pages: number;
  citationStyle: string;
  deadline: Date;
  instructions: string;
  attachments: string[];
  preferences: {
    bestWriter?: boolean;
    premiumWriter?: boolean;
    top10?: boolean;
    draftRequest?: boolean;
    proofreading?: boolean;
    originalityReport?: boolean;
    urgentAssignment?: boolean;
  };
}

export interface PricingDetails {
  basePrice: number;
  writerMultiplier: number;
  urgencyMultiplier: number;
  additionalServices: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
}

export const PAPER_TYPES = [
  { value: 'essay', label: 'Essay' },
  { value: 'research-paper', label: 'Research Paper' },
  { value: 'dissertation', label: 'Dissertation' },
  { value: 'thesis', label: 'Thesis' },
  { value: 'coursework', label: 'Coursework' },
  { value: 'lab-report', label: 'Lab Report' },
  { value: 'case-study', label: 'Case Study' },
  { value: 'book-review', label: 'Book Review' },
  { value: 'movie-review', label: 'Movie Review' },
  { value: 'article-review', label: 'Article Review' },
];

export const ACADEMIC_LEVELS = [
  { value: 'high-school', label: 'High School' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'master', label: "Master's" },
  { value: 'phd', label: 'PhD' },
];

export const CITATION_STYLES = [
  { value: 'apa', label: 'APA' },
  { value: 'mla', label: 'MLA' },
  { value: 'chicago', label: 'Chicago' },
  { value: 'harvard', label: 'Harvard' },
];

export const WORDS_PER_PAGE = 250;
