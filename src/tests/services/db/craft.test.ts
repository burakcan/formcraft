import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getCraft, getWorkingCraftVersion, getCraftAndEditingVersion, getCraftConnections } from '../../../services/db/craft';
import db from '../../../services/db';

jest.mock('../../../services/db', () => ({
  default: {
    craft: {
      findFirst: jest.fn(),
    },
    craftVersion: {
      findFirst: jest.fn(),
    },
  },
}));

describe('DB Craft Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCraft', () => {
    it('should call findFirst with correct parameters', async () => {
      const id = 'testId';
      const userId = 'testUserId';
      const orgId = 'testOrgId';

      await getCraft(id, userId, orgId);

      expect(db.craft.findFirst).toHaveBeenCalledWith({
        where: {
          id: id,
          organizationId: orgId || null,
          userId: !orgId ? userId : undefined,
        },
        include: {
          craftVersions: {
            orderBy: {
              updatedAt: "desc",
            },
            select: {
              publishedAt: true,
            },
            take: 1,
          },
          _count: {
            select: {
              craftVersions: {
                where: {
                  publishedAt: {
                    not: null,
                  },
                },
              },
            },
          },
        },
      });
    });
  });

  describe('getWorkingCraftVersion', () => {
    it('should call findFirst with correct parameters', async () => {
      const id = 'testId';
      const userId = 'testUserId';
      const orgId = 'testOrgId';

      await getWorkingCraftVersion(id, userId, orgId);

      expect(db.craftVersion.findFirst).toHaveBeenCalledWith({
        where: {
          craft: {
            id: id,
            organizationId: orgId || null,
            userId: !orgId ? userId : undefined,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });
  });

  describe('getCraftAndEditingVersion', () => {
    it('should retrieve craft and editing version', async () => {
      const craft_id = 'testCraftId';
      db.craft.findFirst.mockResolvedValueOnce({ id: craft_id });
      db.craftVersion.findFirst.mockResolvedValueOnce({ id: 'testVersionId' });

      const result = await getCraftAndEditingVersion(craft_id);

      expect(result).toEqual({
        craft: { id: craft_id },
        editingVersion: { id: 'testVersionId' },
      });
    });
  });

  describe('getCraftConnections', () => {
    it('should retrieve craft connections', async () => {
      const craft_id = 'testCraftId';
      db.craft.findFirst.mockResolvedValueOnce({
        emailConnection: { email: 'test@example.com', confirmedAt: new Date() },
        webhookConnection: { url: 'http://example.com/webhook', secret: 'secret' },
        googleSheetsConnection: { sheetId: 'sheetId', sheetUrl: 'http://example.com/sheet' },
      });

      const result = await getCraftConnections(craft_id);

      expect(result).toEqual({
        email: { email: 'test@example.com', confirmedAt: expect.any(Date) },
        webhook: { url: 'http://example.com/webhook', secret: 'secret' },
        googleSheets: { sheetId: 'sheetId', sheetUrl: 'http://example.com/sheet' },
      });
    });
  });
});
