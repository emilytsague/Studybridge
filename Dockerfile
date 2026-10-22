FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-venv libgomp1 \
    && rm -rf /var/lib/apt/lists/*
COPY scripts/voice-requirements.txt ./scripts/voice-requirements.txt
RUN python3 -m venv /app/.voice-runtime \
    && /app/.voice-runtime/bin/pip install --no-cache-dir -r scripts/voice-requirements.txt \
    && /app/.voice-runtime/bin/python -m piper.download_voices fr_FR-siwis-medium --download-dir /app/voices
COPY --chown=node:node package.json server.mjs speech.mjs ./
COPY --chown=node:node public ./public
COPY --chown=node:node scripts/narrate.py ./scripts/narrate.py
RUN mkdir -p /app/data && chown node:node /app/data
USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000 DATA_DIR=/app/data
VOLUME ["/app/data"]
EXPOSE 3000
CMD ["node", "server.mjs"]
