FROM node:20-slim

WORKDIR /app

# package.jsonが存在する場合のみコピーしてインストール
# (初回起動時はファイルがないため、エラー回避の工夫が必要ですが
#  今回は初期化コマンドを使うのでシンプルにします)
COPY package*.json ./
# もしpackage.jsonがあればインストール、なければ何もしない
RUN if [ -f package.json ]; then npm install; fi

COPY . .