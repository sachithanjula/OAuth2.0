$(document).ready(function () {

  const URLParams = new URLSearchParams(window.location.search);
  const Code = URLParams.get("code");
  const OAuthRedirectURI = "http://localhost:8080/GoogleDrive/upload.html";
  const OAuthClientSecret = "qr7FtRATWD5vb0748W3ZIEEp";
  const OAuthscope = "https://www.googleapis.com/auth/drive";
  var OAuthClientId = "647733953679-iu3b6iuds3tcp9qkgko18tvabbeo06fi.apps.googleusercontent.com";

  $.ajax({
    type: "POST",
    url: "https://www.googleapis.com/oauth2/v4/token", // get accesstocken
    data: {
      code: Code,
      redirect_uri: OAuthRedirectURI,
      client_secret: OAuthClientSecret,
      client_id: OAuthClientId,
      scope: OAuthscope,
      grant_type: "authorization_code",
    },
    dataType: "json",
    success: function (resultData) {
      localStorage.setItem("accessToken", resultData.access_token);
      console.log("accessToken: "+resultData.access_token);
      localStorage.setItem("refreshToken", resultData.refreshToken);
      console.log("refreshToken: "+resultData.refreshToken);
      localStorage.setItem("expires_in", resultData.expires_in);
      console.log("expires_in: "+resultData.expires_in);
      window.history.pushState(
        {},
        document.title,
        "/GoogleDrive/" + "upload.html"
      );
    },
  });

  var UploadFile = function (file) {
    this.file = file;
  };

  UploadFile.prototype.getType = function () {
    console.log("type: "+this.file.type);
    localStorage.setItem("type", this.file.type);
    return this.file.type;
  };
  UploadFile.prototype.getSize = function () {
    console.log("size: "+this.file.size);
    localStorage.setItem("size", this.file.size);
    return this.file.size;
  };
  UploadFile.prototype.getName = function () {
    console.log("2");
    console.log("file name: "+this.file.name);
    return this.file.name;
  };
  UploadFile.prototype.doUpload = function () {
    console.log("1");
    var that = this;
    var formData = new FormData();
    console.log("3");
    console.log("---------- "+this.file+" --------- "+this.getName());
    formData.append("file", this.file, this.getName());
    formData.append("upload_file", true);

    $.ajax({
      type: "POST",
      beforeSend: function (request) {
        request.setRequestHeader(
          "Authorization",
          "Bearer" + " " + localStorage.getItem("accessToken") //set access tocken
        );
      },
      url: "https://www.googleapis.com/upload/drive/v2/files",
      data: {
        uploadType: "media",
      },
      xhr: function () {
        var myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          myXhr.upload.addEventListener(
            "progress",
            that.progressHandling,
            false
          );
        }
        console.log("myXhr: "+myXhr);
        return myXhr;
      },
      success: function (data) {
        console.log("success: "+data);
        location.reload();
      },
      error: function (error) {
        console.log("error: "+error);
      },
      async: true,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      timeout: 60000,
    });
  };

  UploadFile.prototype.progressHandling = function (event) {
    var Percent = 0;
    var Position = event.loaded || event.position;
    var Total = event.total;
    var ProgressBar = "#progress-wrp";
    if (event.lengthComputable) {
      Percent = Math.ceil((Position / Total) * 100);
    }
    // update progressbars classes so it fits your code
    $(ProgressBar + " .progress-bar").css("width", +Percent + "%");
    $(ProgressBar + " .status").text(Percent + "%");
  };

  $("#upload").on("click", function (e) {
    var file = $("#files")[0].files[0];
    var upload = new UploadFile(file);
    console.log("upload: "+upload);
    upload.doUpload();
  });
});
