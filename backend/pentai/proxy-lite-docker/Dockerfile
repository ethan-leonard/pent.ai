FROM pytorch/pytorch:2.1.2-cuda12.1-cudnn8-devel

WORKDIR /app

# Install dependencies
RUN pip install uv

# Install Git
RUN apt-get update && apt-get install -y git

# Clone and install Proxy-Lite
RUN git clone https://github.com/convergence-ai/proxy-lite.git /app
WORKDIR /app

# Set up the environment
RUN uv venv --python 3.11 --python-preference managed
RUN uv sync
RUN uv pip install -e .

# Install Playwright
RUN pip install playwright && playwright install

# Install vLLM for model serving
RUN pip install vllm transformers

# Expose port for API
EXPOSE 8008

# Set the entry point to serve the model
ENTRYPOINT ["vllm", "serve", "convergence-ai/proxy-lite-3b", \
    "--trust-remote-code", \
    "--enable-auto-tool-choice", \
    "--tool-call-parser", "hermes", \
    "--port", "8008", \
    "--enforce-eager", \
    "--device", "cpu"]
