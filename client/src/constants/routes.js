/**
 * routes.js — MARSAI Festival
 * Source unique de vérité pour toutes les routes de l'application.
 *
 * ═══════════════════════════════════════════════════════════════
 * RÈGLE ABSOLUE — Kodawari
 * ═══════════════════════════════════════════════════════════════
 *
 * Aucune string de chemin ("/contact", "/galerie"...) ne doit
 * apparaître dans un composant. Tout import doit référencer
 * cette constante. Toute modification de route se fait ici
 * et se propage partout automatiquement.
 *
 * Convention de nommage :
 *   UPPER_SNAKE_CASE pour les clés.
 *   Valeurs identiques aux path= définis dans App.jsx.
 *
 * Routes admin (ADMIN_FILMS, ADMIN_USERS, ADMIN_AWARDS) :
 *   Ces valeurs sont des chemins RELATIFS — utilisés dans des
 *   <Route> imbriqués sous /admin. Ne pas préfixer par '/admin/'.
 *   React Router v6 résout ces chemins relativement au parent.
 * ═══════════════════════════════════════════════════════════════
 */

export const ROUTES = {

  // ── Pages publiques principales ──────────────────────────────
  HOME:                      '/',
  NEWS:                      '/news',
  EVENTS:                    '/events',
  GALERIE:                   '/galerie',
  SOUMETTRE:                 '/soumettre',
  CONTACT:                   '/contact',
  REGLEMENT:                 '/reglement',

  // ── Film ─────────────────────────────────────────────────────
  // FILM_DETAIL : chemin complet avec paramètre — usage dans <Route path=…>
  // FILM_BASE   : chemin sans paramètre — usage dans startsWith() (PageTransitionLayer)
  FILM_DETAIL:               '/film/:id',
  FILM_BASE:                 '/film',
  EDIT_FILM:                 '/edit-film/:token',
  TRACKING:                  '/suivi',
  PALMARES:                  '/palmares',

  // ── Pages secondaires ────────────────────────────────────────
  NEWSLETTERS:               '/Newsletters',
  FAQ:                       '/FAQ',
  CALENDRIER:                '/calendrier',
  REGLES_CONDITIONS:         '/regles-conditions',

  // ── Pages légales ────────────────────────────────────────────
  MENTION:                   '/Mention',
  COOKIES:                   '/cookies',
  POLITIQUE_CONFIDENTIALITE: '/PolitiqueDeConfidentialite',
  CONDITIONS_UTILISATIONS:   '/conditions-utilisations',

  // ── Authentification ─────────────────────────────────────────
  LOGIN:                     '/login',
  LOGIN_VERIFY:              '/login/verify',
  CONNECTION_PAGE:           '/ConnectionPage',

  // ── Jury ─────────────────────────────────────────────────────
  VOTES_JURY:                '/VotesJury',
  JURY_DASHBOARD:            '/jury/dashboard',
  JURY_FILM_DETAIL:          '/jury/film/:id',

  // ── Admin — chemins RELATIFS (imbriqués sous /admin) ─────────
  ADMIN:                     '/admin',
  ADMIN_FILMS:               'films',
  ADMIN_USERS:               'users',
  ADMIN_AWARDS:              'awards',

};