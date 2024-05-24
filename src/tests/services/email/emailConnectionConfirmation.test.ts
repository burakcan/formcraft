import { emailConnectionConfirmation } from '@/services/email/emailConnectionConfirmation';
import { sendMail } from '@/services/email';
import type { Craft } from '@prisma/client';

jest.mock('@/services/email', () => ({
  sendMail: jest.fn(),
}));

describe('emailConnectionConfirmation', () => {
  const email = 'test@example.com';
  const code = '123456';
  const craft: Craft = {
    id: 'craftId',
    title: 'Test Craft',
    userId: 'userId',
    organizationId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    archivedAt: null,
  };

  it('should call sendMail with correct parameters', async () => {
    await emailConnectionConfirmation(email, code, craft);

    expect(sendMail).toHaveBeenCalledWith(
      email,
      'Confirm your email connection',
      expect.stringContaining('You are receiving this email because you have requested to connect your email to "Test Craft".'),
      expect.stringContaining('<p>You are receiving this email because you have requested to connect your email to "Test Craft".</p>')
    );
  });
});
