export const environment = {
  production: true,
  // In production this is replaced by nginx reverse-proxying /api to the backend container,
  // so a relative path works without hardcoding a domain.
  apiUrl: '/api',
  oauth2GoogleLoginUrl: '/oauth2/authorization/google'
};
