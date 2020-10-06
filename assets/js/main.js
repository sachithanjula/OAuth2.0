$(document).ready(function () {
 
   var OAuthClientId = "64773395367 9-iu3b6iuds3tcp9qkgko18tvabbeo06fi.apps.googleusercontent.com";

  var OAuthRedirectURI = "http://localhost:8080/GoogleDrive/upload.html";

  var OAuthscope = "https://www.googleapis.com/auth/drive";

  var URL = "";

  $("#login").click(function () {
     signIn(OAuthClientId, OAuthRedirectURI, OAuthscope, URL);
  });

  function signIn(ClientId, RedirectURI, Scope, URL) {
   URL =
      "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=" +
      RedirectURI +
      "&prompt=consent&response_type=code&client_id=" +
      ClientId +
      "&scope=" +
      Scope +
      "&access_type=offline";

     window.location = URL;
  }
});
