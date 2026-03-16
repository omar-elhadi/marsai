import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, '6 caractères minimum')
});
import { useNavigate }  from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../services/api/apiClient';
import gsap             from 'gsap';
import { useGSAP }      from '@gsap/react';
import { useTranslation } from 'react-i18next';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation('admin'); // Assuming we create admin.json
  
  const pageRef     = useRef<HTMLDivElement>(null);
  const overlineRef = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema as any),
    defaultValues: { email: '', password: '' }
  });
  
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  useGSAP(() => {
    if(!pageRef.current) return;
    gsap.set(overlineRef.current, { opacity: 0, y: 12  });
    gsap.set(titleRef.current,    { opacity: 0, y: 26  });
    gsap.set(cardRef.current,     { opacity: 0, y: 22  });

    const tl = gsap.timeline({ delay: 0.10 });
    tl.to(overlineRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
    tl.to(titleRef.current,    { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.12);
    tl.to(cardRef.current,     { opacity: 1, y: 0, duration: 0.80, ease: 'power3.out' }, 0.28);
  }, { scope: pageRef });

  const onSubmit = async (data: any) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email: data.email, password: data.password });
      login(response.data.user || response.data);
      setSuccess(t('login.success'));
      setTimeout(() => navigate('/admin', { replace: true }), 800);
    } catch (err: any) {
      setError(err.response?.data?.error || t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen flex flex-col items-center justify-center p-8 bg-pure"
    >
      <div className="text-center mb-10 w-full max-w-md">
        <div ref={overlineRef} className="flex items-center justify-center gap-4 mb-5">
          <span className="block w-8 h-[1px] bg-accent" />
          <span className="text-xs uppercase tracking-widest text-text">{t('login.overline')}</span>
          <span className="block w-8 h-[1px] bg-accent" />
        </div>
        <h1 ref={titleRef} className="text-4xl text-text font-serif mb-4">
          {t('login.title')}
        </h1>
      </div>

      <div ref={cardRef} className="w-full max-w-[440px] p-8 border border-border border-l-2 border-l-accent bg-surface relative">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-text">{t('login.email')}</label>
            <input
              type="email"
              placeholder="admin@marsai.fr"
              {...register('email')}
              className="w-full bg-surface border border-border px-4 py-3 text-text placeholder:text-text-faint focus:border-accent focus:outline-none transition-colors"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-text">{t('login.password')}</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="w-full bg-surface border border-border px-4 py-3 text-text placeholder:text-text-faint focus:border-accent focus:outline-none transition-colors"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 border-l-2 border-l-red-500 text-red-500 text-xs tracking-wider">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-accent/10 border border-accent/20 border-l-2 border-l-accent text-accent text-xs tracking-wider">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 px-6 bg-accent text-pure text-xs tracking-widest uppercase font-bold hover:bg-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('login.loading') : t('login.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
