appcmd stop site app.buyersoft.com
xcopy "release" "C:\inetpub\wwwroot\app.buyersoft.com" /h /i /c /k /e /r /y
appcmd start site app.buyersoft.com