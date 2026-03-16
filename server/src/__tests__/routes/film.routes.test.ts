import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../index';
import * as filmService from '../../services/film.service';
import jwt from 'jsonwebtoken';

vi.mock('../../services/film.service');

describe('Film Routes - Integration', () => {
  describe('GET /api/films', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(app).get('/api/films');
      expect(res.status).toBe(403);
    });

    it('should return 200 and films for admin', async () => {
      const token = jwt.sign({ id: '1', role: 'ADMIN' }, process.env.JWT_SECRET || 'secret');
      vi.mocked(filmService.getFilms).mockResolvedValue([{ id: '1', title: 'Test Film' }] as any);

      const res = await request(app)
        .get('/api/films')
        .set('Cookie', [`marsai_token=${token}`]);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].title).toBe('Test Film');
    });
  });
});
