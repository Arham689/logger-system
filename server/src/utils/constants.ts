import { z } from 'zod';
export const TAG_OPTIONS = [
    'first_log',
    'recent',
    'favorite',
    'useful',
    'repeating',
    'error',
    'warning',
    'info',
    'debug',
    'critical',
    'archived',
    'manual',
    'auto_generated',
] as const;

export const eventTypeEnum = z.enum(['LOGIN', 'LOGOUT', 'PAGE_VISIT', 'ERROR', 'WARNING', 'API_CALL']);
