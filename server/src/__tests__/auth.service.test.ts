import { describe, it, expect, vi } from 'vitest';
import * as authService from '../services/auth.service';
import { prismaMock } from './setup';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

vi.mock('argon2');
vi.mock('jsonwebtoken');

describe('Auth Service', () => {
  describe('loginAdmin', () => {
    const mockUser = {
      id: '1',
      email: 'admin@marsai.com',
      password: 'hashedpassword',
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      loginToken: null,
      tokenExpires: null
    };

    it('should successfully log in a valid user', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(argon2.verify).mockResolvedValue(true);
      vi.mocked(jwt.sign).mockReturnValue('mock-jwt-token' as any);

      const result = await authService.loginAdmin('admin@marsai.com', 'password123');

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@marsai.com' }
      });
      expect(argon2.verify).toHaveBeenCalledWith('hashedpassword', 'password123');
      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).toEqual({
        id: '1',
        email: 'admin@marsai.com',
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User'
      });
    });

    it('should throw "Identifiants incorrects." for non-existent user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(authService.loginAdmin('wrong@marsai.com', 'pwd')).rejects.toThrow('Identifiants incorrects.');
    });

    it('should throw "Identifiants incorrects." for invalid password', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(argon2.verify).mockResolvedValue(false);

      await expect(authService.loginAdmin('admin@marsai.com', 'wrongpwd')).rejects.toThrow('Identifiants incorrects.');
    });
  });
});
