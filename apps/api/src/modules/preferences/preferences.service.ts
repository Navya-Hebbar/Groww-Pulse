import { prisma } from '../../db.js';
import { UpdatePreferencesInput } from './preferences.schema.js';

export class PreferencesService {
  async getPreferences(userId: string) {
    return prisma.userPreference.findUnique({
      where: { userId },
    });
  }

  async updatePreferences(userId: string, data: UpdatePreferencesInput) {
    return prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }
}

export const preferencesService = new PreferencesService();
