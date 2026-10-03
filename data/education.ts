export interface Education {
  id: string;
  qualification: string;
  /** Short form for compact contexts, e.g. "M.Inf.Sys.". */
  abbreviation?: string;
  institution: string;
  /** Display string, kept as written on the original CV. */
  dates: string;
  /** YYYY-MM, used to place study periods on the experience timeline. */
  start?: string;
  end?: string;
  /** Short label for the experience timeline rail. */
  railLabel?: string;
  /** Tertiary institutions are listed as alumniOf in structured data. */
  tertiary: boolean;
}

export const education: Education[] = [
  {
    id: 'usq',
    qualification: "Master's in Information Systems",
    abbreviation: 'M.Inf.Sys.',
    institution: 'University of Southern Queensland',
    dates: 'Jul 2019 – Aug 2021',
    start: '2019-07',
    end: '2021-08',
    railLabel: "Master's · USQ",
    tertiary: true,
  },
  {
    id: 'kist',
    qualification: "Bachelor's in Information Technology",
    institution: 'KIST College (Purbanchal University)',
    dates: 'Feb 2014 – Dec 2018',
    tertiary: true,
  },
  {
    id: 'gyankunj',
    qualification: '+2 in Computer Science',
    institution: 'Gyankunj College',
    dates: '2012 – 2014',
    tertiary: false,
  },
];
