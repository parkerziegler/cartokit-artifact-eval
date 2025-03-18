# Use Node LTS version
FROM node:22.13.1

# Install playwright from Microsoft's Docker image
FROM mcr.microsoft.com/playwright:v1.48.0-noble

# Configure pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# # Install pnpm and corepack
RUN npm install -g corepack@0.31.0
RUN corepack enable pnpm
RUN corepack use pnpm@9.12.1

# Clone the artifact eval
WORKDIR /app
RUN git clone https://github.com/parkerziegler/cartokit-artifact-eval .
RUN pnpm install

# Configure environment variables for cartokit
WORKDIR /app/packages/cartokit
RUN touch .env.local
RUN echo "PUBLIC_MAPTILER_API_KEY = KhVXZG9hZRJpdcpRoCAP\nVERCEL_ENV = development" > .env.local

# Create the run script
WORKDIR /app
COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

# Set the number of trials for the benchmarks
ENV TRIALS=3

# Run the workflow when container starts
CMD ["/app/run.sh"]