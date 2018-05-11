CD /d %~dp0
CALL npm outdated
CALL phonegap platform remove android
CALL phonegap platform remove browser
CALL phonegap platform remove ios
CALL phonegap platform remove windows
CALL npm update
sed -i -E "s/git\+(https:[^+]*).git/\1/g" ./package.json
CALL phonegap platform add android@7.1.0
CALL phonegap platform add browser@5.0.3
CALL phonegap platform add ios@4.5.4
CALL phonegap platform add windows@6.0.0
