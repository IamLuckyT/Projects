
import { Candidate, Language } from './types';

export const ADMIN_USERNAME = 'Obakeng@Admin';
export const ADMIN_PASSWORD = 'Obakeng@Admin';

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: 'Thabo Molefe',
    language: Language.TSWANA,
    votes: 0,
    bio: 'Champion for local education and Tswana heritage preservation.'
  },
  {
    id: 2,
    name: 'Kagiso Mpho',
    language: Language.TSWANA,
    votes: 0,
    bio: 'Advocating for sustainable agriculture and rural development.'
  },
  {
    id: 3,
    name: 'Sibusiso Dlamini',
    language: Language.ZULU,
    votes: 0,
    bio: 'Focused on urban infrastructure and Zulu cultural outreach.'
  },
  {
    id: 4,
    name: 'Nokuthula Zungu',
    language: Language.ZULU,
    votes: 0,
    bio: 'Dedicated to women\'s empowerment and small business grants.'
  }
];

export const STORAGE_KEYS = {
  USERS: 'eday_users',
  CANDIDATES: 'eday_candidates',
  CURRENT_USER: 'eday_current_user'
};
