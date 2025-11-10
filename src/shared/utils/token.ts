import Cookies from 'js-cookie';

export const TOKEN_COOKIE_NAME = 'intra_redes_tmve_token';

export const getTokenFromCookie = (): string | undefined => {
  if (typeof document === 'undefined') {
    return undefined;
  }

  return Cookies.get(TOKEN_COOKIE_NAME);
};
