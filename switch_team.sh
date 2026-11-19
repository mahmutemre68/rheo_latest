#!/bin/bash
# Rheo — yeni Apple Developer hesabina gecis
#
# Eski takim 43N65KD2PC (Furkan Ahi) altinda imzalanmis her sey yeni hesapta
# gecersiz. Bu betik projedeki takim kimligini ve (istenirse) bundle id'yi
# tek seferde degistirir. Yeni uyelik AKTIF OLDUKTAN ve Xcode'da yeni hesapla
# oturum acildiktan SONRA calistirin.
#
# Kullanim:
#   ./switch_team.sh <YENI_TEAM_ID> [YENI_BUNDLE_ID]
#
# Ornek:
#   ./switch_team.sh AB12CD34EF
#   ./switch_team.sh AB12CD34EF com.rheo.app
#
# Bundle id vermezseniz com.rheo.rheoApp korunur — bu yalnizca o kimligi eski
# hesaptan serbest biraktiysaniz calisir (bkz. README notu asagida).

set -euo pipefail

OLD_TEAM="43N65KD2PC"
OLD_BUNDLE="com.rheo.codejourney"

NEW_TEAM="${1:-}"
NEW_BUNDLE="${2:-$OLD_BUNDLE}"

if [ -z "$NEW_TEAM" ]; then
  echo "Kullanim: $0 <YENI_TEAM_ID> [YENI_BUNDLE_ID]" >&2
  exit 1
fi

cd "$(dirname "$0")/rheo_app"

echo "Takim : $OLD_TEAM  ->  $NEW_TEAM"
echo "Bundle: $OLD_BUNDLE  ->  $NEW_BUNDLE"
echo

# 1) Xcode projesi
sed -i '' "s/$OLD_TEAM/$NEW_TEAM/g" ios/Runner.xcodeproj/project.pbxproj
echo "  guncellendi: ios/Runner.xcodeproj/project.pbxproj"

# 2) Export options (hem yukleme hem yerel disa aktarma)
for f in ios/ExportOptions.plist ios/ExportOptions-local.plist; do
  [ -f "$f" ] || continue
  sed -i '' "s/$OLD_TEAM/$NEW_TEAM/g" "$f"
  echo "  guncellendi: $f"
done

# 3) Bundle id degistiyse
if [ "$NEW_BUNDLE" != "$OLD_BUNDLE" ]; then
  sed -i '' "s/$OLD_BUNDLE/$NEW_BUNDLE/g" \
    ios/Runner.xcodeproj/project.pbxproj \
    ios/ExportOptions.plist ios/ExportOptions-local.plist
  echo "  guncellendi: bundle id tum yapilandirmalarda"
  echo
  echo "  !! Firebase: ios/Runner/GoogleService-Info.plist hala $OLD_BUNDLE icin."
  echo "     Firebase konsolunda ($(plutil -extract PROJECT_ID raw ios/Runner/GoogleService-Info.plist 2>/dev/null || echo rheo-mvp-2026))"
  echo "     $NEW_BUNDLE icin yeni bir iOS uygulamasi ekleyip yeni plist'i indirin"
  echo "     ve bu dosyanin uzerine yazin. Yoksa Analytics/Crashlytics calismaz."
fi

# 4) Imzalama otomatige alindi; Xcode yeni takim icin sertifika ve profili
#    kendisi olusturur. Elle profil olusturmaniza gerek yok.

echo
echo "Sonraki adimlar:"
echo "  1) Xcode > Settings > Accounts: yeni hesabin ekli oldugunu dogrulayin"
echo "  2) flutter clean && flutter pub get"
echo "  3) node build_and_sync.js   (repo kokunden)"
echo "  4) cd rheo_app && flutter build ipa --export-options-plist=ios/ExportOptions-local.plist"
