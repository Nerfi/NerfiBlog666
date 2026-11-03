// Redirects plain HTTP to HTTPS, then serves the static site.
// Needed because "Always Use HTTPS" is a zone setting and workers.dev is not our zone.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
