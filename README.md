# STAFF WARS

## 環境
Node.js 6.0.0を想定しています。
必要なモジュールのインストールは以下のコマンドでOKです。

```
npm i
```

## JavaScriptのトランスパイル
babelでトランスパイルをしています。
以下のコマンドで `_build` にトランスパイルされたjsが出力されます。

```
npm run build
```

## デプロイ
Circle CIで自動的に `npm run build` を実行した後に、build以下をコミット対象にしてGithubのmasterブランチにpushするようにしています。

https://circleci.com/gh/staffwars/staffwars

