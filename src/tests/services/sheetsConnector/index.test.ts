import { getOAuth2Client, syncNamedRanges, syncAllAnswers, appendSingleAnswer } from '@/services/sheetsConnector';
import db from '@/services/db';
import { google } from 'googleapis';

jest.mock('@/services/db');
jest.mock('googleapis');

describe('SheetsConnector Service', () => {
  describe('getOAuth2Client', () => {
    it('should create and return an OAuth2Client instance', async () => {
      const mockSetCredentials = jest.fn();
      const mockOAuth2Client = jest.fn(() => ({
        setCredentials: mockSetCredentials,
      }));
      google.auth.OAuth2 = mockOAuth2Client;

      await getOAuth2Client('craftId');

      expect(mockOAuth2Client).toHaveBeenCalled();
      expect(mockSetCredentials).toHaveBeenCalled();
    });
  });

  describe('syncNamedRanges', () => {
    it('should call syncNamedRanges function with craftId', async () => {
      const mockSyncNamedRanges = jest.spyOn(db, 'syncNamedRanges');
      await syncNamedRanges('craftId');
      expect(mockSyncNamedRanges).toHaveBeenCalledWith('craftId');
    });
  });

  describe('syncAllAnswers', () => {
    it('should call syncAllAnswers function with craftId', async () => {
      const mockSyncAllAnswers = jest.spyOn(db, 'syncAllAnswers');
      await syncAllAnswers('craftId');
      expect(mockSyncAllAnswers).toHaveBeenCalledWith('craftId');
    });
  });

  describe('appendSingleAnswer', () => {
    it('should call appendSingleAnswer function with craftId and answerId', async () => {
      const mockAppendSingleAnswer = jest.spyOn(db, 'appendSingleAnswer');
      await appendSingleAnswer('craftId', 'answerId');
      expect(mockAppendSingleAnswer).toHaveBeenCalledWith('craftId', 'answerId');
    });
  });
});
