/**
 * LoaderContext.jsx — MARSAI Festival · Phase 12
 *
 * Contexte React qui coordonne le loader initial avec les composants
 * de la page — notamment HeroImpact qui attend le signal "prêt".
 *
 * Usage :
 *   import { useLoader } from '@/context/LoaderContext';
 *   const { loaderReady } = useLoader();
 */

import { createContext, useContext } from 'react';

export const LoaderContext = createContext({ loaderReady: true });

export function useLoader() {
  return useContext(LoaderContext);
}