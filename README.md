# 個人情報の収集について

個人情報を収集しません。

# 注意事項

- code 要素で囲われたキーワードがたまに一瞬ちらつく（文章が動いているように見える）のは、日本語化されてしまったキーワードを元に戻しているためです。<br>
  ※日本語化の例：`client`→`クライエント`、`store`→`店`など

- シングルページアプリケーションで翻訳後に読み込まれたコンテンツは、拡張機能が span に置き換えるより先に翻訳が走るため、拡張機能が機能しません。

# 不具合

- 一部サイトで span 要素が配置されず単語が見えなくなるバグを確認しています。

# 使い方

## 拡張機能のオプション

code 要素から抽出する CSS のプロパティ名や属性のキーを設定できます。

## 拡張機能のオプションページの「補足されたスタイルのエラー」について

抽出しようとした CSS のプロパティ名が、code 要素から取得できないときここに表示されます。

## 拡張機能のポップアップについて

ツールバーのこの拡張機能のアイコンをクリックすると、拡張機能のオンオフを設定するウィンドウが表示されます（バージョン 3 から）。

# アップデート

拡張機能のアップデートは Microsoft Edge アドオン ストアの審査を受けるため、ここに書かれているアップデート内容が反映されていない可能性があります。

## バージョン 4 のアップデート内容

code で囲まれた単語が日本語化されてしまったときの再置き換えが機能しないことがあったため修正しました。

※日本語化の例：`client`→`クライエント`

## バージョン 3 のアップデート内容

### 機能の修正と、それに伴う機能の削除

1. code の代わりを span の::before 疑似要素で表示しなくなりました。そのため置き換えられたキーワードがそのままドラッグで選択できるようになりました。
2. 1 の修正により、code で囲まれていたキーワードが英語から日本語に翻訳(例えば client がクライエントになったりする)されてしまってもおそらく自動で戻ります。戻らない場合はバグです。
3. 1 の修正により、「元の単語をそのまま表示する」オプションが不要になったため削除しました。

### 機能の追加

ツールバーのこの拡張機能のアイコンのクリックで、置き換えのオンオフを設定するウィンドウが表示されるようにしました。
置き換えがオンの場合、拡張機能のアイコンにチェックボックスが表示されるようにしました。
